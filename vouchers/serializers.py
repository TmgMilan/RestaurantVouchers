from rest_framework import serializers
from .models import ExampleVoucher, VoucherRedemption

class VoucherRedemptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoucherRedemption
        fields = ['id', 'amount', 'redeemed_at']


class ExampleVoucherSerializer(serializers.ModelSerializer):
    redemptions = VoucherRedemptionSerializer(many=True, read_only=True)
    redemption_count = serializers.SerializerMethodField()

    class Meta:
        model = ExampleVoucher
        fields = '__all__'
        read_only_fields = ['code', 'created_at', 'remaining_value']

    def get_redemption_count(self, obj):
        return obj.redemptions.count()
