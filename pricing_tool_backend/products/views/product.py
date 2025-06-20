from rest_framework import viewsets, filters
from ..models.product import Product
from ..serializers.product import ProductSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsBuyer, IsSeller, IsSelfOrAdmin

# ProductViewSet for managing products
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'seller').all()
    serializer_class = ProductSerializer
    
    # Filter, search, and ordering capabilities
    # Allows filtering by category, seller, and stock availability
    # Enables searching by name and description
    # Supports ordering by selling price, units sold, and customer rating
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'seller', 'stock_available']
    search_fields = ['name', 'description']
    ordering_fields = ['selling_price', 'units_sold', 'customer_rating']

    # Seller can create and update products, admin can manage all
    # Buyers can only read products, and self(seller) or admin can delete
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsSeller()]
        elif self.action in ['list', 'retrieve']:
            permission_class = IsSelfOrAdmin | IsBuyer
            return [permission_class()]
        elif self.action in ['destroy']:
            return [IsSelfOrAdmin()]
        return [IsAuthenticated()]
