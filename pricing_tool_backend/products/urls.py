from django.db import models
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.product import ProductViewSet
from .views.category import CategoryViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views.user import RegisterUserView, VerifyEmailView, UserViewSet
from .views.token import MyTokenObtainPairView
from .views.summarizer import SummarizeView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('summarize/', SummarizeView.as_view(), name='summarize'),
]
