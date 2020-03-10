from __future__ import absolute_import

from django.conf import settings
from django.db import models

from sentry.db.models import BaseManager, FlexibleForeignKey, Model, sane_repr

from django.utils import timezone


class GroupBookmark(Model):
    """
    Identifies a bookmark relationship between a user and an
    aggregated event (Group).
    """

    __core__ = False

    project = FlexibleForeignKey("sentry.Project", related_name="bookmark_set")
    group = FlexibleForeignKey("sentry.Group", related_name="bookmark_set")
    # namespace related_name on User since we don't own the model
    user = FlexibleForeignKey(settings.AUTH_USER_MODEL, related_name="sentry_bookmark_set")
    date_added = models.DateTimeField(default=timezone.now, null=True)

    objects = BaseManager()

    class Meta:
        app_label = "sentry"
        db_table = "sentry_groupbookmark"
        # composite index includes project for efficient queries
        unique_together = (("project", "user", "group"),)

    __repr__ = sane_repr("project_id", "group_id", "user_id")
