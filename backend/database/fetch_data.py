import requests
from flask import jsonify

from database.queries import get_user_by_username, get_data

def fetch_data(username, users_collection, target_collection, OPA_URL):
    try:
        # Fetch user details
        user = get_user_by_username(users_collection, username)
        if not user:
            return jsonify({"message": "User not found"}), 404

        user_privileges = user.get("privileges", [])
        opa_payload = {
            "input": {
                "user": username,
                "action": "read",
                "privileges": user_privileges
            }
        }

        # Check authorization with OPA
        response = requests.post(OPA_URL, json=opa_payload)

        if response.status_code == 200 and response.json().get("result", False):
            # If authorized, fetch the data
            data = get_data(target_collection)
            return jsonify({"data": data}), 200
        else:
            return jsonify({"message": "Unauthorized to access data"}), 403

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


# app = Flask(__name__)
# # MongoDB Configuration
# client = MongoClient(str(os.getenv("MONGO_URL")))
# db_user = client[str(os.getenv("DB_USER"))]
# users_collection = db_user[str(os.getenv("COLLECTION_USER"))]

# db_data = client[str(os.getenv("DB_DATA"))]
# target_collection = db_data[str(os.getenv("COLLECTION_DATA"))]

# # Wrapping the call in Flask's app context
# with app.app_context():
#     result, status_code = fetch_data("test", users_collection, target_collection, os.getenv("OPA_URL"))
#     print(result.json)
#     client.close()
