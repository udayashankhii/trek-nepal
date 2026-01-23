from pathlib import Path
import os
import sys

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------------------------------------------
# Load .env (optional, keeps secrets out of git)
# -------------------------------------------------------------------
env_paths = [
    BASE_DIR / ".env",
    BASE_DIR / ".venv" / ".env",
]
for env_path in env_paths:
    if not env_path.exists():
        continue
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("\"'")  # allow quoted values
        os.environ.setdefault(key, value)

# -------------------------------------------------------------------
# Core
# -------------------------------------------------------------------
SECRET_KEY = 'django-insecure-%1#v9z$=mc$ogkyd2&!-!tx!474^rpucz__1u&aa0%2^k05_v#'
DEBUG = True

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# -------------------------------------------------------------------
# Installed Apps
# -------------------------------------------------------------------
INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

    # Third-party
    'rest_framework',
    'django_filters',
    'corsheaders',
    'django_cleanup.apps.CleanupConfig',  # keep AFTER apps that store files
    'nested_admin',

    # Local apps
    'TrekCard',
    'tours',
    'blog.blog.apps.BlogConfig',
    'admin_api',
    'accounts',
    'bookings',
    'travel_info',
    'about_info',
    'travel_styles',
    'customize_trip',
]

# -------------------------------------------------------------------
# REST Framework
# -------------------------------------------------------------------
REST_FRAMEWORK = {
    # ✅ Auth (Admin APIs will use JWT)
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),

    # ✅ Keep AllowAny as your global default (so public APIs still work)
    # Your admin_api endpoints already enforce IsStaff, so it's safe.
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],

    # ✅ Filters (keep your existing)
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],

    # ✅ Pagination (keep your existing)
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,

    # ✅ Throttling (recommended)
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "300/min",
        "user": "600/min",
        "admin_login": "10/min",  # used by /api/admin/auth/login/
        "accounts_login": "10/min",
        "accounts_register": "5/min",
        "accounts_otp": "10/min",
        "accounts_password": "5/min",
        "inquiry_create": "10/hour",
    },
}


from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}



# -------------------------------------------------------------------
# Middleware
# -------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # must be high in the list
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# -------------------------------------------------------------------
# CORS / CSRF (Vite dev server)
# -------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

# -------------------------------------------------------------------
# URLs / WSGI
# -------------------------------------------------------------------
ROOT_URLCONF = 'Evertrek_Nepal.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # add template dirs here if needed
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Evertrek_Nepal.wsgi.application'

# -------------------------------------------------------------------
# Database (PostgreSQL)
# -------------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'evertrek_db'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'Evertrek'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

RUNNING_TESTS = any(arg in {"test", "testserver"} for arg in sys.argv)

if RUNNING_TESTS:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'test.sqlite3',
        }
    }

AUTH_USER_MODEL = "auth.User"  # explicit default so migrations always resolve auth.user

# -------------------------------------------------------------------
# Auth / i18n
# -------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kathmandu'  # local time
USE_I18N = True
USE_TZ = True

# -------------------------------------------------------------------
# Static & Media
# -------------------------------------------------------------------
STATIC_URL = 'static/'
STATICFILES_DIRS = []  # add local static dirs if needed
# For production you’ll typically set:
# STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# -------------------------------------------------------------------
# Email
# -------------------------------------------------------------------
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "no-reply@evertrek.local")
SITE_NAME = os.getenv("SITE_NAME", "EverTrek Nepal")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", DEFAULT_FROM_EMAIL)
DEFAULT_REPLY_TO_EMAIL = os.getenv("DEFAULT_REPLY_TO_EMAIL", SUPPORT_EMAIL)
BRAND_COLOR = os.getenv("BRAND_COLOR", "#2563eb")
LOGO_URL = os.getenv("LOGO_URL", "")
COMPANY_ADDRESS = os.getenv("COMPANY_ADDRESS", "")
SOCIAL_INSTAGRAM = os.getenv("SOCIAL_INSTAGRAM", "")
SOCIAL_FACEBOOK = os.getenv("SOCIAL_FACEBOOK", "")
SOCIAL_YOUTUBE = os.getenv("SOCIAL_YOUTUBE", "")
SOCIAL_WHATSAPP = os.getenv("SOCIAL_WHATSAPP", "")

CUSTOMIZE_TRIP_ADMIN_EMAILS = [
    candidate.strip()
    for candidate in os.getenv("CUSTOMIZE_TRIP_ADMIN_EMAILS", "").split(",")
    if candidate.strip()
]
if not CUSTOMIZE_TRIP_ADMIN_EMAILS:
    CUSTOMIZE_TRIP_ADMIN_EMAILS = [DEFAULT_FROM_EMAIL]

# -------------------------------------------------------------------
# Stripe
# -------------------------------------------------------------------
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
if SENDGRID_API_KEY:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = "smtp.sendgrid.net"
    EMAIL_PORT = 587
    EMAIL_HOST_USER = "apikey"
    EMAIL_HOST_PASSWORD = SENDGRID_API_KEY
    EMAIL_USE_TLS = True
    EMAIL_TIMEOUT = 10
else:
    # default to console backend for development
    EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")

# -------------------------------------------------------------------
# OAuth (Google)
# -------------------------------------------------------------------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

# -------------------------------------------------------------------
# Defaults
# -------------------------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
