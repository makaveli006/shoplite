from orders.models import Order, OrderItem


def can_review(user, product):
    """Only customers who actually received the product may review it:
    they need an order that contains it and has been delivered."""
    return OrderItem.objects.filter(
        order__user=user,
        order__status=Order.Status.DELIVERED,
        product=product,
    ).exists()
