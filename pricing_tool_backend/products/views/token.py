from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

from ..serializers.token import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = serializer.validated_data['access']
        refresh_token = serializer.validated_data['refresh']

        response = Response({
            'access': access_token,
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='refresh_token',
            value=str(refresh_token),
            httponly=True, 
            secure=False,
            samesite='lax',   
            path='/',
            max_age= 24 * 60 * 60
        )
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token', None)
        if refresh_token is None:
            print("Refresh token not found in cookies")
            return Response({'detail': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return Response({'access': access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

