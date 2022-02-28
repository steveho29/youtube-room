from django.urls import path
from rest_framework import views
from . import views

urlpatterns = [
    path('view/', views.RoomView.as_view()),
    path('create/', views.CreateRoomView.as_view()),
    path('get-room/', views.GetRoom.as_view()),
    path('checkUserInRoom/', views.CheckUserInRoom.as_view()),
    path('leave-room/', views.LeaveRoom.as_view()),
    path('update-room/', views.UpdateRoom.as_view()),
    path('update-video-room/', views.UpdateVideoRoom.as_view()),
    path('current-video/', views.CurrentVideo.as_view()),
    

]
