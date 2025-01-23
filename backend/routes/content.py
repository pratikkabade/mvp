from flask import Blueprint
from flask import request, jsonify
import datetime

from database.queries import content_exists, create_new_content, delete_created_content, get_created_content, add_comment, like_content, view_content, delete_comment, get_user_by_id
from security.get_access import get_access

from config.log_config import info_logger, error_logger

# Initialize Flask Blueprint
get_content_data = Blueprint("get_content_data", __name__)

@get_content_data.route("/existence/<content_id>", methods=["GET"])
def existence(content_id):
    try:
        existence = content_exists(content_id)
        if existence:
            info_logger.info(f"Content '{content_id}' exists")
            return {"message": "Content exists"}, 200
        else:
            error_logger.error(f"Content '{content_id}' does not exist")
            return {"message": "Content does not exist"}, 404
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X GET http://localhost:5000/content/existence/6792577b40db2f35cbfa581d

@get_content_data.route("/create", methods=["POST"])
def create():
    try:
        data = request.json
        user_id = data.get("user_id")
        created_at = datetime.datetime.now().strftime("%Y-%m-%d")
        content = data.get("content")
        privacy = data.get("privacy")
        if not user_id or not content:
            error_logger.error("Missing required fields in the request")
            return {"error": "Missing required fields in the request"}, 400
        
        user = get_user_by_id(user_id)
        if not user:
            error_logger.error(f"User '{user_id}' not found")
            return {"message": "User not found"}, 404
        created_by = user.get("username")
        
        if get_access(user_id, 'create') == True:
            created = create_new_content(content, created_by, created_at, privacy)
            if created == True:
                error_logger.error(f"Failed to create content")
                return {"message": "Failed to create content"}, 500
            info_logger.info(f"User '{created_by}' created new content")
            return {"message": "Content created successfully"}, 200
        else:
            error_logger.error(f"User '{created_by}' is unauthorized to create content")
            return jsonify({"message": "Unauthorized to create content"}), 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X POST http://localhost:5000/content/create -H "Content-Type: application/json" -d '{"user_id": "678f7f7da62848010c4f5ec1", "content": "This is a test content", "privacy": "private"}'


@get_content_data.route("/delete/<content_id>", methods=["DELETE"])
def delete(content_id):
    try:
        data = request.json
        user_id = data.get("user_id")
        if not user_id:
            error_logger.error("Missing required fields in the request")
            return {"error": "Missing required fields in the request"}, 400
        
        if get_access(user_id, 'delete') == True:
            user = get_user_by_id(user_id)
            if not user:
                error_logger.error(f"User '{user_id}' not found")
                return {"message": "User not found"}, 404
            if not content_exists(content_id):
                error_logger.error(f"Content '{content_id}' not found")
                return {"message": "Content not found"}, 404
            username = user.get("username")
            delete_created_content(username, content_id)
            info_logger.info(f"User '{user_id}' deleted content '{content_id}'")
            return {"message": "Content deleted successfully"}, 200
        else:
            error_logger.error(f"User '{user_id}' is unauthorized to delete content")
            return jsonify({"message": "Unauthorized to delete content"}), 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X DELETE http://localhost:5000/content/delete/6792577b40db2f35cbfa581d -H "Content-Type: application/json" -d '{"user_id": "678f7f7da62848010c4f5ec1"}'

@get_content_data.route("/get/<user_id>", methods=["GET"])
def get(user_id):
    try:
        user = get_user_by_id(user_id)
        if not user:
            error_logger.error(f"User '{user_id}' not found")
            return {"message": "User not found"}, 404
        username = user.get("username")
        content = get_created_content(username)
        info_logger.info(f"User '{username}' fetched content")
        content = [{**item, '_id': str(item['_id'])} for item in content]
        return jsonify({"data": content}), 200
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X GET http://localhost:5000/content/get/678f7f7da62848010c4f5ec1

