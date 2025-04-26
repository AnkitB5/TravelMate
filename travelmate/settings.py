import os
from pathlib import Path
from dotenv import load_dotenv

# ─── Load .env ───────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_path = BASE_DIR / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    print(f"⚠️  WARNING: .env not found at {dotenv_path}")

# ─── Security ────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-fallback-only-for-dev")
DEBUG = os.getenv("DEBUG", "True") == "True"  # Set debug to True for now to see detailed errors
ALLOWED_HOSTS = ['http://18.118.238.99/',    "18.118.238.99", "localhost", "127.0.0.1"]  # Development hosts

# ─── Installed Apps ──────────────────────────────────────────────────────────
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",

    # Third-party
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",

    # Your apps
    "trips",
]

SITE_ID = 1

# ─── Middleware ──────────────────────────────────────────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "travelmate.urls"

# ─── Templates ───────────────────────────────────────────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",  # required by allauth
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "travelmate.wsgi.application"

# ─── Database ────────────────────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME":   BASE_DIR / "db.sqlite3",
    }
}

# ─── Password Validators ─────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
]

# ─── Internationalization / Static ────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE     = "UTC"
USE_I18N      = True
USE_L10N      = True
USE_TZ        = True
STATIC_URL    = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Directory where collected static files will be stored
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),  # Look for static files in a 'static' directory
]

# ─── CORS / CSRF ─────────────────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS    = False
CORS_ALLOWED_ORIGINS      = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CSRF_TRUSTED_ORIGINS      = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ─── REST Framework ──────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

# dj-rest-auth settings
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'auth',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh-token',
    'JWT_AUTH_SECURE': False,  # Set to True in production with HTTPS
    'SESSION_LOGIN': False,
}

REST_USE_JWT = True

# ─── django-allauth ──────────────────────────────────────────────────────────
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Email Configuration
if os.environ.get('EMAIL_HOST_USER') and os.environ.get('EMAIL_HOST_PASSWORD'):
    # Production email settings using SMTP (Gmail example)
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
else:
    # Development email settings (prints to console)
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = 'noreply@travelmate.com'
    print("WARNING: Using console email backend. Emails will be printed to console instead of being sent.")
    print("To send real emails, add these lines to your .env file:")
    print("EMAIL_HOST_USER=your-gmail@gmail.com")
    print("EMAIL_HOST_PASSWORD=your-app-password")
    print("(You need to generate an App Password in your Google Account)")
    print("See instructions at: https://support.google.com/accounts/answer/185833")

# Frontend URL for password reset links
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

ACCOUNT_EMAIL_VERIFICATION = "optional"   
ACCOUNT_EMAIL_REQUIRED = True          
ACCOUNT_CONFIRM_EMAIL_ON_GET = True        
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3 
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "http"

# Social account settings
SOCIALACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_EMAIL_REQUIRED = False
SOCIALACCOUNT_STORE_TOKENS = True
SOCIALACCOUNT_ADAPTER = "travelmate.adapter.CustomSocialAccountAdapter"

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "key": ""
        },
        "SCOPE": [
            "profile",
            "email",
            "openid",
        ],
        "AUTH_PARAMS": {"access_type": "online"},
        "VERIFIED_EMAIL": True,
    }
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'allauth': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'dj_rest_auth': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'travelmate': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
