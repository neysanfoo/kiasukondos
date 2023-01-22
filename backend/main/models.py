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

    def __str__(self):
        return self.title

class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.name

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

