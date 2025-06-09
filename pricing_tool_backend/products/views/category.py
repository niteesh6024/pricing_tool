from rest_framework import viewsets
from ..models.category import Category
from ..serializers.category import CategorySerializer
from ..permissions import IsAdmin, IsSeller, ReadOnly, IsBuyer, IsSelfOrAdmin
from rest_framework.permissions import IsAuthenticated, AllowAny


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsSeller()]
        elif self.action in ['list', 'retrieve']:
            permission_class = IsSelfOrAdmin | IsBuyer
            return [permission_class()]
        elif self.action in ['destroy']:
            return [IsSelfOrAdmin()]
        return [IsAuthenticated()]
