from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser, History, Transaction
from .serializers import UserSerializer, HistorySerializer, TransactionSerializer
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        'credits': user.credits,
        'role': user.role
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response("Missing fields", status=status.HTTP_400_BAD_REQUEST)
    
    if CustomUser.objects.filter(username=username).exists():
        return Response("User already exists", status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response("Registered successfully", status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = CustomUser.objects.filter(username=username).first()
    if not user:
        return Response("No user", status=status.HTTP_400_BAD_REQUEST)
        
    user = authenticate(username=username, password=password)
    if not user:
        return Response("Wrong password", status=status.HTTP_400_BAD_REQUEST)
        
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'token': str(refresh.access_token),
        'userId': user.id,
        'username': user.username,
        'credits': user.credits,
        'role': user.role
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_advice(request):
    user = request.user
    if user.credits <= 0:
        return Response({'error': 'Insufficient credits'}, status=status.HTTP_403_FORBIDDEN)
        
    data = request.data
    prompt = f"""
Give short actionable sustainability advice.
Electricity: {data.get('electricity')}
Water: {data.get('water')}
Waste: {data.get('waste')}
Transport: {data.get('transport')}
Renewable: {data.get('renewable')}
Respond in bullet points under 150 words.
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
        )
        advice = response.choices[0].message.content
        
        user.credits -= 1
        user.save()
        
        Transaction.objects.create(
            user=user,
            amount=1,
            type='debit',
            description='AI advice usage'
        )
        
        return Response({
            'advice': advice,
            'remainingCredits': user.credits
        })
    except Exception as e:
        print(e)
        return Response({'error': 'AI failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def save_history(request):
    try:
        data = request.data
        user_id = data.get('userId')
        user = CustomUser.objects.filter(id=user_id).first()
        if user:
            History.objects.create(
                user=user,
                electricity=data.get('electricity'),
                water=data.get('water'),
                waste=data.get('waste'),
                transport=data.get('transport'),
                renewable=data.get('renewable'),
                carbon=data.get('carbon'),
                score=data.get('score')
            )
        return Response({'status': 'saved'})
    except Exception as e:
        print(e)
        return Response({'error': 'Failed to save'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history(request):
    history = History.objects.filter(user=request.user).order_by('-id')
    serializer = HistorySerializer(history, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    transactions = Transaction.objects.filter(user=request.user).order_by('-id')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_recharge(request):
    if request.user.role != 'admin':
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        
    username = request.data.get('username')
    amount = request.data.get('amount')
    
    try:
        numeric_amount = int(amount)
        if numeric_amount <= 0:
            raise ValueError()
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
    if not username:
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
    target_user = CustomUser.objects.filter(username=username).first()
    if not target_user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    target_user.credits += numeric_amount
    target_user.save()
    
    Transaction.objects.create(
        user=target_user,
        amount=numeric_amount,
        type='credit',
        description='Admin recharge'
    )
    
    return Response({
        'message': 'Credits added successfully',
        'newCredits': target_user.credits,
        'rechargedUser': target_user.username
    })
