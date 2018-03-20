from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Historical(models.Model):

    DATE = models.CharField(max_length=8, primary_key=True)
    TMAX = models.FloatField()
    TMIN = models.FloatField()

    class Meta:
        verbose_name = "Historical"
        verbose_name_plural = "Historical"