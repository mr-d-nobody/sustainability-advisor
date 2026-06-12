from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    credits = models.IntegerField(default=0)
    role = models.CharField(max_length=50, default='user')

    def __str__(self):
        return self.username

class History(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='history')
    electricity = models.FloatField(null=True, blank=True)
    water = models.FloatField(null=True, blank=True)
    waste = models.FloatField(null=True, blank=True)
    transport = models.FloatField(null=True, blank=True)
    renewable = models.FloatField(null=True, blank=True)
    carbon = models.FloatField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History {self.id} for {self.user.username}"

class Transaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions')
    amount = models.IntegerField()
    type = models.CharField(max_length=50) # 'credit' or 'debit'
    description = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction {self.id} for {self.user.username}"
