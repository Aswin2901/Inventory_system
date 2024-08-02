from rest_framework import serializers
from .models import Products, Variants, SubVariants
import uuid

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariants
        fields = ['id', 'SubVariantName', 'Stock']

class VariantSerializer(serializers.ModelSerializer):
    subvariants = SubVariantSerializer(many=True, required=False)

    class Meta:
        model = Variants
        fields = ['id', 'VariantName', 'subvariants']

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, required=False)

    class Meta:
        model = Products
        fields = ['id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 'CreatedDate', 'UpdatedDate', 'CreatedUser', 'IsFavourite', 'Active', 'HSNCode', 'TotalStock', 'variants']
        read_only_fields = ['ProductID', 'ProductCode', 'CreatedDate', 'UpdatedDate', 'CreatedUser', 'HSNCode']

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        product = Products.objects.create(
            **validated_data,
            ProductID=self.get_next_product_id(),
            ProductCode=self.generate_product_code(),
            HSNCode=self.generate_hsn_code(),
            CreatedUser=self.context['request'].user
        )
        for variant_data in variants_data:
            subvariants_data = variant_data.pop('subvariants', [])
            variant = Variants.objects.create(Product=product, **variant_data)
            for subvariant_data in subvariants_data:
                SubVariants.objects.create(Variant=variant, **subvariant_data)
        return product

    def get_next_product_id(self):
        last_product = Products.objects.order_by('ProductID').last()
        return (last_product.ProductID + 1) if last_product else 1000  # Default start ID

    def generate_product_code(self):
        product_id = self.get_next_product_id()
        return f"PRD{product_id}"

    def generate_hsn_code(self):
        return uuid.uuid4().hex[:8]  # Generate a unique HSN code

    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle nested variants and subvariants
        existing_variants = {variant.id: variant for variant in instance.variants.all()}
        for variant_data in variants_data:
            subvariants_data = variant_data.pop('subvariants', [])
            variant_id = variant_data.get('id', None)
            if variant_id and variant_id in existing_variants:
                variant = existing_variants.pop(variant_id)
                for attr, value in variant_data.items():
                    setattr(variant, attr, value)
                variant.save()
            else:
                variant = Variants.objects.create(Product=instance, **variant_data)
            
            existing_subvariants = {subvariant.id: subvariant for subvariant in variant.subvariants.all()}
            for subvariant_data in subvariants_data:
                subvariant_id = subvariant_data.get('id', None)
                if subvariant_id and subvariant_id in existing_subvariants:
                    subvariant = existing_subvariants.pop(subvariant_id)
                    for attr, value in subvariant_data.items():
                        setattr(subvariant, attr, value)
                    subvariant.save()
                else:
                    SubVariants.objects.create(Variant=variant, **subvariant_data)
            
            # Delete any remaining subvariants
            for remaining_subvariant in existing_subvariants.values():
                remaining_subvariant.delete()
        
        # Delete any remaining variants
        for remaining_variant in existing_variants.values():
            remaining_variant.delete()
        
        return instance
