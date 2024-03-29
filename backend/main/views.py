from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import permissions
from .models import Hello, Listing, User, Review, Address, UserPurchases, Like, Offer, Message, Chat, UserProfile
from .serializers import HelloSerializer, ListingSerializer, UserSerializer, ReviewSerializer, AddressSerializer, UserPurchasesSerializer, LikeSerializer, OfferSerializer, MessageSerializer, ChatSerializer, UserProfileSerializer
import jwt, datetime
from rest_framework.decorators import api_view
from django.db.models import Q
from django.db.models import Case, When, IntegerField
from .predictor import rent_predictor, rent_mean, resale_mean, resale_predictor

import ssl
ssl._create_default_https_context = ssl._create_unverified_context


from rest_framework.exceptions import AuthenticationFailed

class HelloView(generics.ListAPIView):
    queryset = Hello.objects.all()
    serializer_class = HelloSerializer
    # permission_classes = [permissions.AllowAny]

class ListingView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    queryset = Listing.objects.filter(is_sold=False)  # filter out sold listings


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer


class AnalyticsView(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer

    def get_queryset(self):
        # get the pk 
        pk = self.kwargs.get('pk')
        queryset = Listing.objects.filter(pk=pk)
        listing = queryset.first()
        # Add the rent_predictor for 12 months
        town = listing.town
        property_type = listing.property_type
        sale_or_rent = listing.sale_or_rent
        bedrooms = listing.bedrooms
        
        FLAT_TYPE = ['1-ROOM', '2-ROOM', '3-ROOM', '4-ROOM', '5-ROOM', 'EXECUTIVE']
        # map bedrooms to flat_type

        print(town,property_type,sale_or_rent,bedrooms)

        if property_type == 1:
            flat_type = FLAT_TYPE[0]
            if bedrooms == 1:
                flat_type = FLAT_TYPE[0]
            elif bedrooms == 2:
                flat_type = FLAT_TYPE[1]
            elif bedrooms == 3:
                flat_type = FLAT_TYPE[2]
            elif bedrooms == 4:
                flat_type = FLAT_TYPE[3]
            elif bedrooms == 5:
                flat_type = FLAT_TYPE[4]
            elif bedrooms == 6:
                flat_type = FLAT_TYPE[5]

            if sale_or_rent == 1:
                predicted_resale_price = resale_predictor(12, town, flat_type)

            if sale_or_rent == 2:
                predicted_rent_price = rent_predictor(12, town, flat_type)


        return predicted_rent_price

@api_view(["GET"])
def fetch_analytics(request, pk):
    listing = Listing.objects.get(pk=pk)
    # Add the rent_predictor for 12 months
    town = listing.town
    property_type = listing.property_type
    sale_or_rent = listing.sale_or_rent
    bedrooms = listing.bedrooms
    
    timeframe = int(request.query_params.get('timeframe'))
    FLAT_TYPE = ['1-ROOM', '2-ROOM', '3-ROOM', '4-ROOM', '5-ROOM', 'EXECUTIVE']
    # map bedrooms to flat_type

    print(town,property_type,sale_or_rent,bedrooms)

    if property_type == 1:
        flat_type = FLAT_TYPE[0]
        if bedrooms == 1:
            flat_type = FLAT_TYPE[0]
        elif bedrooms == 2:
            flat_type = FLAT_TYPE[1]
        elif bedrooms == 3:
            flat_type = FLAT_TYPE[2]
        elif bedrooms == 4:
            flat_type = FLAT_TYPE[3]
        elif bedrooms == 5:
            flat_type = FLAT_TYPE[4]
        elif bedrooms == 6:
            flat_type = FLAT_TYPE[5]

        if sale_or_rent == 1:
            predicted_resale_price = resale_predictor(timeframe, town, flat_type)
            print(predicted_resale_price.values.tolist())

        if sale_or_rent == 2:
            predicted_rent_price = rent_predictor(timeframe, town, flat_type)
            print(predicted_rent_price.values.tolist())

    response = Response()
    if sale_or_rent == 1:
        response.data = {
            "predicted_resale_price": predicted_resale_price
        }
    if sale_or_rent == 2:
        response.data = {
            "predicted_rent_price": predicted_rent_price
        }

    print(response.data)
    return response

'''


Method to fetch predicited average price when filling up the create-listing/ edit-listing form


'''
@api_view(["GET"])
def fetch_mean_price(request, town, property_type, sale_or_rent, bedrooms):
    
    # Add the rent_predictor for 12 months
    property_type = int(property_type)
    sale_or_rent = int(sale_or_rent)
    bedrooms = int(bedrooms)

    FLAT_TYPE = ['1-ROOM', '2-ROOM', '3-ROOM', '4-ROOM', '5-ROOM', 'EXECUTIVE']
    # map bedrooms to flat_type
    if property_type == 1:
        flat_type = FLAT_TYPE[0]
        if bedrooms == 1:
            flat_type = FLAT_TYPE[0]
        elif bedrooms == 2:
            flat_type = FLAT_TYPE[1]
        elif bedrooms == 3:
            flat_type = FLAT_TYPE[2]
        elif bedrooms == 4:
            flat_type = FLAT_TYPE[3]
        elif bedrooms == 5:
            flat_type = FLAT_TYPE[4]
        elif bedrooms >= 6:
            flat_type = FLAT_TYPE[5]

        if sale_or_rent == 1:
            mean_resale_price = resale_mean(town = town, flat_type = flat_type)
            print(mean_resale_price)

        if sale_or_rent == 2:
            mean_rent_price = rent_mean(town = town, flat_type = flat_type)
            print(mean_rent_price)

    response = Response()
    if sale_or_rent == 1:
        response.data = {
            "predictedPrice": mean_resale_price
        }
    if sale_or_rent == 2:
        response.data = {
            "predictedPrice": mean_rent_price
        }
    return response

class SearchListingView(generics.ListAPIView):
    # ?searchInput=hi&numBedrooms=1&sortingOrder=priceHighToLow&saleType=forRent
    serializer_class = ListingSerializer
    def get_queryset(self):
        searchInput = self.request.query_params.get("searchInput", None)
        numBedrooms = self.request.query_params.get("numBedrooms", None)
        sortingOrder = self.request.query_params.get("sortingOrder", None)
        saleType = self.request.query_params.get("saleType", None)
        queryset = Listing.objects.filter(is_sold=False)  # filter out sold listings
        if searchInput is not None:
            queryset = queryset.filter(Q(title__icontains=searchInput) | Q(description__icontains=searchInput))
        else:
            queryset = queryset.all()
        if numBedrooms is not None:
            queryset = queryset.filter(bedrooms=numBedrooms)
        if saleType is not None:
            if saleType == "forSale":
                saleType = 1
            elif saleType == "forRent":
                saleType = 2
            queryset = queryset.filter(sale_or_rent=saleType)
        if sortingOrder is not None:
            if sortingOrder == "priceLowToHigh":
                queryset = queryset.order_by("price")
            elif sortingOrder == "priceHighToLow":
                queryset = queryset.order_by("-price")
            elif sortingOrder == "newestListings":
                queryset = queryset.order_by("-list_date")
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

        # Create a userprofile
        user = User.objects.filter(email=request.data["email"]).first()
        userprofile = UserProfile.objects.create(user=user)
        userprofile.save()

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

class LikeView(generics.ListCreateAPIView):
    queryset=Like.objects.all()
    serializer_class=LikeSerializer
    
    def post(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        listing = Listing.objects.filter(id=request.data.get("listing")).first()
        like = Like.objects.filter(user=user, listing=listing).first()
        if like:
            like.delete()
            return Response({"message": "Like removed"})
        else:
            Like.objects.create(user=user, listing=listing)
            return Response({"message": "Like added"})

    def get_queryset(self):
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        # Return all likes for the user
        user = User.objects.filter(id=payload["id"]).first()
        queryset = Like.objects.filter(user=user)
        return queryset

@api_view(["GET"])
def fetch_like_status(request, listing_id):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated")
    try:
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated")
    user = User.objects.filter(id=payload["id"]).first()
    listing = Listing.objects.filter(id=listing_id).first()
    like = Like.objects.filter(user=user, listing=listing).first()
    if like:
        return Response({"liked": True})
    else:
        return Response({"liked": False})


class OfferView(generics.ListCreateAPIView):
    queryset=Offer.objects.all()
    serializer_class=OfferSerializer

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
        # show all the offers which are either made by the user or made on the users listing
        queryset = Offer.objects.filter(Q(user=user) | Q(listing__owner=user))
        return queryset

    def post(self, request):
        # Check the jwt
        token = self.request.data.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        listing = Listing.objects.filter(id=request.data.get("listing")).first()
        Offer.objects.create(user=user, listing=listing, offer=request.data.get("offer"))
        return Response({"message": "Offer created"})
    
class AcceptOfferView(generics.ListCreateAPIView):
    queryset=Offer.objects.all()
    serializer_class=OfferSerializer

    def post(self, request):
        # Check the jwt
        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        offer = Offer.objects.filter(id=request.data.get("offer")).first()
        listing = offer.listing
        if listing.is_sold:
            return Response({"message": "Listing already sold"})
        listing.is_sold = True
        listing.save()
        offer.is_accepted = True
        offer.save()
        purchaser_id = Offer.objects.filter(id=request.data.get("offer")).first().user_id
        purchaser = User.objects.filter(id=purchaser_id).first()

        # Create a purchase object
        UserPurchases.objects.create(user=purchaser, listing=listing)

        return Response({"message": "Offer accepted"})
    
class MessageView(generics.ListCreateAPIView):
    queryset=Message.objects.all()
    serializer_class=MessageSerializer

    def post(self, request):
        # Check the jwt
        token = self.request.data.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        # user = User.objects.filter(id=payload["id"]).first()
        # queryset = Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
        user = User.objects.filter(id=payload["id"]).first()
        queryset = Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)

        response = Response()
        response.data = {
            "messages": MessageSerializer(queryset, many=True).data
        }
        return response

class AddMessage(generics.ListCreateAPIView):
    # Gets a request of 
    # {chatId, sender, receiver, message}
    # Save this message in the chat
    queryset=Message.objects.all()
    serializer_class=MessageSerializer

    def post(self, request):
        print(
            request.data.get("chatId"),
            request.data.get("sender"),
            request.data.get("receiver"),
            request.data.get("message")
        )
        # First create a message
        message = Message.objects.create(
            sender_id=request.data.get("sender"),
            receiver_id=request.data.get("receiver"),
            message=request.data.get("message")
        )
        # Then add this message to the chat
        chatId = request.data.get("chatId")
        chat = Chat.objects.filter(chatId=chatId).first()
        chat.messages.add(message)
 
        chat.save()

        # return message
        response = Response()
        response.data = {
            "message": MessageSerializer(message).data
        }
        return response




class CreateChatView(generics.ListCreateAPIView):
    queryset=Chat.objects.all()
    serializer_class=ChatSerializer

    def post(self, request):
        chatId = request.data.get("chatId")
        chat = Chat.objects.filter(chatId=chatId).first()
        user1 = User.objects.filter(id=request.data.get("user1")).first()
        user2 = User.objects.filter(id=request.data.get("user2")).first()

        
        if chat:
            return Response({"message": "Chat already exists"})
        else:
            print(user1,user2)
            chat = Chat.objects.create(chatId=chatId)
            chat.users.add(user1)
            chat.users.add(user2)
            chat.save()
            return Response({"message": "Chat created"})
    

@api_view(["POST"])
def fetch_chats_of_user(request):
    token = request.data.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated")
    try:
        payload = jwt.decode(token, "secret", algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated")
    user = User.objects.filter(id=payload["id"]).first()
    chat = Chat.objects.filter(users=user)
    response = Response()
    response.data = {
        "user": UserSerializer(user).data,
        "chats": ChatSerializer(chat, many=True).data
    }
    return response



        
class AddOffer(generics.ListCreateAPIView):
    queryset=Offer.objects.all()
    serializer_class=OfferSerializer

    def post(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        
        user = User.objects.filter(id=payload["id"]).first()
        listing = Listing.objects.filter(id=request.data.get("listing")).first()
        offer = Offer.objects.create(user=user, listing=listing, price=request.data.get("price"))

        chatId = "-".join(sorted([str(user.id), str(listing.owner.id)]))

        chat = Chat.objects.filter(chatId=chatId).first()
        if not chat:
            chat = Chat.objects.create(chatId=chatId)
            chat.users.add(user)
            chat.users.add(listing.owner)
            chat.save()
        chat.offers.add(offer)
        chat.save()
        return Response({"message": "Offer created"})


class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    queryset=UserProfile.objects.all()
    serializer_class=UserProfileSerializer

    def get(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        profile = UserProfile.objects.filter(user=user).first()
        response = Response()
        response.data = {
            "user": UserSerializer(user).data,
            "profile": UserProfileSerializer(profile).data
        }
        return response
    
    def patch(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        profile = UserProfile.objects.filter(user=user).first()
        profile.phone_number = request.data.get("phone_number")
        profile_picture = request.data.get("profile_picture")
        print(profile_picture)
        if profile_picture != None:
            profile.profile_picture = profile_picture
        profile.save()
        user.username = request.data.get("username")
        user.email = request.data.get("email")
        if User.objects.filter(username=user.username).exclude(id=user.id).exists():
            return Response({"message": "Username already taken"})
        if User.objects.filter(email=user.email).exclude(id=user.id).exists():
            return Response({"message": "Email already taken"})
        user.save()
        return Response({"message": "User updated"})
    
    def delete(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        profile = UserProfile.objects.filter(user=user).first()
        profile.delete()
        user.delete()
        # Remove the cookies
        response = Response()
        response.delete_cookie("jwt")
        response.delete_cookie("jwt_exp")
        return response

class ChangePasswordView(generics.RetrieveUpdateAPIView):
    queryset=User.objects.all()
    serializer_class=UserSerializer

    def patch(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()

        if not user.check_password(request.data.get("current_password")):
            return Response({"message": "Current password is incorrect"})
        
        if request.data.get("new_password") != request.data.get("confirm_password"):
            return Response({"message": "Passwords do not match"})
        
        user.set_password(request.data.get("password"))
        user.save()
        return Response({"message": "Password changed"})
    

class ReviewUserView(generics.ListCreateAPIView):
    queryset=Review.objects.all()
    serializer_class=ReviewSerializer

    def post(self, request):
        # Check the jwt
        token = self.request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")
        user = User.objects.filter(id=payload["id"]).first()
        reviewee = User.objects.filter(id=request.data.get("reviewee")).first()
        listing = Listing.objects.filter(id=request.data.get("listing")).first()
        rating=request.data.get("rating")
        review=request.data.get("review")

        print(listing.owner, user)
        
        # if is the owner making the review, listing.seller_left_review true
        if listing.owner == user:
            listing.seller_left_review = True
            listing.save()
        else:
            listing.buyer_left_review = True
            listing.save()

        print(listing.title)


        Review.objects.create(reviewer=user, reviewee=reviewee, listing=listing, rating=rating, review=review)
        return Response({"message": "Review created"})
    

# Create a view to fetch all the data for the public profile page given the user id, get the users name, profile pic, listings, reviews
@api_view(["GET"])
def fetch_public_profile(request, id):
    user = User.objects.filter(id=id).first()
    profile = UserProfile.objects.filter(user=user).first()
    listings = Listing.objects.filter(owner=user).all()
    reviews = Review.objects.filter(reviewee=user).all()
    response = Response()
    response.data = {
        "user": UserSerializer(user).data,
        "profile": UserProfileSerializer(profile).data,
        "listings": ListingSerializer(listings, many=True).data,
        "reviews": ReviewSerializer(reviews, many=True).data
    }
    return response