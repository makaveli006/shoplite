from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from core.emails import InlineImages, render_email
from orders.emails import order_email_context
from orders.models import Order
from orders.tasks import ORDER_EMAILS

OUTPUT_DIR = settings.BASE_DIR / 'email-previews'  # git-ignored


class Command(BaseCommand):
    help = 'Save every email design as files you can open in the browser. Sends nothing.'

    def add_arguments(self, parser):
        parser.add_argument('--order', type=int, help='Id of the order to show (default: the newest order).')

    def handle(self, *args, **options):
        orders = Order.objects.select_related('user').prefetch_related('items__product')
        order = orders.filter(pk=options['order']).first() if options['order'] else orders.first()
        if order is None:
            raise CommandError('No order found. Place an order in the shop first (or check the --order id).')

        OUTPUT_DIR.mkdir(exist_ok=True)
        self.stdout.write(f'Order #{order.pk} of {order.user.email}:')

        for kind, (subject, template) in ORDER_EMAILS.items():
            # 'data' mode: pictures are written into the HTML itself, so the browser can show them.
            context = order_email_context(order, InlineImages(mode='data'))
            subject = subject.format(id=order.pk)
            self.save(template, template, subject, {**context, 'cancelled_by_customer': False})
            if kind == Order.Status.CANCELLED:  # this one has a second wording
                self.save(f'{template}_by_customer', template, subject, {**context, 'cancelled_by_customer': True})

        # A fake link: no real reset token is created by a preview.
        link = f'{settings.FRONTEND_URL}/reset-password/preview/preview'
        minutes = settings.PASSWORD_RESET_TIMEOUT // 60
        self.save('password_reset', 'password_reset', 'Reset your ShopLite password',
                  {'user': order.user, 'link': link, 'minutes': minutes})

    def save(self, file_name, template, subject, context):
        text, html = render_email(template, subject, context)
        (OUTPUT_DIR / f'{file_name}.txt').write_text(text, encoding='utf-8')
        html_file = OUTPUT_DIR / f'{file_name}.html'
        html_file.write_text(html, encoding='utf-8')
        # A file:/// address: Ctrl+click it in the terminal, or paste it into the browser.
        self.stdout.write(f'  {subject:<40} {html_file.as_uri()}')
