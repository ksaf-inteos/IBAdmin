# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-11-04 19:47
from __future__ import unicode_literals

from django.db import migrations
from config.restype import RESTYPE


def updaterestoremcj(apps, schema_editor):
    ConfComponent = apps.get_model('config', 'ConfComponent')
    ConfResource = apps.get_model('config', 'ConfResource')
    ConfParameter = apps.get_model('config', 'ConfParameter')
    dircompid = ConfComponent.objects.filter(type='D')
    for dir in dircompid:
        resid = ConfResource.objects.get(compid=dir, type_id=RESTYPE['Job'], name='Restore')
        applied = ConfParameter.objects.filter(resid=resid, name='MaximumConcurrentJobs').count()
        if applied == 0:
            mcj = ConfParameter(resid=resid, name='MaximumConcurrentJobs', value=8)
            mcj.save()


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0003_auto_20181031_2340'),
    ]

    operations = [
        migrations.RunPython(updaterestoremcj),
    ]
