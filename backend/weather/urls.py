from django.conf.urls import url, include
from backend.weather.views import ForecastViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'forecast', ForecastViewSet)

urlpatterns = []
urlpatterns += router.urls