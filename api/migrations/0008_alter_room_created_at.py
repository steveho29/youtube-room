# Generated by Django 4.2.6 on 2023-10-06 04:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20211016_1029'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2023, 10, 6, 4, 1, 1, 50804), serialize=False),
        ),
    ]
