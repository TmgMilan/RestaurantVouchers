from django.db import models
import uuid

# Create your models here.


class ExampleVoucher(models.Model):

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('redeemed', 'Redeemed'),
        ('expired', 'Expired')
    ]
    code = models.CharField(max_length=20, unique=True, editable=False)
    email = models.EmailField(blank=True)
    recipient = models.CharField(max_length=50)
    value = (models.DecimalField(max_digits=8, decimal_places=2))
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    redeemed_at = models.DateTimeField(null=True, blank=True)
    expiry_date = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.code} - {self.recipient}"