@get_content_data.route("/comment", methods=["POST"])
def comment():
    try:
        data = request.json
        user_id = data.get("user_id")
        content_id = data.get("content_id")
        comment = data.get("comment")
        commented_at = datetime.datetime.now().strftime("%Y-%m-%d")
        if not user_id or not content_id or not comment:
            error_logger.error("Missing required fields in the request")
            return {"error": "Missing required fields in the request"}, 400
        
        user = get_user_by_id(user_id)
        if not user:
            error_logger.error(f"User '{user_id}' not found")
            return {"message": "User not found"}, 404
        username = user.get("username")
        
        if get_access(user_id, 'read') == True:
            added = add_comment(username, comment, commented_at, content_id)
            if added == True:
                info_logger.info(f"User '{username}' added comment to content '{content_id}'")
                return {"message": "Comment added successfully"}, 200
            error_logger.error(f"Failed to add comment")
            return {"message": "Failed to add comment"}, 500
        else:
            error_logger.error(f"User '{username}' is unauthorized to add comment")
            return jsonify({"message": "Unauthorized to add comment"}), 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X POST http://localhost:5000/content/comment -H "Content-Type: application/json" -d '{"user_id": "678f7f7da62848010c4f5ec1", "content_id": "6792577b40db2f35cbfa581d", "comment": "This is a test comment"}'

@get_content_data.route("/like", methods=["POST"])
def like():
    try:
        data = request.json
        user_id = data.get("user_id")
        content_id = data.get("content_id")
        if not user_id or not content_id:
            error_logger.error("Missing required fields in the request")
            return {"error": "Missing required fields in the request"}, 400
        
        user = get_user_by_id(user_id)
        if not user:
            error_logger.error(f"User '{user_id}' not found")
            return {"message": "User not found"}, 404
        username = user.get("username")
        
        if get_access(user_id, 'read') == True:
            liked = like_content(content_id)
            if liked == True:
                info_logger.info(f"User '{username}' liked content '{content_id}'")
                return {"message": "Content liked successfully"}, 200
            error_logger.error(f"Failed to like content")
            return {"message": "Failed to like content"}, 500
        else:
            error_logger.error(f"User '{username}' is unauthorized to like content")
            return jsonify({"message": "Unauthorized to like content"}), 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X POST http://localhost:5000/content/like -H "Content-Type: application/json" -d '{"user_id": "678f7f7da62848010c4f5ec1", "content_id": "6792577b40db2f35cbfa581d"}'

@get_content_data.route("/view/<content_id>", methods=["GET"])
def view(content_id):
    try:
        viewed = view_content(content_id)
        if viewed == True:
            info_logger.info(f"Content '{content_id}' viewed")
            return {"message": "Content viewed successfully"}, 200
        error_logger.error(f"Failed to view content")
        return {"message": "Failed to view content"}, 500
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X GET http://localhost:5000/content/view/6792577b40db2f35cbfa581d

@get_content_data.route("/delete_comment", methods=["DELETE"])
def _delete_comment():
    try:
        data = request.json
        user_id = data.get("user_id")
        content_id = data.get("content_id")
        comment_to_delete = data.get("comment_to_delete")
        if not user_id or not content_id or not comment_to_delete:
            error_logger.error("Missing required fields in the request")
            return {"error": "Missing required fields in the request"}, 400
        
        user = get_user_by_id(user_id)
        if not user:
            error_logger.error(f"User '{user_id}' not found")
            return {"message": "User not found"}, 404
        username = user.get("username")
        
        if get_access(user_id, 'delete') == True:
            deleted = delete_comment(username, content_id, comment_to_delete)
            if deleted == True:
                info_logger.info(f"User '{username}' deleted comment '{comment_to_delete}' from content '{content_id}'")
                return {"message": "Comment deleted successfully"}, 200
            error_logger.error(f"Failed to delete comment")
            return {"message": "Failed to delete comment"}, 500
        else:
            error_logger.error(f"User '{username}' is unauthorized to delete comment")
            return jsonify({"message": "Unauthorized to delete comment"}), 403
    except Exception as e:
        error_logger.error(f"Error: {str(e)}")
        return {"error": f"Error: {str(e)}"}, 500
# curl -X DELETE http://localhost:5000/content/delete_comment -H "Content-Type: application/json" -d '{"user_id": "678f7f7da62848010c4f5ec1", "content_id": "6792577b40db2f35cbfa581d", "comment_to_delete": "This is a test comments"}'
