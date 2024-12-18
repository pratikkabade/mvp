import requests
from flask import jsonify
from database.queries import get_user_by_username, get_user_credentials
from config.log_config import info_logger, error_logger

def check_username(username, users_collection):
    try:
        if not username:
            error_logger.error("Missing username in the request")
            return jsonify({"message": "Username is required"}), 400

        user_exists = get_user_by_username(users_collection, username) is not None

        if user_exists:
            info_logger.info(f"Username '{username}' exists in the database")
            return jsonify({"exists": True}), 200
        else:
            info_logger.warning(f"Username '{username}' does not exist in the database")
            return jsonify({"exists": False}), 404

    except Exception as e:
        error_logger.error(f"An unexpected error occurred while checking username: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500

def user_login(username, password, users_collection, OPA_URL):
    try:
        if not username or not password:
            error_logger.error("Missing username or password in the request")
            return jsonify({"message": "Username and password are required"}), 400

        user = get_user_credentials(users_collection, username, password)
        if not user:
            error_logger.warning(f"Login attempt failed for user: '{username}'")
            return jsonify({"message": "Invalid credentials"}), 401

        user_privileges = user.get("privileges", [])
        user_id = user.get("_id", [])
        opa_payload = {
            "input": {
                "user": username,
                "action": "login",
                "privileges": user_privileges
            }
        }

        response = requests.post(OPA_URL, json=opa_payload)
        if response.status_code == 200 and response.json().get("result", False):
            info_logger.warning(f"User '{username}' logged in successfully")
            return jsonify({"message": "Login successful", "user": {"username": username, "user_id": str(user_id), "privileges": user_privileges}}), 200
        else:
            error_logger.warning(f"Authorization failed for user: '{username}'")
            return jsonify({"message": "Unauthorized"}), 403

    except Exception as e:
        error_logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500
