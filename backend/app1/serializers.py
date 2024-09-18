from rest_framework import serializers
from .models import Museum, City, TimeSlot, ClosingDay,Booking,User


from .models import UserProfile
from django.contrib.auth.models import User

class MuseumSerializer(serializers.ModelSerializer):
    city = serializers.StringRelatedField()
    time_slots = serializers.StringRelatedField(many=True)
    closing_days = serializers.StringRelatedField(many=True)
    image = serializers.ImageField(use_url=True)  # Ensure image URL is included

    class Meta:
        model = Museum
        fields = ['id', 'name', 'fare', 'address', 'city', 'other_details', 'image', 'time_slots', 'closing_days']
   

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_time', 'available_tickets']


class UserProfileSerializer(serializers.ModelSerializer):
    # Include fields from the related User model
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'phone_number', 'address', 'city', 'state','profile_image']




class BookingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Booking
        fields = ['user', 'museum', 'date_of_visit', 'number_of_tickets']
