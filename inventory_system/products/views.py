from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Products, SubVariants
from .serializers import ProductSerializer

class CreateProductView(generics.CreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer

class ListProductView(generics.ListAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer

class AddStockView(APIView):
    def post(self, request, variant_id):
        try:
            subvariant = SubVariants.objects.get(pk=variant_id)
            subvariant.Stock += request.data['amount']
            subvariant.save()
            return Response({'status': 'Stock added successfully'}, status=status.HTTP_200_OK)
        except SubVariants.DoesNotExist:
            return Response({'error': 'Variant not found'}, status=status.HTTP_404_NOT_FOUND)

class RemoveStockView(APIView):
    def post(self, request, variant_id):
        try:
            subvariant = SubVariants.objects.get(pk=variant_id)
            if subvariant.Stock >= request.data['amount']:
                subvariant.Stock -= request.data['amount']
                subvariant.save()
                return Response({'status': 'Stock removed successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
        except SubVariants.DoesNotExist:
            return Response({'error': 'Variant not found'}, status=status.HTTP_404_NOT_FOUND)