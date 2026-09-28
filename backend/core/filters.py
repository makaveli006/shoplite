from rest_framework.filters import OrderingFilter


class StableOrderingFilter(OrderingFilter):
    """OrderingFilter that always adds "-id" as a final tie-breaker.

    If two rows have the same value (e.g. the same price), the database may return
    them in any order, so a row could appear on two pages or on none. Ending the
    ORDER BY with a unique column makes the order fixed.
    """

    def get_ordering(self, request, queryset, view):
        ordering = super().get_ordering(request, queryset, view)
        if ordering and 'id' not in ordering and '-id' not in ordering:
            ordering = [*ordering, '-id']
        return ordering
