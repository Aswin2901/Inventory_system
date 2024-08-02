from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, VariantViewSet, SubVariantViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'variants', VariantViewSet)
router.register(r'subvariants', SubVariantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
