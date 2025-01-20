import requests
import os

from database.queries import get_user_by_id

def get_access(user_id, action):
    user = get_user_by_id(user_id)
    if not user:
        return {"message": f"User with ID '{user_id}' not found"}

    privileges = user.get("privileges", [])
    username = user.get("username", "")

    OPA_URL = os.getenv("OPA_URL")
    try:
        opa_payload = {
            "input": {
                "user": username,
                "action": action,
                "privileges": privileges
            }
        }

        response = requests.post(OPA_URL, json=opa_payload)
        if response.status_code == 200 and response.json().get("result", False):
            return True
        else:
            return False

    except Exception as e:
        return {"message": "An error occurred while processing your request: " + str(e)}