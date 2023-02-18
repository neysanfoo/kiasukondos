# Generated by Django 4.1.5 on 2023-02-18 04:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0013_offer_date"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="isOffer",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="message",
            name="isOfferAndAccepted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="message",
            name="isOfferAndDeclined",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="message",
            name="isOfferAndPending",
            field=models.BooleanField(default=True),
        ),
    ]
