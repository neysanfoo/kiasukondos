# Generated by Django 4.1.5 on 2023-02-18 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0015_chat"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="isOfferAndPending",
            field=models.BooleanField(default=False),
        ),
    ]
