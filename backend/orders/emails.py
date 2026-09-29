from django.conf import settings

from core.emails import format_money


def order_email_context(order, images):
    """The values every order email needs: the lines with pictures, the total, and links.

    `order` should be loaded with prefetch_related('items__product'). `images` is a
    core.emails.InlineImages that collects the product pictures.
    """
    lines = []
    for item in order.items.all():
        product = item.product  # None if the product was deleted since
        lines.append({
            'name': item.product_name,  # the name at the time of purchase
            'quantity': item.quantity,
            'unit_price': format_money(item.unit_price),
            'line_total': format_money(item.line_total),
            'image_src': images.src_for(product),
            'initial': item.product_name[:1].upper(),  # shown in the placeholder when there is no picture
            # Link only to products that can still be opened in the shop.
            'url': f'{settings.FRONTEND_URL}/products/{product.slug}' if product and product.is_active else None,
        })
    return {
        'order': order,
        'items': lines,
        'total': format_money(order.total_amount),
        'order_url': f'{settings.FRONTEND_URL}/orders/{order.pk}',
        'shop_url': f'{settings.FRONTEND_URL}/products',
    }
