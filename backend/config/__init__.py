# Load the Celery app whenever Django starts, so tasks are connected to it.
from .celery import app as celery_app

__all__ = ('celery_app',)
