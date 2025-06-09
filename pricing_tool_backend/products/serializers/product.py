from rest_framework import serializers
from ..models.product import Product
from ..serializers.category import CategorySerializer
from ..models.category import Category

class ProductSerializer(serializers.ModelSerializer):

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True
    )
    category_detail = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
