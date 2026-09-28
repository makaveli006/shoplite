import os

from celery import Celery

# Workers are started with "celery -A config worker"; tell them where Django's settings are.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('config')

# Read every Django setting that starts with CELERY_ (e.g. CELERY_BROKER_URL).
app.config_from_object('django.conf:settings', namespace='CELERY')

# Find tasks.py in every installed app (e.g. orders/tasks.py).
app.autodiscover_tasks()
