# Generated by Django 5.1 on 2024-09-06 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='timeslot',
            name='available_tickets',
            field=models.IntegerField(default=100),
        ),
    ]
