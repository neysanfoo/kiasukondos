from django.db import models
from datetime import datetime
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Hello(models.Model):
    message = models.CharField(max_length=255)

    def __str__(self):
        return self.message


class Listing(models.Model):
    owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=255)
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

class Review(models.Model):
    reviewer = models.ForeignKey("User", on_delete=models.CASCADE, related_name="reviews")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="reviews")
    review = models.TextField()
    rating = models.IntegerField()

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
    offer = models.IntegerField()
    is_accepted = models.BooleanField(default=False)
    is_declined = models.BooleanField(default=False)
    is_pending = models.BooleanField(default=True)

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

    def __str__(self):
        return self.message