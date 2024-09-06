from rest_framework import serializers
from .models import Museum, City, TimeSlot, ClosingDay

class MuseumSerializer(serializers.ModelSerializer):
    city = serializers.StringRelatedField()
    time_slots = serializers.StringRelatedField(many=True)
    closing_days = serializers.StringRelatedField(many=True)
    image = serializers.ImageField(use_url=True)  # Ensure image URL is included

    class Meta:
        model = Museum
        fields = ['id', 'name', 'fare', 'address', 'city', 'other_details', 'image', 'time_slots', 'closing_days']
