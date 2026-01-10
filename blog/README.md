# Blog App (DRF) — Evertrek Nepal

This zip contains a **production-grade Blog Django app** designed for a
trekking agency website.

✅ Public read-only API (no auth/permissions)

✅ SEO-ready fields (meta, canonical, OpenGraph, Twitter, schema, FAQ schema)

✅ Flexible rich content blocks (headings, paragraphs, images, tables, FAQ, CTA)

✅ Optional TOC (auto-generated from headings)

✅ Slug history support (helps old links keep working)

---

## Install

1) Copy the `blog/` folder into your Django project apps.

2) Add to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
  # ...
  'rest_framework',
  'blog',
]
```

3) Include URLs (example):

```python
# project/urls.py
from django.urls import path, include

urlpatterns = [
  # ...
  path('api/', include('blog.urls')),
]
```

4) (Optional) Set your frontend URL for canonical links:

```python
FRONTEND_SITE_URL = 'https://evertreknepal.com'
```

5) Migrate:

```bash
python manage.py makemigrations blog
python manage.py migrate
```

---

## Public API Endpoints (Postman)

Base: `http://127.0.0.1:8000/api/`

### Posts

- `GET /blog/posts/`
  - query params:
    - `search=langtang`
    - `categorySlug=trekking`
    - `regionSlug=langtang`
    - `authorSlug=evertrek-nepal-team`
    - `language=en`
    - `tag=langtang`
    - `ordering=-publish_date` (default)

- `GET /blog/posts/{slug}/`
  - increments `views`
  - if `{slug}` is an old slug, it will resolve via slug history and return the post
    (response header: `X-Canonical-Slug`)

### Categories

- `GET /blog/categories/`
- `GET /blog/categories/{slug}/`

### Regions

- `GET /blog/regions/`
- `GET /blog/regions/{slug}/`

### Authors

- `GET /blog/authors/`
- `GET /blog/authors/{slug}/`

---

## Creating posts

This app ships **without an admin API** (as requested).

Create/edit posts using **Django Admin** (`/admin/`) for now.

Later, you can plug in a private Admin API using the included
`BlogPostWriteSerializer`.
