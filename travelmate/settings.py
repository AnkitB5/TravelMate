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
DEBUG      = os.getenv("DEBUG", "False").lower() in ("true", "1")
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
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

# ─── django-allauth ──────────────────────────────────────────────────────────
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

EMAIL_BACKEND    = os.getenv("DJANGO_EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST       = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT       = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS    = True
EMAIL_HOST_USER  = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL  = EMAIL_HOST_USER

ACCOUNT_EMAIL_VERIFICATION = "mandatory"   
ACCOUNT_EMAIL_REQUIRED     = True          
ACCOUNT_CONFIRM_EMAIL_ON_GET = True        
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3 
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"    

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id":     os.getenv("GOOGLE_CLIENT_ID"),
            "secret":        os.getenv("GOOGLE_CLIENT_SECRET"),
            "key":           ""
        },
        "SCOPE":       ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "offline"},
    }
}
