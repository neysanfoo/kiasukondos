# Generated by Django 4.1.5 on 2023-02-17 02:45

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0012_message"),
    ]

    operations = [
        migrations.AddField(
            model_name="offer",
            name="date",
            field=models.DateTimeField(blank=True, default=datetime.datetime.now),
        ),
    ]