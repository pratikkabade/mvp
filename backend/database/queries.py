from pymongo import MongoClient
import os
from bson.objectid import ObjectId

# MongoDB Configuration
client = MongoClient(str(os.getenv("MONGO_ATLAS_URI")))
db = client[str(os.getenv("DB_NAME"))]

users_collection = db[str(os.getenv("COLLECTION_USER"))]
target_collection = db[str(os.getenv("COLLECTION_DATA"))]


def get_user_by_id(user_id):
    try:
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        res = users_collection.find_one({"_id": user_id})
        return res
    except Exception as e:
        return None

def get_user_by_username(username):
    try:
        res = users_collection.find_one({"username": username})
        return res
    except Exception as e:
        return str(e)

def get_user_credentials(username, password):
    try:
        res = users_collection.find_one({"username": username, "password": password})
        return res
    except Exception as e:
        return None

def get_content():
    try:
        data = list(target_collection.find({}, {"_id": 0}))
        return data
    except Exception as e:
        return None

def create_user(username, password):
    try:
        new_data = {"username": username, "password": password, "privileges": ["read", "login"]}
        users_collection.insert_one(new_data)
        return True
    except Exception as e:
        return e

def get_all_users():
    try:
        data = list(users_collection.find({}, {"_id": 0, "password": 0}))
        data = {user["username"]: user["privileges"] for user in data}
        return data
    except Exception as e:
        return None

def update_user(user_to_change, new_data):
    try:
        user = get_user_by_username(user_to_change)
        user_id = user.get("_id")
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        users_collection.update_one({"_id": user_id}, {"$set": new_data})
        return True
    except Exception as e:
        return e