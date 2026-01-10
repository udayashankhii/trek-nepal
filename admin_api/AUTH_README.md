# Admin API – Auth (Industry-ready)

This app exposes JWT-based admin authentication endpoints under:

- POST  /api/admin/auth/login/   (staff-only login)
- GET   /api/admin/auth/me/      (current admin profile)
- POST  /api/admin/auth/refresh/ (SimpleJWT refresh)
- POST  /api/admin/auth/verify/  (SimpleJWT verify)
- POST  /api/admin/auth/logout/  (blacklist refresh token if enabled)

## Requirements (project-level)
Install:

    pip install djangorestframework-simplejwt[token_blacklist]

Configure `REST_FRAMEWORK` default authentication to JWTAuthentication
and (recommended) enable login throttling scope "admin_login".

## Creating admin users
Use Django:

    python manage.py createsuperuser

Ensure the admin user has `is_staff=True` (required).
