# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-12-20 18:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storages', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Permissions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'managed': False,
                'permissions': (('view_storages', 'Can view storages'), ('add_storages', 'Can add alias storages'), ('change_storages', 'Can change alias storages'), ('delete_storages', 'Can delete alias storages'), ('status_storages', 'Can status storages'), ('advanced_storages', 'Can change advanced properties'), ('view_dedup', 'Can view dedup engine'), ('dedup_vacuum', 'Can vacuum dedup engine'), ('label_tapes', 'Can label tapes in tape library'), ('view_volumes', 'Can view volumes'), ('change_volumes', 'Can change volumes status'), ('recycle_volumes', 'Can recycle volumes'), ('delete_volumes', 'Can delete volumes'), ('comment_volumes', 'Can comment volumes'), ('view_volumelogs', 'Can view volume logs')),
            },
        ),
    ]
