# views.py
from urllib import response
from django.contrib.auth import get_user_model
from django.shortcuts import render
# views.py in your Django app
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.http import JsonResponse
import logging
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Museum
from .serializers import MuseumSerializer, TimeSlotSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Museum, TimeSlot
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Museum, TimeSlot
from .serializers import TimeSlotSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import TimeSlot, Museum

def index(request):
    return render(request, 'index.html')


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'message': 'User created successfully!'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

from django.contrib.auth import get_user_model

User = get_user_model()



@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('username')  # Using email as the username
            password = data.get('password')

            # Fetch user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)

            # Authenticate with username (or email) and password
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                login(request, user)
                # Generate or get the token for the user
                token, created = Token.objects.get_or_create(user=user)
                return JsonResponse({'message': 'Login successful!', 'token': token.key}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            # Log the error to the server logs
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': 'Something went wrong. Please try again.'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



logger = logging.getLogger(__name__)

from rest_framework.authtoken.models import Token

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        token_key = request.headers.get('Authorization').split()[1]
        try:
            token = Token.objects.get(key=token_key)
            token.delete()
            logout(request)
            return JsonResponse({'message': 'Logged out successfully!'}, status=200)
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=400)
        except Exception as e:
            print(f"Error during logout: {e}")
            return JsonResponse({'error': 'Internal server error'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    

class profile_view(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            'username': user.username,
            'email': user.email,
            # Add more fields as needed
        }
        return Response(user_data)
    


@api_view(['GET'])
def museum_list(request):
    city = request.GET.get('city', '')
    museums = Museum.objects.filter(city__name__icontains=city)
    serializer = MuseumSerializer(museums, many=True)
    return Response(serializer.data)





@api_view(['GET'])
def get_available_time_slots(request, museum_id):
    try:
        museum = Museum.objects.get(id=museum_id)
        time_slots = TimeSlot.objects.filter(museum=museum)
        serializer = TimeSlotSerializer(time_slots, many=True)
        return Response(serializer.data)
    except Museum.DoesNotExist:
        return Response({"error": "Museum not found"}, status=404)


# views.py
@api_view(['POST'])
def book_tickets(request):
    slot_id = request.data.get('slot_id')
    num_tickets = int(request.data.get('num_tickets'))

    time_slot = TimeSlot.objects.get(id=slot_id)

    if time_slot.available_tickets >= num_tickets:
        time_slot.available_tickets -= num_tickets
        time_slot.save()
        return Response({"message": "Booking successful"})
    else:
        return Response({"message": "Not enough tickets available"}, status=400)
    


# views.py



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request, museum_id):
    slot_id = request.data.get('slot_id')
    email = request.data.get('email')  # Get email from the request

    try:
        museum = Museum.objects.get(id=museum_id)
        time_slot = TimeSlot.objects.get(id=slot_id, museum=museum)

        if time_slot.available_tickets <= 0:
            return Response({'error': 'No tickets available for this time slot'}, status=status.HTTP_400_BAD_REQUEST)

        time_slot.available_tickets -= 1
        time_slot.save()

        subject = 'Ticket Booking Confirmation'
        message = f"""
        Dear {request.user.username},

        Your ticket has been successfully booked for {museum.name}.
        
        Details:
        - Date: {timezone.now().strftime('%Y-%m-%d')}
        - Time Slot: {time_slot.start_time} - {time_slot.end_time}
        - Status: Paid
        
        Thank you for booking with us!

        Best regards,
        The Museum Team
        """
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])

        return Response({'message': 'Booking confirmed and email sent!'}, status=status.HTTP_200_OK)
    except Museum.DoesNotExist:
        return Response({'error': 'Museum not found'}, status=status.HTTP_404_NOT_FOUND)
    except TimeSlot.DoesNotExist:
        return Response({'error': 'Time slot not found'}, status=status.HTTP_404_NOT_FOUND)





