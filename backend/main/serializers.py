from rest_framework import serializers
from .models import Hello, Listing, User, Review, Address, UserPurchases, Like, Offer, Message

class HelloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hello
        fields = "__all__"

class ListingSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Listing
        fields = ['id', 'owner', 'owner_name', 'title', 'address', 'zipcode', 'property_type', 'sale_or_rent', 'description', 'price', 'bedrooms', 'bathrooms', 'garage', 'sqmeters', 'is_published', 'list_date', 'photo_main', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5', 'photo_6', 'likes']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        password = validated_data.pop("password")
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"

class UserPurchasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPurchases
        fields = ["id", "user", "listing", "date"] 

    def __init__(self, *args, **kwargs):
        super(UserPurchasesSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == "GET":
            self.Meta.depth = 2

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ["id", "listing"]
    def __init__(self, *args, **kwargs):
        super(LikeSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == "GET":
            self.Meta.depth = 2

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["sender", "receiver", "message", "date", "receiver_name", "sender_name"]
    
    