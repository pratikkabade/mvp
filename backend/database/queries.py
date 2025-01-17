from bson.objectid import ObjectId

def get_user_by_id(users_collection, user_id):
    try:
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        res = users_collection.find_one({"_id": user_id})
        return res
    except Exception as e:
        return None

def get_user_by_username(users_collection, username):
    try:
        res = users_collection.find_one({"username": username})
        return res
    except Exception as e:
        return str(e)

def get_user_credentials(users_collection, username, password):
    try:
        res = users_collection.find_one({"username": username, "password": password})
        return res
    except Exception as e:
        return None

def get_content(target_collection):
    try:
        data = list(target_collection.find({}, {"_id": 0}))
        return data
    except Exception as e:
        return None

def create_user(users_collection, username, password):
    try:
        new_data = {"username": username, "password": password, "privileges": ["read", "login"]}
        users_collection.insert_one(new_data)
        return True
    except Exception as e:
        return e

def get_all_users(users_collection):
    try:
        data = list(users_collection.find({}, {"_id": 0, "password": 0}))
        data = {user["username"]: user["privileges"] for user in data}
        return data
    except Exception as e:
        return None

def update_user(users_collection, user_to_change, new_data):
    try:
        user = get_user_by_username(users_collection, user_to_change)
        user_id = user.get("_id")
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        users_collection.update_one({"_id": user_id}, {"$set": new_data})
        return True
    except Exception as e:
        return e