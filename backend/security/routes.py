from flask import Blueprint
from pymongo import MongoClient
from flask import request
import os

from security.utils import user_login, check_username, create_user_on_db
from security.privilege import has_privilege

# Initialize Flask Blueprint
login = Blueprint("login", __name__)

# MongoDB Configuration
client = MongoClient(str(os.getenv("MONGO_URL")))
db_user = client[str(os.getenv("DB_USER"))]
users_collection = db_user[str(os.getenv("COLLECTION_USER"))]


@login.route("/check_username", methods=["POST"])
def check_username_route():
    # Extract data from the request
    data = request.json
    username = data.get("username")

    return check_username(username, users_collection)

@login.route("/login", methods=["POST"])
def login_route():
    # Extract data from the request
    data = request.json
    username = data.get("username")
    password = data.get("password")

    return user_login(username, password, users_collection)

@login.route("/check_privilege", methods=["POST"])
def check_privilege():
    # Extract data from the request
    data = request.json
    user_id = data.get("user_id")
    privilege = data.get("privilege")

    return has_privilege(users_collection, user_id, privilege)

@login.route("/create_account", methods=["POST"])
def create_account():
    # Extract data from the request
    data = request.json
    username = data.get("username")
    password = data.get("password")

    return create_user_on_db(users_collection, username, password)
# curl -X POST http://localhost:5000/auth/create_account -H "Content-Type: application/json" -d '{"username": "admin1", "password": "admin1"}'
