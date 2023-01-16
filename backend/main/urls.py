from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.HelloView.as_view()),
    path("listings/", views.ListingView.as_view()),
    path("users/", views.UserView.as_view()),
    path("reviews/", views.ReviewView.as_view()),
    path("addresses/", views.AddressView.as_view()),
]