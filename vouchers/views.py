from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from .serializers import ExampleVoucherSerializer
from rest_framework.decorators import action
from .models import ExampleVoucher

class VoucherViewSet(viewsets.ModelViewSet):
    queryset = ExampleVoucher.objects.all().order_by('-created_at')
    serializer_class = ExampleVoucherSerializer
    @action(detail=True, methods=['post'])
    def redeem(self, request, pk=None):
        voucher = self.get_object()
        if voucher.status != 'active':
            return Response({'error': 'Voucher is not active'}, status=status.HTTP_400_BAD_REQUEST)
        voucher.status = 'redeemed'
        voucher.redeemed_at = timezone.now()
        voucher.save()
        return Response({'message': 'Voucher redeemed successfully'})
