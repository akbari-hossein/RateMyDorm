from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from building.models import Building

User = get_user_model()

class Comment(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name=_("Student")
    )
    building = models.ForeignKey(
        Building,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name=_("Building")
    )
    
    content = models.TextField(verbose_name=_("Content"))
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_("Overall Rating"),
        help_text=_("Rating must be between 1 and 5")
    )
    image = models.ImageField(
        upload_to='comment_images/%Y/%m/', 
        blank=True, 
        null=True, 
        verbose_name=_("Image")
    )
    created_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name=_("Created At"))

    is_approved = models.BooleanField(
        default=False, 
        verbose_name=_("Is Approved by Admin")
    )
    class Meta:
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")
        ordering = ['-created_at'] # Order by most recent comments first

    # Override save method to call full_clean for validation before saving
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} -> {self.building.name} ({self.rating})"