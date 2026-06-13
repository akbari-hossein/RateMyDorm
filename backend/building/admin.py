from django.contrib import admin
from .models import Building

@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'university', 'gender')
    list_filter = ('university', 'gender') 