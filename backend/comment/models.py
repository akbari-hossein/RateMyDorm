from django.db import models
from django.contrib.auth import get_user_model
from university.models import University
from django.utils.timezone import now

User = get_user_model()

class Comment(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    content = models.TextField()
    created_at = models.DateTimeField(default=now, editable=False)
    image = models.ImageField(upload_to='dorms')
    student = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name='comment'
    )
    university = models.ForeignKey(
        University,
        on_delete = models.CASCADE,
        related_name='comment'
    )