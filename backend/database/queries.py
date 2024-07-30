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
        return None

def get_user_credentials(users_collection, username, password):
    try:
        res = users_collection.find_one({"username": username, "password": password})
        return res
    except Exception as e:
        return None

def get_data(target_collection):
    try:
        data = list(target_collection.find({}, {"_id": 0}))
        return data
    except Exception as e:
        return None

def create_user(users_collection, user_id, password):
    try:
        new_data = {"username": user_id, "password": password, "privileges": ["read", "login"]}
        users_collection.insert_one(new_data)
        return True
    except Exception as e:
        return e