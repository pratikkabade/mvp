import os
import logging
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import requests

# Determine the base directory for logging
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOP_LEVEL_DIR = os.path.basename(os.path.dirname(BASE_DIR))
LOG_DIR = os.path.join(TOP_LEVEL_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

# Initialize logging
error_logger = logging.getLogger("error_logger")
error_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "application_error.log"))
error_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
error_logger.addHandler(error_file_handler)
# error_logger.setLevel(logging.ERROR)

info_logger = logging.getLogger("info_logger")
info_file_handler = logging.FileHandler(os.path.join(LOG_DIR, "access_log.log"))
info_file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
info_logger.addHandler(info_file_handler)
# info_logger.setLevel(logging.INFO)

# MongoDB Configuration
client = MongoClient("mongodb://localhost:27017/")
db = client["user_database"]
users_collection = db["users"]

# OPA Configuration
OPA_URL = "http://localhost:8181/v1/data/authz/allow"

# Initialize Flask Blueprint
login = Blueprint("login", __name__)

@login.route("/login", methods=["POST"])
def user_login():
    try:
        # Extract username and password from the request
        data = request.json
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            error_logger.error("Missing username or password in the request")
            return jsonify({"message": "Username and password are required"}), 400

        # Check MongoDB for user credentials
        user = users_collection.find_one({"username": username, "password": password})
        if not user:
            error_logger.warning(f"Login attempt failed for user: {username}")
            return jsonify({"message": "Invalid credentials"}), 401

        # Prepare OPA payload
        user_privileges = user.get("privileges", [])
        opa_payload = {
            "input": {
                "user": username,
                "action": "login",
                "privileges": user_privileges
            }
        }

        # Call OPA for authorization
        response = requests.post(OPA_URL, json=opa_payload)
        if response.status_code == 200 and response.json().get("result", False):
            info_logger.warning(f"User {username} logged in successfully")
            return jsonify({"message": "Login successful", "user": {"username": username, "privileges": user_privileges}}), 200
        else:
            error_logger.warning(f"Authorization failed for user: {username}")
            return jsonify({"message": "Unauthorized"}), 403

    except Exception as e:
        error_logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500