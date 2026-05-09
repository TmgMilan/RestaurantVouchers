from rest_framework import serializers
from .models import ExampleVoucher

class ExampleVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleVoucher
        fields = '__all__'
        read_only_fields = ['code', 'created_at']
