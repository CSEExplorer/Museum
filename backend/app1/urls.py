# urls.py

from django.urls import path
from . import views
from django.urls import path
from .views import signup, login_view, logout_view,get_available_time_slots

urlpatterns = [
    path('', views.index, name='index'),
    path('api/signup/', signup, name='signup'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/profile/', views.profile_view.as_view() , name='profile'),
    path('api/museums/', views.museum_list, name='museum-list'),
    path('api/museums/<int:museum_id>/slots/', get_available_time_slots, name='get_time_slots'),
    path('api/museums/<int:museum_id>/book/', views.book_ticket, name='book_ticket'), 
]
