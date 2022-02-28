from django.db import models
import random
import string
import datetime
# Create your models here.


def generateCode():
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

class Room(models.Model):
    code = models.CharField(max_length=8, default=generateCode, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_control = models.BooleanField(null=False, default=False)
    created_at = models.DateTimeField(default=datetime.datetime.now(), serialize=False)
    video_id = models.CharField(max_length=20, default="")
    video_status = models.IntegerField(default=-1)
    video_duration = models.FloatField(default=0)
    video_current_time = models.FloatField(default=0)



