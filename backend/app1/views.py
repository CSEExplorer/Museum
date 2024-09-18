# views.py
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from rest_framework import status,viewsets
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Museum, TimeSlot, UserProfile,Booking
from .serializers import MuseumSerializer, TimeSlotSerializer, UserProfileSerializer,BookingSerializer
from xhtml2pdf import pisa
from io import BytesIO
from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
import logging
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from rest_framework.authtoken.models import Token
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








@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_ticket(request, museum_id):
    museum = get_object_or_404(Museum, pk=museum_id)
    slot_id = request.data.get('slot_id')
    email = request.data.get('email')

    try:
        time_slot = TimeSlot.objects.get(id=slot_id, museum=museum)
    except TimeSlot.DoesNotExist:
        return JsonResponse({"error": "Time slot does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Decrement available tickets
    if time_slot.available_tickets > 0:
        time_slot.available_tickets -= 1
        time_slot.save()
    else:
        return JsonResponse({"error": "No tickets available for this slot."}, status=status.HTTP_400_BAD_REQUEST)
    
    booking = Booking(
        date_of_visit = timezone.now().date() ,
        user=request.user,  # Get the currently authenticated user
        museum=museum,
       
        number_of_tickets=1  # Assuming 1 ticket per booking (adjust as needed)
    )
    booking.save()

    # Render HTML template to a string
    html = render_to_string('ticket_template.html', {'museum': museum, 'time_slot': time_slot})

    # Generate PDF
    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(html, dest=pdf_buffer)

    if pisa_status.err:
        return JsonResponse({"error": "Failed to generate PDF."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    pdf_buffer.seek(0)
    pdf_file = pdf_buffer.read()

    # Send email with PDF attachment
    email_message = EmailMessage(
        subject='Booking Confirmation',
        body='Your ticket is attached as a PDF.',
        from_email='your_email@gmail.com',
        to=[email],
    )

    # Attach the PDF to the email
    email_message.attach('ticket.pdf', pdf_file, 'application/pdf')
    email_message.send()

    return JsonResponse({"message": "Booking successful! Confirmation email with ticket sent."}, status=status.HTTP_200_OK)







@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        # Fetch user profile based on authenticated user
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'Profile not found.'}, status=404)

    if request.method == 'GET':
        # Handle GET request
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    if request.method == 'PUT':
        # Handle PUT request
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)  # `partial=True` allows partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    

    
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


@api_view(['GET'])
def check_login(request):
    if request.user.is_authenticated:
        return Response({'loggedIn': True}, status=status.HTTP_200_OK)
    else:
        return Response({'loggedIn': False}, status=status.HTTP_200_OK)









