from rest_framework.routers import DefaultRouter

from . import views

# The router generates the URL patterns for each ViewSet:
#   categories/  categories/<slug>/  products/  products/<slug>/
# DefaultRouter also adds an API overview page at the root (/api/).
router = DefaultRouter()
router.register('categories', views.CategoryViewSet)
router.register('products', views.ProductViewSet)

# These are included under "api/" in config/urls.py.
urlpatterns = router.urls
