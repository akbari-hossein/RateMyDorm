from django.db import models
from django.contrib.auth import get_user_model
from building.models import Building
from django.utils.timezone import now

User = get_user_model()

class Comment(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    content = models.TextField()
    created_at = models.DateTimeField(default=now, editable=False)
    image = models.ImageField(upload_to='dorms', blank=True, null=True)
    student = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name='comments'
    )
    building = models.ForeignKey(
        Building,
        on_delete = models.CASCADE,
        related_name='comments'
    )

    def __str__(self):
        return f"{self.student} on {self.building}: {self.content[:30]}"