# Generated by Django 4.1.5 on 2023-02-22 07:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0003_review_reviewee_alter_review_reviewer"),
    ]

    operations = [
        migrations.AddField(
            model_name="listing",
            name="buyer_left_review",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="listing",
            name="seller_left_review",
            field=models.BooleanField(default=False),
        ),
    ]