import os
from django.core.wsgi import get_wsgi_application
from django.db import connection


def check_database_connection():
    try:
        connection.ensure_connection()
        print("Database connection successful!")
    except Exception as e:
        print("Database connection failed:", e)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project_name.settings")

check_database_connection()
application = get_wsgi_application()
