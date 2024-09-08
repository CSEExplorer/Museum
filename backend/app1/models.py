from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db.models.signals import post_save
from django.dispatch import receiver

class City(models.Model):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}, {self.state}"

class Museum(models.Model):
    name = models.CharField(max_length=100)
    fare = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    address = models.CharField(max_length=255)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='museums')
    other_details = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='museums/', blank=True, null=True)  # Added image field

    def __str__(self):
        return self.name

class TimeSlot(models.Model):
    museum = models.ForeignKey(Museum, on_delete=models.CASCADE, related_name='time_slots')
    start_time = models.TimeField()
    end_time = models.TimeField()
    available_tickets = models.IntegerField(default=100)
    

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"

class ClosingDay(models.Model):
    museum = models.ForeignKey(Museum, on_delete=models.CASCADE, related_name='closing_days')
    day = models.CharField(max_length=10)

    def __str__(self):
        return self.day
    



class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15, validators=[RegexValidator(r'^\+?1?\d{9,15}$')])
    address = models.TextField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username

    

