import requests
from flask import jsonify
import os

def get_access(username, action, user_privileges):
    OPA_URL = os.getenv("OPA_URL")
    try:
        opa_payload = {
            "input": {
                "user": username,
                "action": action,
                "privileges": user_privileges
            }
        }

        response = requests.post(OPA_URL, json=opa_payload)
        if response.status_code == 200 and response.json().get("result", False):
            return jsonify({"access": True}), 200
        else:
            return jsonify({"access": False}), 403

    except Exception as e:
        return jsonify({"message": "An error occurred while processing your request"}), 500