# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-07-12 04:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('departments', '0002_departments_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='departments',
            name='description',
            field=models.TextField(),
        ),
    ]