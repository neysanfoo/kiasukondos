# Generated by Django 4.1.5 on 2023-02-22 07:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="listing",
            name="review",
        ),
    ]