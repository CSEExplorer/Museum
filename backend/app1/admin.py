from django.contrib import admin
from .models import City, Museum, TimeSlot, ClosingDay,Booking

from django.contrib import admin
from .models import UserProfile

class TimeSlotInline(admin.TabularInline):
    model = TimeSlot
    extra = 1  # Number of empty forms to display

class ClosingDayInline(admin.TabularInline):
    model = ClosingDay
    extra = 1  # Number of empty forms to display

class MuseumAdmin(admin.ModelAdmin):
    list_display = ('name', 'fare', 'address', 'city')
    search_fields = ('name', 'address', 'city__name')
    list_filter = ('city',)
    inlines = [TimeSlotInline, ClosingDayInline]

class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state')
    search_fields = ('name', 'state')

class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('museum', 'start_time', 'end_time','available_tickets')
    list_filter = ('museum','start_time')

class ClosingDayAdmin(admin.ModelAdmin):
    list_display = ('museum', 'day')
    list_filter = ('museum',)



class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'city', 'state')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'museum', 'date_of_visit', 'number_of_tickets')  # Fields to display in the list view
    list_filter = ('date_of_visit', 'museum')  # Filters for the list view
    search_fields = ('user__username', 'museum__name')  # Search fields in the admin interface
    ordering = ('-date_of_visit',)  # Default ordering of the list view

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(Museum, MuseumAdmin)
admin.site.register(TimeSlot, TimeSlotAdmin)
admin.site.register(ClosingDay, ClosingDayAdmin)


