from decimal import Decimal, InvalidOperation
from django.db.models import Q
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from .serializers import ExampleVoucherSerializer
from rest_framework.decorators import action
from .models import ExampleVoucher, VoucherRedemption
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from rest_framework.permissions import IsAuthenticatedOrReadOnly

@extend_schema_view(
    list=extend_schema(
        summary="List all vouchers",
        description="Returns a list of all vouchers in the vouchershop.",
        parameters=[
            OpenApiParameter(
                name='status',
                description='Filter vouchers by status (active, redeemed, expired)',
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name='search',
                description='Search vouchers by recipient name or email (case-insensitive)',
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name='ordering',
                description='Sort vouchers by created_at (created_at or -created_at)',
                required=False,
                type=str,
            ),
        ],
    ),
    create=extend_schema(
        summary="Add a new voucher",
        description="Adds a new voucher to the vouchershop inventory.",
    ),
    retrieve=extend_schema(
        summary="Get voucher details",
        description="Returns the details of a single voucher by its ID.",
    ),
    update=extend_schema(
        summary="Replace a voucher",
        description="Completely replaces an existing voucher's data.",
    ),
    partial_update=extend_schema(
        summary="Update voucher fields",
        description="Updates specific fields of an existing voucher.",
    ),
    destroy=extend_schema(
        summary="Remove a voucher",
        description="Permanently removes a voucher from the inventory.",
    ),
)


class VoucherViewSet(viewsets.ModelViewSet):
    queryset = ExampleVoucher.objects.all().order_by('-created_at')
    serializer_class = ExampleVoucherSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(recipient__icontains=search) | Q(email__icontains=search)
            )

        ordering = self.request.query_params.get('ordering')
        if ordering in ('created_at', '-created_at'):
            queryset = queryset.order_by(ordering)

        return queryset

    @action(detail=True, methods=['post'])
    def redeem(self, request, pk=None):
        voucher = self.get_object()
        if voucher.status != 'active':
            return Response({'error': 'Voucher is not active'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = Decimal(str(request.data.get('amount', voucher.remaining_value)))
        except (InvalidOperation, TypeError):
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'Amount must be greater than zero'}, status=status.HTTP_400_BAD_REQUEST)
        if amount > voucher.remaining_value:
            return Response({'error': 'Amount exceeds remaining balance'}, status=status.HTTP_400_BAD_REQUEST)

        voucher.remaining_value -= amount
        voucher.redeemed_at = timezone.now()
        if voucher.remaining_value == 0:
            voucher.status = 'redeemed'
        voucher.save()

        VoucherRedemption.objects.create(voucher=voucher, amount=amount)

        serializer = self.get_serializer(voucher)
        return Response(serializer.data)
