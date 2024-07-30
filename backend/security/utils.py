from flask import jsonify
from database.queries import get_user_by_username, get_user_credentials, create_user
from config.log_config import info_logger, error_logger
from security.get_access import get_access

def check_username(username, users_collection):
    try:
        if not username:
            error_logger.error("Missing username in the request")
            return jsonify({"message": "Username is required"}), 400

        user_exists = get_user_by_username(users_collection, username)

        if user_exists:
            info_logger.info(f"Username '{username}' exists in the database")
            return jsonify({"exists": True}), 200
        else:
            info_logger.warning(f"Username '{username}' does not exist in the database")
            return jsonify({"exists": False}), 404

    except Exception as e:
        error_logger.error(f"An unexpected error occurred while checking username: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500

def user_login(username, password, users_collection):
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

        get_access_response, _status_code = get_access(username, "login", user_privileges)
        if get_access_response.get_json().get("access"):
            info_logger.info(f"User '{username}' logged in successfully")
            return jsonify({"message": "Login successful", "user": {"username": username, "user_id": str(user_id), "privileges": user_privileges}}), 200
        else:
            error_logger.warning(f"Authorization failed for user: '{username}'")
            return jsonify({"message": "Unauthorized"}), 403

    except Exception as e:
        error_logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500

def create_user_on_db(users_collection, username, password):
    try:
        # Validate input
        if not username or not password:
            error_logger.error("Missing username or password in the request")
            return jsonify({"message": "Username or Password is required"}), 400

        # Check if the user already exists
        _, status = check_username(username, users_collection)

        if status != 404:
            error_logger.error(f"User '{username}' already exists")
            return jsonify({"message": "User already exists"}), 409  # Conflict error code

        # Attempt to create the user
        user_created = create_user(users_collection, username, password)
        if user_created is True:
            info_logger.info(f"User '{username}' created successfully")
            return jsonify({"Created": True}), 201  # Created status code
        else:
            error_logger.error(f"Failed to create User '{username}' due to {user_created}")
            return jsonify({"Created": False, "error": str(user_created)}), 500

    except Exception as e:
        error_logger.error(f"An unexpected error occurred: {e}")
        return jsonify({"message": "Internal server error"}), 500