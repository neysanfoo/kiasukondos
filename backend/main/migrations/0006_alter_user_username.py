# Generated by Django 4.1.5 on 2023-01-22 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0005_rename_name_user_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(max_length=255, unique=True),
        ),
    ]