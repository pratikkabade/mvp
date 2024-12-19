from flask import Flask
from dotenv import load_dotenv
import os

from security.routes import login
from database.routes import get_data
from config.log_config import configure_loggers
from utils.dependencies import check_dependencies

load_dotenv()

# Flask app initialization
app = Flask(__name__)

# Configure loggers
configure_loggers(app)

# Routes initialization
app.register_blueprint(login, url_prefix="/auth")
app.register_blueprint(get_data, url_prefix="/get_data")

# Main entry point
if __name__ == "__main__":
    try:
        check_dependencies()
        PORT = os.getenv("BACKEND_PORT", 4000)
        print(f"Running on port: {PORT}")
        app.run(debug=True, port=PORT)
    except RuntimeError as e:
        print(f"Startup Error: {str(e)}")
