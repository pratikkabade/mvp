from flask import jsonify
from database.queries import get_user_by_id
from config.log_config import info_logger, error_logger

def has_privilege(users_collection, username, privilege):
    try:
        user = get_user_by_id(users_collection, username)
        if not user:
            error_logger.error(f"User with ID '{username}' not found")
            return jsonify({"message": f"User with ID '{username}' not found"}), 403

        privileges = user.get("privileges", [])
        username = user.get("username", '')

        if privilege in privileges:
            info_logger.info(f"Username '{username}' used '{privilege}' privilege")
            return jsonify({"exists": True}), 200
        else:
            info_logger.warning(f"Username '{username}' used '{privilege}' privilege")
            return jsonify({"exists": False}), 404

    except Exception as e:
        error_logger.error(f"Error while checking privilege: {str(e)}")
        return jsonify({"message": f"Provided '{username}' is incorrect"}), 403
