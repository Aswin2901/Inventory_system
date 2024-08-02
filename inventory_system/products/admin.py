from django.contrib import admin
from .models import Products, Variants, SubVariants


class SubVariantInline(admin.TabularInline):
    model = SubVariants
    extra = 1

class VariantInline(admin.TabularInline):
    model = Variants
    extra = 1
    inlines = [SubVariantInline]

class ProductAdmin(admin.ModelAdmin):
    list_display = ('ProductID', 'ProductCode', 'ProductName', 'CreatedDate', 'Active')
    search_fields = ('ProductName', 'ProductCode')
    inlines = [VariantInline]
    readonly_fields = ('ProductID', 'ProductCode', 'CreatedDate', 'UpdatedDate', 'CreatedUser', 'HSNCode')
    list_filter = ('Active', 'IsFavourite')

admin.site.register(Products, ProductAdmin)
admin.site.register(Variants)
admin.site.register(SubVariants)
