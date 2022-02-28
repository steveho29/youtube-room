from django.urls import path
from .views import index

# handler404 = index
app_name = "frontend"


urlpatterns = [
    path('join/',index, name="join"),
    path('create/', index, name="create"),
    path('room/<str:roomCode>', index, name="room"),
    path('', index, name=""),
]
