# urls.py


from . import views
from django.urls import path,include
from .views import signup, login_view, logout_view,get_available_time_slots,check_login
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet

router = DefaultRouter()
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/signup/', signup, name='signup'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/museums/', views.museum_list, name='museum-list'),
    path('api/museums/<int:museum_id>/slots/', get_available_time_slots, name='get_time_slots'),
    path('api/museums/<int:museum_id>/book/', views.book_ticket, name='book_ticket'), 
    path('api/user/profile/', views.get_user_profile, name='get_user_profile'),
    path('api/museums/<int:museum_id>/create_order/', views.create_order, name='create_order'),
    path('api/send_email/',views.send_email,name='send_email'),
    path('api/verify_payment/', views.verify_payment, name='verify_payment'),
    path('api/check-login/', check_login),
    path('api/', include(router.urls)),
   
]
