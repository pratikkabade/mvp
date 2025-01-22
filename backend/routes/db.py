from flask import Blueprint
from flask import request, jsonify

from database.queries import get_all_users, get_user_by_username, get_user_by_id, get_content, update_user
from security.get_access import get_access

from config.log_config import info_logger, error_logger

# Initialize Flask Blueprint
get_data = Blueprint("get_data", __name__)

@get_data.route("/test", methods=["POST"])
def get_test_data():
    # Extract data from the request
    data = request.json
    username = data.get("username", None)
    user_id = data.get("user_id", None)

    if not username and not user_id:
        error_logger.error("Missing username or user_id in the request")
        return {"error": "Username or User ID is required"}, 400

    if user_id:
        user = get_user_by_id(user_id)
        if user:
            info_logger.info(f"User '{user_id}' found")
            username = user.get("username")
        else:
            error_logger.error(f"User with userid '{user_id}' not found")
            return {"error": f"User with userid '{user_id}' not found"}, 404

    if username:
        info_logger.info(f"User '{username}' requested test data")
        user = get_user_by_username(username)
        if user:
            info_logger.info(f"User '{username}' found")
            user_id = user.get("_id")
        else:
            error_logger.error(f"User with username '{username}' not found")
            return {"error": f"User with username '{username}' not found"}, 404


    try: 
        if get_access(user_id, 'read') == True:
            info_logger.warning(f"User '{username}' accessed all test data")
            data = get_content()
            return jsonify({"data": data}), 200
        else:
            error_logger.error(f"User '{username}' is unauthorized to access data")
            return jsonify({"message": "Unauthorized to access data"}), 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500




@get_data.route("/all_users", methods=["POST"])
def user_content_route():
    # Extract data from the request
    data = request.json
    username = data.get("username", None)
    user_id = data.get("user_id", None)

    if not username and not user_id:
        error_logger.error("Missing username or user_id in the request")
        return {"error": "Username or User ID is required"}, 400

    if user_id:
        user = get_user_by_id(user_id)
        if user:
            info_logger.info(f"User '{user_id}' found")
            username = user.get("username")
        else:
            error_logger.error(f"User with userid '{user_id}' not found")
            return {"error": f"User with userid '{user_id}' not found"}, 404

    if username:
        info_logger.info(f"User '{username}' requested all users")
        user = get_user_by_username(username)
        if user:
            info_logger.info(f"User '{username}' found")
            user_id = user.get("_id")
        else:
            error_logger.error(f"User with username '{username}' not found")
            return {"error": f"User with username '{username}' not found"}, 404
    

    try: 
        if get_access(user_id, 'read') == True:
            info_logger.warning(f"User '{username}' accessed all users")
            return get_all_users(), 200
        else:
            error_logger.error(f"User '{username}' tried to access all users")
            return {"error": f"User '{username}' does not have 'read' privilege"}, 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500

# curl -X POST http://localhost:5000/get_data/all_users -H "Content-Type: application/json" -d '{"user_id": "6788cd7d040d03463e05f4be"}'
# curl -X POST http://localhost:5000/get_data/all_users -H "Content-Type: application/json" -d '{"username": "admin"}'



@get_data.route("/update_privilege", methods=["POST"])
def update_privilege_route():
    # Extract data from the request
    data = request.json
    username = data.get("username", None)
    user_id = data.get("user_id", None)
    user_to_change = data.get("user_to_change", None)
    new_privileges = data.get("new_privileges", None)

    if not username and not user_id and not user_to_change:
        error_logger.error("Missing username or user_id in the request")
        return {"error": "Username or User ID is required"}, 400

    if user_id:
        user = get_user_by_id(user_id)
        if user:
            info_logger.info(f"User '{user_id}' found")
            username = user.get("username")
        else:
            error_logger.error(f"User with userid '{user_id}' not found")
            return {"error": f"User with userid '{user_id}' not found"}, 404

    if username:
        info_logger.info(f"User '{username}' requested privilege update")
        user = get_user_by_username(username)
        if user:
            info_logger.info(f"User '{username}' found")
            user_id = user.get("_id")
        else:
            error_logger.error(f"User with username '{username}' not found")
            return {"error": f"User with username '{username}' not found"}, 404

    try: 
        if get_access(user_id, 'update') == True:
            info_logger.warning(f"User '{username}' updated privileges")
            return jsonify({"message": update_user(user_to_change, new_privileges)}), 200
        else:
            error_logger.error(f"User '{username}' tried to update privileges")
            return {"error": f"User '{username}' does not have 'update' privilege"}, 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500

# curl -X POST http://localhost:5000/get_data/update_privilege -H "Content-Type: application/json" -d '{"user_id": "6788cd7d040d03463e05f4be", "user_to_change": "admin", "new_privileges": {"privileges": ["read", "login", "update", "delete"]}}'
# curl -X POST http://localhost:5000/get_data/update_privilege -H "Content-Type: application/json" -d '{"username": "admin", "user_to_change": "admin", "new_privileges": {"privileges": ["read", "login", "update", "delete"]}}'
