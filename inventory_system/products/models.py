from django.db import models
from versatileimagefield.fields import VersatileImageField
from django.utils.translation import gettext_lazy as _
import uuid
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver

class Products(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ProductID = models.BigIntegerField(unique=True)
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)
    ProductImage = VersatileImageField(upload_to="uploads/", blank=True, null=True)
    CreatedDate = models.DateTimeField(auto_now_add=True)
    UpdatedDate = models.DateTimeField(blank=True, null=True)
    CreatedUser = models.ForeignKey("auth.User", related_name="user%(class)s_objects", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)
    HSNCode = models.CharField(max_length=255, unique=True, blank=True, null=True)
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        db_table = "products_product"
        verbose_name = _("product")
        verbose_name_plural = _("products")
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

    def save(self, *args, **kwargs):
        if not self.ProductID:
            # Generate the next ProductID
            last_product = Products.objects.all().order_by('-ProductID').first()
            if last_product:
                self.ProductID = last_product.ProductID + 1
            else:
                self.ProductID = 1000  # Start with 1000 if no product exists

        if not self.ProductCode:
            self.ProductCode = f"PRD{self.ProductID}"

        if not self.HSNCode:
            self.HSNCode = str(uuid.uuid4().int)[:8]  # Generate a unique 8-digit HSNCode

        super(Products, self).save(*args, **kwargs)

class Variants(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Product = models.ForeignKey(Products, related_name="variants", on_delete=models.CASCADE)
    VariantName = models.CharField(max_length=255)

    class Meta:
        unique_together = (("Product", "VariantName"),)
        ordering = ("VariantName",)

class SubVariants(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Variant = models.ForeignKey(Variants, related_name="subvariants", on_delete=models.CASCADE)
    SubVariantName = models.CharField(max_length=255)
    Options = models.CharField(max_length=255 , null=True)
    Stock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8)

    class Meta:
        unique_together = (("Variant", "SubVariantName"),)
        ordering = ("SubVariantName",)

@receiver(pre_save, sender=Products)
def set_hsncode(sender, instance, *args, **kwargs):
    if not instance.HSNCode:
        instance.HSNCode = str(uuid.uuid4().int)[:8] 
        