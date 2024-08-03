from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('products/', views.product_list, name='product-list'),
    path('products/<uuid:pk>/', views.product_detail, name='product-detail'),
    path('variants/', views.variant_list, name='variant-list'),
    path('variants/<uuid:pk>/', views.variant_detail, name='variant-detail'),
    path('subvariants/', views.subvariant_list, name='subvariant-list'),
    path('subvariants/<uuid:pk>/', views.subvariant_detail, name='subvariant-detail'),
]