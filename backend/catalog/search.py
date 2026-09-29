"""Product search, done by PostgreSQL. All the search rules of the shop live in this file.

- Full-text search: PostgreSQL reduces words to their root ("mugs" -> "mug", "knives" -> "knife"),
  so a search finds other forms of the same word, and it ranks the results.
- Weights: a match in the name counts most (A), then the category (B), then the description (C).
- Typo tolerance: "trigram" similarity compares the search with product names in pieces of three
  letters, so "headphnes" still finds "Headphones".
"""

import difflib
import re

from django.contrib.postgres.search import (
    SearchHeadline,
    SearchQuery,
    SearchRank,
    SearchVector,
    TrigramWordSimilarity,
)
from django.db.models import Case, F, FloatField, IntegerField, Q, Value, When
from django.db.models.expressions import ExpressionWrapper

CONFIG = 'english'  # which language's word roots and stop words ("the", "and") PostgreSQL uses
# How similar (0 to 1) a name must be to count as "probably a typo of it". Tuned on the shop's
# product names: high enough to skip unrelated products, low enough to forgive 1-2 wrong letters.
TYPO_SIMILARITY = 0.35
# The matched words in a description snippet are wrapped in these two invisible control
# characters. The frontend turns them into highlights without ever treating text as HTML.
MARK_START, MARK_END = '\x02', '\x03'
SUGGESTION_LIMIT = 6

_WORD = re.compile(r'[a-z0-9]+')


def _document():
    """The searchable "document" of a product: its name, category and description, weighted."""
    return (
        SearchVector('name', weight='A', config=CONFIG)
        + SearchVector('category__name', weight='B', config=CONFIG)
        + SearchVector('description', weight='C', config=CONFIG)
    )


def _query(text):
    # "websearch" understands what people type in search boxes: "exact phrase", -exclude, or.
    return SearchQuery(text, search_type='websearch', config=CONFIG)


def _split(text):
    """The words to look for, and the words to leave out ("knife -chef" -> ["knife"], ["chef"])."""
    wanted, unwanted = [], []
    for token in text.lower().replace('"', ' ').split():
        if token == 'or':
            continue
        (unwanted if token.startswith('-') else wanted).append(token.lstrip('-'))
    return ' '.join(wanted), [word for word in unwanted if word]


def search_products(queryset, text):
    """Products matching the search, each annotated with:
    relevance (for "Best match" ordering) and search_snippet (the description with highlights).

    The typo check is a fallback: when some products contain the typed words themselves, only
    those are shown ("pens" finds pens, not also "Pencil"). Only when nothing matches exactly
    do look-alike names count ("headphnes" -> Headphones).
    """
    query = _query(text)
    wanted, unwanted = _split(text)

    queryset = queryset.alias(document=_document()).annotate(
        search_rank=SearchRank(_document(), query),
        # Typo check against the name, using only the wanted words (not the -excluded ones).
        name_similarity=TrigramWordSimilarity(wanted or text, 'name'),
    )
    exact = queryset.filter(document=query)
    queryset = exact if exact.exists() else queryset.filter(name_similarity__gte=TYPO_SIMILARITY)

    # "-chef" must also hide products that only the typo check found.
    for word in unwanted:
        queryset = queryset.exclude(document=_query(word))

    return queryset.annotate(
        # Real word matches (rank) count double compared with look-alike names (similarity).
        relevance=ExpressionWrapper(F('search_rank') + F('name_similarity') * 0.5, output_field=FloatField()),
        search_snippet=SearchHeadline(
            'description', query, config=CONFIG,
            start_sel=MARK_START, stop_sel=MARK_END, max_words=18, min_words=8,
        ),
    )


def has_exact_match(queryset, text):
    """Does any product contain the searched words themselves (in any word form)?"""
    return queryset.alias(document=_document()).filter(document=_query(text)).exists()


def did_you_mean(queryset, text):
    """A corrected search ("headphones") when nothing matches the words exactly, else None.

    Each unknown word is swapped for the closest word from the shop's own product and
    category names. With thousands of products, that word list would be cached or built
    by PostgreSQL (ts_stat) instead of in Python.
    """
    wanted, _ = _split(text)
    words = _WORD.findall(wanted)
    if not words or has_exact_match(queryset, text):
        return None

    vocabulary = set()
    for name, category in queryset.values_list('name', 'category__name').distinct():
        vocabulary.update(word for word in _WORD.findall(f'{name} {category}'.lower()) if len(word) >= 3)

    corrected = [
        word if word in vocabulary else next(iter(difflib.get_close_matches(word, vocabulary, n=1, cutoff=0.75)), word)
        for word in words
    ]
    suggestion = ' '.join(corrected)
    if suggestion == ' '.join(words) or not has_exact_match(queryset, suggestion):
        return None
    return suggestion


def suggest(queryset, text, limit=SUGGESTION_LIMIT):
    """Product names for the dropdown while typing: names containing the text first, then look-alikes."""
    text = text.strip()
    if len(text) < 2:
        return queryset.none()
    return (
        queryset.annotate(
            similarity=TrigramWordSimilarity(text, 'name'),
            contains=Case(When(name__icontains=text, then=Value(1)), default=Value(0), output_field=IntegerField()),
        )
        .filter(Q(contains=1) | Q(similarity__gte=TYPO_SIMILARITY))
        .order_by('-contains', '-similarity', 'name')[:limit]
    )
