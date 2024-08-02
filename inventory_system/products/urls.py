from django.urls import path
from .views import CreateProductView, ListProductView, AddStockView, RemoveStockView

urlpatterns = [
    path('products/', CreateProductView.as_view(), name='create_product'),
    path('products/list/', ListProductView.as_view(), name='list_product'),
    path('stock/add/<uuid:variant_id>/', AddStockView.as_view(), name='add_stock'),
    path('stock/remove/<uuid:variant_id>/', RemoveStockView.as_view(), name='remove_stock'),
]