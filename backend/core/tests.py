import io
import os
from decimal import Decimal

from django.test import SimpleTestCase, TestCase, override_settings
from PIL import Image

from .emails import InlineImages, format_money, product_thumbnail
from .testing import TemporaryMediaMixin, make_category, make_picture, make_product


class FormatMoneyTests(SimpleTestCase):
    def test_known_currencies_use_their_symbol(self):
        self.assertEqual(format_money(Decimal('1234.5')), '$1,234.50')
        with override_settings(SHOP_CURRENCY='INR'):
            self.assertEqual(format_money('49.99'), '₹49.99')

    def test_other_currencies_use_their_code(self):
        with override_settings(SHOP_CURRENCY='CHF'):
            self.assertEqual(format_money(12), 'CHF 12.00')


class ProductThumbnailTests(TemporaryMediaMixin, TestCase):
    def setUp(self):
        self.mug = make_product(make_category())

    def test_picture_becomes_a_small_square_jpeg(self):
        self.mug.image.save('mug.png', make_picture(size=(600, 300)))

        with Image.open(io.BytesIO(product_thumbnail(self.mug))) as thumbnail:
            self.assertEqual(thumbnail.format, 'JPEG')
            self.assertEqual(thumbnail.size, (160, 160))

    def test_no_picture_deleted_product_or_missing_file_give_none(self):
        self.assertIsNone(product_thumbnail(self.mug))  # no picture
        self.assertIsNone(product_thumbnail(None))  # product deleted since the order

        self.mug.image.save('mug.png', make_picture())
        os.remove(self.mug.image.path)
        with self.assertLogs('core.emails', 'WARNING'):
            self.assertIsNone(product_thumbnail(self.mug))

    def test_inline_images_modes(self):
        self.mug.image.save('mug.png', make_picture())

        attached = InlineImages()
        self.assertEqual(attached.src_for(self.mug), f'cid:product-{self.mug.pk}')
        self.assertEqual(list(attached.attachments), [f'product-{self.mug.pk}'])

        preview = InlineImages(mode='data')
        self.assertTrue(preview.src_for(self.mug).startswith('data:image/jpeg;base64,'))
        self.assertEqual(preview.attachments, {})
