from __future__ import annotations

import mimetypes
from collections.abc import Iterable

from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

ALLOWED_IMAGE_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


def _format_size(size: int) -> str:
    for unit in ("bytes", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} GB"


@deconstructible
class ImageFileValidator:
    """Validator that enforces MIME type + max size for uploaded images."""

    def __init__(self, max_mb: int = 5, allowed_mime_types: Iterable[str] | None = None) -> None:
        self.max_mb = max_mb
        self.allowed_mime_types = set(allowed_mime_types or ALLOWED_IMAGE_MIME_TYPES)
        self.max_bytes = max_mb * 1024 * 1024

    def __call__(self, file) -> None:
        if not file:
            return

        size = getattr(file, "size", None)
        if size is not None and size > self.max_bytes:
            raise ValidationError(
                f"Image must be smaller than {self.max_mb} MB ({_format_size(self.max_bytes)} max).",
                code="file_too_large",
            )

        content_type = self._get_content_type(file)
        if content_type and content_type not in self.allowed_mime_types:
            raise ValidationError(
                "Unsupported image type. Allowed types: jpeg, png, webp.",
                code="invalid_mime_type",
            )

    def _get_content_type(self, file) -> str | None:
        ct = getattr(file, "content_type", None)
        if ct:
            return ct
        name = getattr(file, "name", "")
        if name:
            return mimetypes.guess_type(name)[0]
        return None
