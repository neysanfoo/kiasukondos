# Generated by Django 4.1.5 on 2023-01-22 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0006_alter_user_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="listing",
            name="photo_1",
            field=models.ImageField(null=True, upload_to="photos/%Y/%m/%d/"),
        ),
        migrations.AlterField(
            model_name="listing",
            name="photo_2",
            field=models.ImageField(null=True, upload_to="photos/%Y/%m/%d/"),
        ),
        migrations.AlterField(
            model_name="listing",
            name="photo_3",
            field=models.ImageField(null=True, upload_to="photos/%Y/%m/%d/"),
        ),
        migrations.AlterField(
            model_name="listing",
            name="photo_4",
            field=models.ImageField(null=True, upload_to="photos/%Y/%m/%d/"),
        ),
        migrations.AlterField(
            model_name="listing",
            name="photo_5",
            field=models.ImageField(null=True, upload_to="photos/%Y/%m/%d/"),
        ),
        migrations.AlterField(
            model_name="listing",
            name="photo_6",
            field=models.ImageField(null=True, upload_to="photos/%Y/%m/%d/"),
        ),
    ]
