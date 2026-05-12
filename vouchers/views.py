from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.utils import timezone
from .serializers import ExampleVoucherSerializer
from rest_framework.decorators import action
from .models import ExampleVoucher
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from rest_framework.permissions import IsAuthenticatedOrReadOnly

@extend_schema_view(
    list=extend_schema(
        summary="List all vouchers",
        description="Returns a list of all vouchers in the vouchershop.",
        parameters=[
            OpenApiParameter(
                name='title',
                description='Filter vouchers by title (case-insensitive)',
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name='author',
                description='Filter vouchers by author ID',
                required=False,
                type=int,
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
    @action(detail=True, methods=['post'])
    def redeem(self, request, pk=None):
        voucher = self.get_object()
        if voucher.status != 'active':
            return Response({'error': 'Voucher is not active'}, status=status.HTTP_400_BAD_REQUEST)
        voucher.status = 'redeemed'
        voucher.redeemed_at = timezone.now()
        voucher.save()
        return Response({'message': 'Voucher redeemed successfully'})
