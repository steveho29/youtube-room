# Generated by Django 3.2.8 on 2021-10-16 03:28

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_room_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2021, 10, 16, 10, 28, 9, 974853), serialize=False),
        ),
        migrations.AlterField(
            model_name='room',
            name='video_duration',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='room',
            name='video_status',
            field=models.FloatField(default=-1),
        ),
    ]