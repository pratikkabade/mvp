from flask import Flask, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS

from routes.security import login
from routes.health_check import health_check
from routes.home import home_bp
from routes.db import get_data

from config.log_config import configure_loggers
from utils.dependencies import check_dependencies

load_dotenv()

# Flask app initialization
app = Flask(__name__)
CORS(app)

# Configure loggers
configure_loggers(app)

# Routes initialization
app.register_blueprint(home_bp, url_prefix='/')
app.register_blueprint(health_check, url_prefix='/health_check')
app.register_blueprint(login, url_prefix="/auth")
app.register_blueprint(get_data, url_prefix="/get_data")


# Main entry point
if __name__ == "__main__":
    try:
        check_dependencies()
        PORT = os.getenv("BACKEND_PORT")
        if PORT == '5000':
            print(f"Running on port: {PORT}")
            app.run(host='0.0.0.0', debug=True, port=PORT)
        else:
            print("Failed to start server. Please check the ENVIROMENT VARIABLES")
    except RuntimeError as e:
        print(f"Startup Error: {str(e)}")
