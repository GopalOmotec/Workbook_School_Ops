import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
    MYSQL_USER = os.environ.get("MYSQL_USER", "appuser")
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "StrongPassword123")
    MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "workbook")
    MYSQL_PORT = int(os.environ.get("MYSQL_PORT", 3306))
    SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")