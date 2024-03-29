from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.HelloView.as_view()),
    path("listings/", views.ListingView.as_view()),
    path("user/", views.UserView.as_view()),
    path("reviews/", views.ReviewView.as_view()),
    path("addresses/", views.AddressView.as_view()),
    path("listings/<int:pk>/", views.ListingDetailView.as_view()),
    path("listings-by-user/", views.ListingByUserView.as_view()),
    path("register/", views.RegisterView.as_view()),
    path("login/", views.LoginView.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("search/", views.SearchListingView.as_view()),
    path("purchases/", views.UserPurchasesView.as_view()),
    path("likes/", views.LikeView.as_view()),
    path("fetch-like-status/<int:listing_id>", views.fetch_like_status),
    path("offers/", views.OfferView.as_view()),
    path("messages/", views.MessageView.as_view()),
    path("add-message/", views.AddMessage.as_view()),
    path("chat/", views.CreateChatView.as_view()),
    path("fetch-chats-of-user/", views.fetch_chats_of_user),
    path("add-offer/", views.AddOffer.as_view()),
    path("offer/accept/", views.AcceptOfferView.as_view()),
    path("user-profile/", views.UserProfileView.as_view()),
    path("change-password/", views.ChangePasswordView.as_view()),
    path("leave-review/", views.ReviewUserView.as_view()),
    path("public-user-profile/<int:id>", views.fetch_public_profile),
    path("listing-analytics/<int:pk>",views.fetch_analytics),
    path("predicted-price/<str:town>/<int:property_type>/<str:sale_or_rent>/<int:bedrooms>/", views.fetch_mean_price),
]