# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-07-12 03:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('departments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='departments',
            name='color',
            field=models.CharField(default='bg-blue', max_length=20),
        ),
    ]