from django.db import models
from django.db.models.fields import Field
from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_control', 'video_id', 'video_status', 'video_duration', 'video_current_time', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_control', 'video_id')


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('code', 'guest_can_control', 'video_id')
        

class UpdateVideoRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    
    class Meta:
        model = Room
        fields = ('code', 'video_id', 'video_status', 'video_duration', 'video_current_time')