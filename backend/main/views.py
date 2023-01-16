from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import permissions
from .models import Hello

class HelloView(generics.ListAPIView):
    def get(self, request):
        message = Hello.objects.all()
        return Response({"message": message[0].message})