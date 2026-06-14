from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    # Display relevant fields in the admin list view
    list_display = ('id', 'student', 'building', 'rating', 'is_approved', 'created_at')
    # Allow filtering by approval status, rating, and building
    list_filter = ('is_approved', 'rating', 'building')
    # Allow searching by student username and building name
    list_display_links = ('id', 'student')
    
    actions = ['approve_comments']

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"