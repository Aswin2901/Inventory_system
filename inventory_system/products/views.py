import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .models import Products, Variants, SubVariants
from .serializers import ProductSerializer, VariantSerializer, SubVariantSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
    @classmethod
    def validate(cls, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(username=username, password=password)

        if user is None:
            raise ValidationError('Invalid username or password')

        if not user.is_active:
            raise ValidationError('User account is inactive')

        data = super().validate(attrs)
        data['token'] = cls.get_token(user).access_token
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

def get_next_product_id():
    last_product = Products.objects.order_by('ProductID').last()
    return (last_product.ProductID + 1) if last_product else 1000

def generate_product_code():
    product_id = get_next_product_id()
    return f"PRD{product_id}"

def generate_hsn_code():
    return uuid.uuid4().hex[:8]

@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Products.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if request.user.is_authenticated:
            if request.data:
                print('data', request.data)
                
                # Extract data from request
                user = request.user
                product_name = request.data.get('ProductName')
                product_image = request.FILES.get('ProductImage')
                is_favourite = request.data.get('IsFavourite') == 'true'  # Convert string to boolean
                active = request.data.get('Active') == 'true'  # Convert string to boolean
                total_stock = int(request.data.get('TotalStock', 0))  # Convert to integer
                variants_data = request.data.get('variants', '[]')  # Default to empty list if not provided
                
                # Parse variants_data from JSON string to Python list
                import json
                variants_data = json.loads(variants_data)

                # Create product
                product = Products.objects.create(
                    ProductName=product_name,
                    ProductImage=product_image,
                    IsFavourite=is_favourite,
                    CreatedUser=user,
                    Active=active,
                    TotalStock=total_stock,
                    ProductID=get_next_product_id(),
                    ProductCode=generate_product_code(),
                    HSNCode=generate_hsn_code()
                )

                # Handle variants and subvariants
                for variant_data in variants_data:
                    options = variant_data.pop('options', [])
                    subvariants_data = variant_data.pop('subvariants', [])
                    variant = Variants.objects.create(Product=product, **variant_data)
                    
                    # Handle options for the variant if necessary
                    for subvariant_data in subvariants_data:
                        print('subvariant_data', subvariant_data)
                        subvariant_name = subvariant_data['SubVariantName']
                        stock = subvariant_data['Stock']
                        options = ''.join(subvariant_data.get('options', []))  # Join options if provided
                        SubVariants.objects.create(
                            Variant=variant,
                            SubVariantName=subvariant_name,
                            Stock=stock,
                            Options=options
                        )
                return Response({'detail': 'Product created successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'detail': 'Data is not enough'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Products.objects.get(pk=pk)
    except Products.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    elif request.method == 'PUT' or request.method == 'PATCH':
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def variant_list(request):
    if request.method == 'GET':
        variants = Variants.objects.all()
        serializer = VariantSerializer(variants, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = VariantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def variant_detail(request, pk):
    try:
        variant = Variants.objects.get(pk=pk)
    except Variants.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = VariantSerializer(variant)
        return Response(serializer.data)
    elif request.method == 'PUT' or request.method == 'PATCH':
        serializer = VariantSerializer(variant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        variant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def subvariant_list(request):
    if request.method == 'GET':
        subvariants = SubVariants.objects.all()
        serializer = SubVariantSerializer(subvariants, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = SubVariantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def subvariant_detail(request, pk):
    try:
        subvariant = SubVariants.objects.get(pk=pk)
    except SubVariants.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SubVariantSerializer(subvariant)
        return Response(serializer.data)
    elif request.method == 'PUT' or request.method == 'PATCH':
        serializer = SubVariantSerializer(subvariant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        subvariant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
