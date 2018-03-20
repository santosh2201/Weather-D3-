from django.shortcuts import render
from rest_framework import viewsets
from .models import Historical
from .serializers import HistoricalSerializer
from rest_framework import mixins, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import timedelta
from datetime import datetime
from django.core.serializers import serialize
from django.db.models import Max

class ForecastViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
	queryset = Historical.objects.all()
	serializer_class = HistoricalSerializer
	def getTwoDigit(self, value):
		if value<10:
			return "0"+unicode(value)
		else:
			return ""+unicode(value)

	def retrieve(self, request, pk=None):
		forecast = [2013, 1, 1]
		result = []
		try:
			forecast = [int(pk[:4]), int(pk[4:6]), int(pk[6:])]
		except:
			return Response("Invalid Input", status=status.HTTP_406_NOT_ACCEPTABLE)
		try:
			startDate = datetime(forecast[0], forecast[1], forecast[2])
			for n in range(5):
				singleDate = startDate + timedelta(days=n)
				endsWith = self.getTwoDigit(singleDate.month)+""+self.getTwoDigit(singleDate.day)
				date = unicode(singleDate.year)+endsWith
				serializer = self.get_serializer(Historical.objects.all().filter(DATE=date), many=True)
				if len(serializer.data):
					result.append(serializer.data[0])
				else:
					data = {}
					serializer = self.get_serializer(Historical.objects.all().filter(DATE__endswith=endsWith), many=True)
					data['DATE'] = date
					avg = Historical.objects.all().filter(DATE__endswith=endsWith).aggregate(Max('TMAX'))
					data['TMAX'] = round(avg['TMAX__max'], 1)
					avg = Historical.objects.all().filter(DATE__endswith=endsWith).aggregate(Max('TMIN'))
					data['TMIN'] = round(avg['TMIN__max'], 1)
					result.append(data)
		except Exception as e:
			return Response(e.message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		return Response(result)
