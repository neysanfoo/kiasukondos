from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.HelloView.as_view()),
    path("listings/", views.ListingView.as_view()),
    path("user/", views.UserView.as_view()),
    path("reviews/", views.ReviewView.as_view()),
    path("addresses/", views.AddressView.as_view()),
    path("listings/<int:pk>/", views.ListingDetailView.as_view()),
    path("register/", views.RegisterView.as_view()),
    path("login/", views.LoginView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("search/", views.SearchListingView.as_view()),
]