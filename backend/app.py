from flask import Flask, request
from security.security import login
from config.log_config import configure_loggers
from utils.dependencies import check_dependencies
import logging

# Configure loggers
configure_loggers()

# Flask app initialization
app = Flask(__name__)
app.register_blueprint(login, url_prefix="/auth")

# Get loggers
access_logger = logging.getLogger("access_logger")
http_logger = logging.getLogger("http_logger")
app_logger = logging.getLogger("application_logger")

# Middleware to log access and HTTP requests
@app.before_request
def log_request_info():
    http_logger.info(f"{request.method} {request.url}")
    user = request.json.get("username") or "Unknown User"
    access_logger.info(f"User: {user} accessed {request.path}")

# Error handlers
@app.errorhandler(404)
def not_found_error(e):
    app_logger.error(f"404 Error: {str(e)}")
    return {"message": "Resource not found"}, 404

@app.errorhandler(500)
def internal_error(e):
    app_logger.error(f"500 Internal Server Error: {str(e)}")
    return {"message": "Internal Server Error"}, 500

# Main entry point
if __name__ == "__main__":
    try:
        check_dependencies()
        app.run(debug=True)
    except RuntimeError as e:
        print(f"Startup Error: {str(e)}")
