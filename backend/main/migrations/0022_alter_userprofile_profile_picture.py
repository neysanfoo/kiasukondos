# Generated by Django 4.1.5 on 2023-02-21 05:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0021_alter_userprofile_profile_picture"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="profile_picture",
            field=models.ImageField(
                blank=True,
                default="photos/default/default_profile_picture.jpeg",
                null=True,
                upload_to="photos/%Y/%m/%d/",
            ),
        ),
    ]
