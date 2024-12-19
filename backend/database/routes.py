from flask import Blueprint
from pymongo import MongoClient
from flask import request
import os

from database.fetch_data import fetch_data

# Initialize Flask Blueprint
get_data = Blueprint("get_data", __name__)

# MongoDB Configuration
client = MongoClient(str(os.getenv("MONGO_URL")))
db_user = client[str(os.getenv("DB_USER"))]
users_collection = db_user[str(os.getenv("COLLECTION_USER"))]

db_data = client[str(os.getenv("DB_DATA"))]
target_collection = db_data[str(os.getenv("COLLECTION_DATA"))]

# OPA Configuration
OPA_URL = os.getenv("OPA_URL")

@get_data.route("/test", methods=["GET"])
def get_test_data():
    # Extract data from the request
    data = request.json
    username = data.get("username")
    return fetch_data(username, users_collection, target_collection, OPA_URL)
