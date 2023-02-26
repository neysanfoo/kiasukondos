from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Hello(models.Model):
    message = models.CharField(max_length=255)

    def __str__(self):
        return self.message


class Listing(models.Model):
    title = models.CharField(max_length=255)
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="listings")
    address = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=255)
    property_type = models.IntegerField()
    # Property type
    # 1 = HDB
    # 2 = Condo
    # 3 = Landed
    sale_or_rent = models.IntegerField()
    # Can either be for sale or for rent
    # 1 = For Sale
    # 2 = For Rent
    description = models.TextField()
    price = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    garage = models.IntegerField(default=0)
    sqmeters = models.IntegerField()
    is_published = models.BooleanField(default=True)
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    photo_main = models.ImageField(upload_to="photos/%Y/%m/%d/")
    photo_1 = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True)
    photo_2 = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True)
    photo_3 = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True)
    photo_4 = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True)
    photo_5 = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True)
    photo_6 = models.ImageField(upload_to="photos/%Y/%m/%d/", null=True)
    likes = models.ManyToManyField("User", blank=True)
    is_sold = models.BooleanField(default=False)
    buyer_left_review = models.BooleanField(default=False)
    seller_left_review = models.BooleanField(default=False)




    def owner_name(self):
        for user in User.objects.all():
            if user.id == self.owner.id:
                return user.username

    def __str__(self):
        return self.title

class Like(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="likes")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="listing_likes")

class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
class UserProfile(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE, related_name="profile")
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    # profile picture, default if null is at photos/default/default_profile_picture.jpeg
    profile_picture = models.ImageField(upload_to="photos/%Y/%m/%d/", default="photos/default/default_profile_picture.jpeg")
    def __str__(self):
        return self.name

class Review(models.Model):
    reviewer = models.ForeignKey("User", on_delete=models.CASCADE, related_name="reviewer")
    reviewee = models.ForeignKey("User", on_delete=models.CASCADE, related_name="reviewee")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="reviews")
    review = models.TextField()
    rating = models.IntegerField()

    def reviewer_username(self):
        return self.reviewer.username

    def __str__(self):
        return self.review


class Address(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="addresses")
    address = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=255)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.address
    
class Offer(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="offers")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="offers")
    price = models.IntegerField()
    date = models.DateTimeField(default=datetime.now, blank=True)
    is_accepted = models.BooleanField(default=False)
    is_declined = models.BooleanField(default=False)

    def __str__(self):
        return self.offer

class UserPurchases(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_purchases")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="purchased_listing")
    date = models.DateTimeField(default=datetime.now, blank=True)

    def __str__(self):
        return self.listing.title
    

class Message(models.Model):
    sender = models.ForeignKey("User", on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey("User", on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    date = models.DateTimeField(default=datetime.now, blank=True)

    def receiver_name(self):
        for user in User.objects.all():
            if user.id == self.receiver.id:
                return user.username
            
    def sender_name(self):
        for user in User.objects.all():
            if user.id == self.sender.id:
                return user.username
            
    def chatId(self):
        return "-".join(sorted([str(self.sender.id), str(self.receiver.id)]))

    def __str__(self):
        return self.message
    

class Chat(models.Model):
    chatId = models.CharField(max_length=255)
    messages = models.ManyToManyField("Message", blank=True)
    offers = models.ManyToManyField("Offer", blank=True)
    users = models.ManyToManyField("User", blank=True)
    timeCreated = models.DateTimeField(default=datetime.now, blank=True)

    def lastAccessed(self):
        # if no messages and no offers the the lastAccessed is the timeCreated
        if len(self.messages.all()) == 0 and len(self.offers.all()) == 0:
            return self.timeCreated
        elif len(self.messages.all()) > 0 and len(self.offers.all()) == 0:
            return self.messages.all().order_by("-date")[0].date
        elif len(self.messages.all()) == 0 and len(self.offers.all()) > 0:
            return self.offers.all().order_by("-date")[0].date
        else:
            lastMessage = self.messages.all().order_by("-date")[0].date
            lastOffer = self.offers.all().order_by("-date")[0].date
            if lastMessage > lastOffer:
                return lastMessage
            else:
                return lastOffer

    def __str__(self):
        return self.chatId
