from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS

from routes.security import login
from routes.health_check import health_check
from routes.home import home_bp
from routes.db import get_data
from routes.content import get_content_data

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
# @home_bp.route('/', methods=['GET'])
# @home_bp.route('/logo', methods=['GET'])

app.register_blueprint(health_check, url_prefix='/health_check')
# @health_check.route("/", methods=["GET"])

app.register_blueprint(login, url_prefix="/auth")
# @login.route("/check_username", methods=["POST"])
# @login.route("/login", methods=["POST"])
# @login.route("/check_privilege", methods=["POST"])
# @login.route("/create_account", methods=["POST"])

app.register_blueprint(get_data, url_prefix="/get_data")
# @get_data.route("/test", methods=["POST"])
# @get_data.route("/all_users", methods=["POST"])
# @get_data.route("/update_privilege", methods=["POST"])

app.register_blueprint(get_content_data, url_prefix="/content")
# @get_content_data.route("/existence/<content_id>", methods=["GET"])
# @get_content_data.route("/create", methods=["POST"])
# @get_content_data.route("/delete/<content_id>", methods=["DELETE"])
# @get_content_data.route("/get/<user_id>", methods=["GET"])
# @get_content_data.route("/comment", methods=["POST"])
# @get_content_data.route("/like", methods=["POST"])
# @get_content_data.route("/view/<content_id>", methods=["GET"])
# @get_content_data.route("/delete_comment", methods=["DELETE"])


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
