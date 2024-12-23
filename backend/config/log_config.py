import logging
import os

# Determine the base directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOP_LEVEL_DIR = os.path.basename(os.path.dirname(BASE_DIR))
LOG_DIR = os.path.join(TOP_LEVEL_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

# Configure loggers
def configure_loggers():
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
