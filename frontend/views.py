from django.shortcuts import render


def index(request, roomCode=None):
    return render(request, 'frontend/index.html')
