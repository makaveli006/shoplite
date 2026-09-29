"""What all our emails have in common: the templates, product pictures, prices, and sending.

Every email is sent twice in one message: a plain-text version (for text-only mail apps and
spam filters) and an HTML version (what people normally see). Both come from templates in
templates/emails/: <name>.txt and <name>.html.
"""

import base64
import io
import logging
from decimal import Decimal
from email.mime.image import MIMEImage

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from PIL import Image, ImageOps

logger = logging.getLogger(__name__)

CURRENCY_SYMBOLS = {'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹'}
THUMBNAIL_SIZE = (160, 160)  # shown at 64x64; the extra pixels keep it sharp on high-resolution screens


def format_money(amount):
    """Decimal('1234.5') -> '$1,234.50' (or 'CHF 1,234.50' for currencies without a symbol here)."""
    amount = Decimal(amount).quantize(Decimal('0.01'))
    symbol = CURRENCY_SYMBOLS.get(settings.SHOP_CURRENCY)
    return f'{symbol}{amount:,}' if symbol else f'{settings.SHOP_CURRENCY} {amount:,}'


def product_thumbnail(product):
    """A small square JPEG of the product's picture, or None when there is nothing to show.

    None when the product was deleted, has no picture, or the file is missing or broken:
    the email then shows a placeholder instead of failing.
    """
    if product is None or not product.image:
        return None
    try:
        with Image.open(product.image.path) as picture:
            # JPEG has no transparency: put transparent pictures on a white background.
            picture = picture.convert('RGBA')
            flat = Image.new('RGB', picture.size, 'white')
            flat.paste(picture, mask=picture.getchannel('A'))
        # Cut to a centred square and shrink, so every picture in the list has the same shape.
        square = ImageOps.fit(flat, THUMBNAIL_SIZE)
        buffer = io.BytesIO()
        square.save(buffer, format='JPEG', quality=85)
        return buffer.getvalue()
    except (OSError, ValueError):  # missing file, not a picture, damaged file
        logger.warning('Could not make an email thumbnail for product %s', product.pk, exc_info=True)
        return None


class InlineImages:
    """Collects the pictures of one email.

    mode 'cid': the pictures travel inside the email as attachments and the HTML points at
    them with "cid:..." addresses. This works in every mail app, even when the shop's own
    server can't be reached from the internet (Gmail fetches normal image links from
    Google's servers, which can't see localhost).
    mode 'data': the pictures are written straight into the HTML, for previews in a browser.
    """

    def __init__(self, mode='cid'):
        self.mode = mode
        self.attachments = {}  # content id -> JPEG bytes

    def src_for(self, product):
        """The address to use in <img src="...">, or None to show a placeholder."""
        data = product_thumbnail(product)
        if data is None:
            return None
        if self.mode == 'data':
            return 'data:image/jpeg;base64,' + base64.b64encode(data).decode('ascii')
        content_id = f'product-{product.pk}'
        self.attachments[content_id] = data
        return f'cid:{content_id}'


def render_email(template, subject, context):
    """Fill in templates/emails/<template>.txt and .html. Returns (text, html)."""
    context = {
        'site_name': 'ShopLite',
        'frontend_url': settings.FRONTEND_URL,
        'year': timezone.now().year,
        'subject': subject,
        **context,
    }
    text = render_to_string(f'emails/{template}.txt', context)
    html = render_to_string(f'emails/{template}.html', context)
    return text, html


def send_email(*, to, subject, template, context, images=None):
    """Render both versions of an email and send them (with any pictures) as one message."""
    text, html = render_email(template, subject, context)
    message = EmailMultiAlternatives(
        subject=subject,
        body=text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to],
    )
    message.attach_alternative(html, 'text/html')

    if images and images.attachments:
        # "related": the pictures belong to the HTML (shown inside it), they are not
        # separate files for the reader to download.
        message.mixed_subtype = 'related'
        for content_id, data in images.attachments.items():
            picture = MIMEImage(data, 'jpeg')
            picture.add_header('Content-ID', f'<{content_id}>')
            picture.add_header('Content-Disposition', 'inline', filename=f'{content_id}.jpg')
            message.attach(picture)

    message.send()
