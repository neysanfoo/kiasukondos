from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import permissions
from .models import Hello, Listing, User, Review, Address, UserPurchases
from .serializers import HelloSerializer, ListingSerializer, UserSerializer, ReviewSerializer, AddressSerializer, UserPurchasesSerializer
import jwt, datetime
from rest_framework.exceptions import AuthenticationFailed

class HelloView(generics.ListAPIView):
    queryset = Hello.objects.all()
    serializer_class = HelloSerializer
    # permission_classes = [permissions.AllowAny]

class ListingView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    # permission_classes = [permissions.AllowAny]

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer




class SearchListingView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    # permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Listing.objects.all()
        search = self.request.query_params.get('search', None)
        if search is not None:
            queryset = queryset.filter(title__icontains=search)
        return queryset

class UserView(generics.ListAPIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class ReviewView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    # permission_classes = [permissions.AllowAny]

class AddressView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    # permission_classes = [permissions.AllowAny]

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = User.objects.filter(email=email).first()
        if user is None:
            return Response({"error": "Email or password is incorrect"}, status=400)
        if not user.check_password(password):
            return Response({"error": "Email or password is incorrect"}, status=400)
        
        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            "iat": datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, "secret", algorithm="HS256")
        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)
        response.data = {
            "jwt": token
        }

        return response

class LogoutView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {
            "message": "success"
        }
        return response


class UserPurchasesView(generics.ListAPIView):
    queryset=UserPurchases.objects.all()
    serializer_class=UserPurchasesSerializer

    def get_queryset(self):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        queryset = UserPurchases.objects.filter(user=user)
        return queryset

class ListingByUserView(generics.ListAPIView):
    queryset=Listing.objects.all()
    serializer_class=ListingSerializer

    def get_queryset(self):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        queryset = Listing.objects.filter(owner=user)
        return queryset