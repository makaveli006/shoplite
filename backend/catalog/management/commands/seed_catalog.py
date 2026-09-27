from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import Category, Product

# category name -> list of (product name, price, stock, description)
CATALOG = {
    'Kitchen': [
        ('Blue Ceramic Mug', '12.50', 20, 'A 350 ml stoneware mug with a glossy blue glaze.'),
        ('Chef Knife', '49.99', 5, 'A 20 cm stainless steel chef knife for everyday cooking.'),
        ('Bamboo Cutting Board', '18.00', 30, 'A sturdy, knife-friendly bamboo board.'),
        ('Cast Iron Skillet', '39.90', 12, 'A pre-seasoned 26 cm skillet that lasts a lifetime.'),
        ('Glass Storage Jars (Set of 3)', '22.00', 25, 'Airtight jars for coffee, pasta and snacks.'),
        ('Discontinued Travel Mug', '14.00', 3, 'No longer sold.'),
    ],
    'Stationery': [
        ('Gel Pen Set', '7.99', 100, 'Ten smooth gel pens in assorted colours.'),
        ('A5 Dotted Notebook', '9.50', 60, '160 pages of dotted paper for notes and sketches.'),
        ('Mechanical Pencil', '4.25', 80, 'A 0.5 mm pencil with a comfortable rubber grip.'),
        ('Desk Organizer', '16.75', 15, 'Keeps pens, notes and cables tidy.'),
    ],
    'Home & Garden': [
        ('Terracotta Plant Pot', '15.00', 8, 'A classic 20 cm clay pot with drainage hole.'),
        ('Watering Can 1.5 L', '13.40', 18, 'A long-spout watering can for indoor plants.'),
        ('Scented Soy Candle', '11.00', 40, 'Hand-poured candle with a calm lavender scent.'),
        ('Linen Cushion Cover', '19.99', 0, 'A 45 x 45 cm washed-linen cover. Currently out of stock.'),
    ],
    'Electronics': [
        ('Wireless Mouse', '24.99', 35, 'A quiet, rechargeable mouse with USB-C.'),
        ('USB-C Charger 30 W', '27.50', 22, 'Fast charger for phones, tablets and small laptops.'),
        ('Bluetooth Speaker', '59.00', 10, 'A pocket speaker with 12 hours of battery life.'),
        ('Noise-Cancelling Headphones', '149.00', 4, 'Over-ear headphones with active noise cancelling.'),
    ],
    'Books': [
        ("Beginner's Guide to Python", '35.00', 7, 'Learn Python step by step with small projects.'),
        ('Web Development Basics', '32.50', 9, 'HTML, CSS, HTTP and how the web fits together.'),
        ('Databases Made Simple', '41.00', 6, 'Tables, SQL and relationships explained clearly.'),
    ],
}

# Products created as hidden (is_active=False), to test "only show active products" later.
INACTIVE = {'Discontinued Travel Mug'}


class Command(BaseCommand):
    help = 'Create or update sample categories and products. Safe to run many times.'

    @transaction.atomic  # all-or-nothing: if anything fails, nothing is saved
    def handle(self, *args, **options):
        created = updated = 0

        for category_name, products in CATALOG.items():
            category, _ = Category.objects.get_or_create(name=category_name)

            for name, price, stock, description in products:
                # Look the product up by slug; create it if missing, otherwise update it.
                # Fields not listed in defaults (like image) are left untouched.
                _, was_created = Product.objects.update_or_create(
                    slug=slugify(name),
                    defaults={
                        'category': category,
                        'name': name,
                        'price': Decimal(price),
                        'stock': stock,
                        'description': description,
                        'is_active': name not in INACTIVE,
                    },
                )
                if was_created:
                    created += 1
                else:
                    updated += 1

        self.stdout.write(self.style.SUCCESS(
            f'Catalog seeded: {Category.objects.count()} categories, '
            f'{created} products created, {updated} products updated.'
        ))
