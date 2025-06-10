from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import RegisterUserSerializer
from ..models.customuser import CustomUser
import jwt
from datetime import datetime, timedelta
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from ..permissions import IsSelfOrAdmin, IsAdmin
from rest_framework.permissions import AllowAny

# User registration and email verification views
class RegisterUserView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = jwt.encode(
                {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
                settings.SECRET_KEY,
                algorithm='HS256'
            )

            verification_link = f"http://localhost:8000/api/verify-email/?token={token}"

            try:
                send_mail(
                    subject="Verify your email",
                    message=f"Click the link to verify your email: {verification_link}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                )
            except Exception as e:
                print("EMAIL SEND ERROR:", e)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({'msg': 'User registered. verfiy your email'}, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomUser.objects.get(id=payload['user_id'])
            user.is_active = True
            user.save()
            return Response({'msg': 'Email verified. You can now login.'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Activation link expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.ListModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterUserSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdmin()]
        if self.action == 'destroy':
            return [IsSelfOrAdmin()]
        return [IsAuthenticated()]
