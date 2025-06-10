from rest_framework import viewsets
from ..models.category import Category
from ..serializers.category import CategorySerializer
from ..permissions import IsAdmin, IsSeller, ReadOnly, IsBuyer, IsSelfOrAdmin
from rest_framework.permissions import IsAuthenticated, AllowAny

# CategoryViewSet for managing product categories
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    # admin can manage all
    # buyers and seller can only read categories
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        elif self.action in ['list', 'retrieve']:
            permission_class = IsSelfOrAdmin | IsBuyer | IsSeller | ReadOnly
            return [permission_class()]
        return [IsAuthenticated()]
