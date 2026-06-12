from django.urls import path
from . import views

urlpatterns = [
    path('user/me', views.get_current_user, name='get_current_user'),
    path('register', views.register, name='register'),
    path('login', views.login_view, name='login'),
    path('ai-advice', views.ai_advice, name='ai_advice'),
    path('save', views.save_history, name='save_history'),
    path('history', views.get_history, name='get_history'),
    path('transactions', views.get_transactions, name='get_transactions'),
    path('admin/recharge', views.admin_recharge, name='admin_recharge'),
]
