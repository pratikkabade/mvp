from flask import Blueprint
from flask import request, jsonify

from security.get_access import get_access
from database.queries import get_user_by_id, get_user_credentials, create_user, get_user_by_username

from config.log_config import info_logger, error_logger

# Initialize Flask Blueprint
login = Blueprint("login", __name__)


@login.route("/check_username", methods=["POST"])
def check_username_route():
    # Extract data from the request
    data = request.json
    username = data.get("username")

    if not username:
        error_logger.error("Missing username in the request")
        return jsonify({"message": "Username is required"}), 400

    user_exists = get_user_by_username(username)

    try:
        if user_exists:
            info_logger.info(f"Username '{username}' exists in the database")
            return jsonify({"exists": True}), 200
        else:
            info_logger.warning(f"Username '{username}' does not exist in the database")
            return jsonify({"exists": False}), 404

    except Exception as e:
        error_logger.error(f"An unexpected error occurred while checking username: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500


@login.route("/login", methods=["POST"])
def login_route():
    # Extract data from the request
    data = request.json
    username = data.get("username")
    password = data.get("password")

    try:
        if not username or not password:
            error_logger.error("Missing username or password in the request")
            return jsonify({"message": "Username and password are required"}), 400

        user = get_user_credentials(username, password)
        if not user:
            error_logger.warning(f"Login attempt failed for user: '{username}'")
            return jsonify({"message": "Invalid credentials"}), 401

        user_privileges = user.get("privileges", [])
        user_id = user.get("_id", [])

        get_access_response = get_access(user_id, "login")
        if get_access_response:
            info_logger.info(f"User '{username}' logged in successfully")
            return jsonify({"message": "Login successful", "user": {"username": username, "user_id": str(user_id), "privileges": user_privileges}}), 200
        else:
            error_logger.warning(f"Authorization failed for user: '{username}'")
            return jsonify({"message": "Unauthorized"}), 403

    except Exception as e:
        error_logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request"}), 500


@login.route("/check_privilege", methods=["POST"])
def check_privilege_route():
    # Extract data from the request
    data = request.json
    user_id = data.get("user_id")
    privilege = data.get("privilege")

    user = get_user_by_id(user_id)
    username = user.get("username", '')
    if not user:
        error_logger.error(f"User with ID '{username}' not found")
        return jsonify({"message": f"User with ID '{user_id}' not found"}), 403
    
    result = get_access(user_id, privilege)

    if result == True:
        info_logger.info(f"Username '{username}' used '{privilege}' privilege")
        return jsonify({"Access": True}), 200
    elif result == False:
        info_logger.warning(f"Username '{username}' tried to access '{privilege}' privilege")
        return jsonify({"message": f"User with ID '{user_id}' does not have '{privilege}' privilege"}), 403
    elif "message" in result:
        error_logger.error(f"User with ID '{username}' not found")
        return jsonify(result), 403
    elif "Error" in result:
        error_logger.error(f"Error while checking privilege: {result}")
        return jsonify(result), 403
    else:
        error_logger.error(f"Unknown error while checking privilege")
        return jsonify({"message": "Unknown error"}), 403


@login.route("/create_account", methods=["POST"])
def create_account_route():
    # Extract data from the request
    data = request.json
    username = data.get("username")
    password = data.get("password")

    try:
        # Validate input
        if not username or not password:
            error_logger.error("Missing username or password in the request")
            return jsonify({"message": "Username or Password is required"}), 400

        # Check if the user already exists
        status = get_user_by_username(username)

        if status is not None:
            error_logger.error(f"User '{username}' already exists")
            return jsonify({"message": "User already exists"}), 409  # Conflict error code

        # Attempt to create the user
        user_created = create_user(username, password)
        if user_created is True:
            info_logger.info(f"User '{username}' created successfully")
            return jsonify({"Created": True}), 201  # Created status code
        else:
            error_logger.error(f"Failed to create User '{username}' due to {user_created}")
            return jsonify({"Created": False, "error": str(user_created)}), 500

    except Exception as e:
        error_logger.error(f"An unexpected error occurred: {e}")
        return jsonify({"message": "Internal server error"}), 500

# curl -X POST http://localhost:5000/auth/create_account -H "Content-Type: application/json" -d '{"username": "admin1", "password": "admin1"}'
