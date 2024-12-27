import logging
from flask import request
import os

# Determine the base directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOP_LEVEL_DIR = os.path.basename(os.path.dirname(BASE_DIR))
LOG_DIR = os.path.join(TOP_LEVEL_DIR, "logs")
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

# Configure loggers
def configure_loggers(app):
    # Access log
    access_logger = logging.getLogger("access_logger")
    access_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "access_log.log"))
    access_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    access_logger.addHandler(access_file_handler)
    access_logger.setLevel(logging.INFO)

    # HTTP request log
    http_logger = logging.getLogger("http_logger")
    http_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "http_requests.log"))
    http_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    http_logger.addHandler(http_file_handler)
    http_logger.setLevel(logging.INFO)

    # Application error log
    app_logger = logging.getLogger("application_logger")
    error_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "application_error.log"))
    error_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
    app_logger.addHandler(error_file_handler)
    app_logger.setLevel(logging.ERROR)

    # Suppress terminal logs from Flask and Werkzeug
    logging.getLogger("werkzeug").setLevel(logging.ERROR)

    # Middleware to log access and HTTP requests
    @app.before_request
    def log_request_info():
        http_logger.info(f"{request.method} {request.url}")
        user = None
        if request.is_json:
            data = request.get_json(silent=True)
            if data and "username" in data:
                user = data["username"]
        
        user = user or "Unknown User"
        access_logger.info(f"User: '{user}' accessed '{request.path}' path")

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(e):
        app_logger.error(f"404 Error: {str(e)}")
        return {"message": "Resource not found"}, 404

    @app.errorhandler(500)
    def internal_error(e):
        app_logger.error(f"500 Internal Server Error: {str(e)}")
        return {"message": "Internal Server Error"}, 500


# Initialize logging
error_logger = logging.getLogger("error_logger")
error_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "application_error.log"))
error_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
error_logger.addHandler(error_file_handler)

info_logger = logging.getLogger("info_logger")
info_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "access_log.log"))
info_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
info_logger.addHandler(info_file_handler)