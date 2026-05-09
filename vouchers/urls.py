from rest_framework import routers
from django.urls import path, include
from .views import VoucherViewSet

router = routers.SimpleRouter()
router.register(r'vouchers', VoucherViewSet, basename='vouchers')

urlpatterns = [
    path('', include(router.urls))
]
