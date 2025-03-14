from pymongo import MongoClient
import os
from bson.objectid import ObjectId

# MongoDB Configuration
client = MongoClient(str(os.getenv("MONGO_ATLAS_URI")))
db = client[str(os.getenv("DB_NAME"))]

users_collection = db[str(os.getenv("COLLECTION_USER"))]
target_collection = db[str(os.getenv("COLLECTION_DATA"))]
content_collection = db[str(os.getenv("COLLECTION_CONTENT"))]


# # MongoDB Configuration
uri = 'mongodb+srv://admin:admin@cluster0.cw6op.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
db = client['mvp']
users_collection = db['users']
target_collection = db['data']
content_collection = db['content']




# ----------------- USER-ACCESS -----------------

def get_user_by_id(user_id):
    try:
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        res = users_collection.find_one({"_id": user_id})
        return res
    except Exception as e:
        return None
# print(get_user_by_id("613b1b3b7b3b3b3b3b3b3b3b"))

def get_user_by_username(username):
    try:
        res = users_collection.find_one({"username": username})
        return res
    except Exception as e:
        return str(e)
# print(get_user_by_username("admin"))

def get_user_credentials(username, password):
    try:
        res = users_collection.find_one({"username": username, "password": password})
        return res
    except Exception as e:
        return None
# print(get_user_credentials("admin", "admin"))

def get_all_users():
    try:
        data = list(users_collection.find({}, {"_id": 0, "password": 0}))
        data = {user["username"]: user["privileges"] for user in data}
        return data
    except Exception as e:
        return None
# print(get_all_users())

def get_value_from_user(username, value):
    try:
        res = users_collection.find_one({"username": username}, {value: 1, "_id": 0})
        return res
    except Exception as e:
        return None
# print(get_value_from_user("admin", "first_name"))
# print(get_value_from_user("admin", "last_name"))




# ----------------- USER-MANAGEMENT -----------------

def create_user(username, password):
    try:
        new_data = {"username": username, "password": password, "privileges": ["read", "login"]}
        users_collection.insert_one(new_data)
        return True
    except Exception as e:
        return e
# print(create_user("admin2", "admin2"))

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
# print(update_user("admin", {'privileges': ['admin', 'create', 'read', 'update', 'delete', 'login']}))
# print(update_user("admin", {'first_name': 't45', 'last_name': 't45'}))

def delete_user(username):
    try:
        user = get_user_by_username(username)
        if user is None:
            return "User does not exist"
        user_id = user.get("_id")
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        users_collection.delete_one({"_id": user_id})
        return True
    except Exception as e:
        return e
# print(delete_user("admin2"))





# ----------------- DATA-MANAGEMENT -----------------

def get_content():
    try:
        data = list(target_collection.find({}, {"_id": 0}))
        return data
    except Exception as e:
        return None

def content_exists(content_id):
    content = content_collection.find_one({"_id": ObjectId(content_id)})
    if content:
        return True
    return False
# print(content_exists("679247d7534cb2be9ce79877"))

def create_new_content(content, created_by, created_at, privacy="public"):
    interaction = {
        "views": 0,
        "likes": 0,
        "comments": []
    }
    new_content = {
        "content": content,
        "created_by": created_by,
        "created_at": created_at,
        "privacy": privacy,
        "interaction": interaction
    }
    try:
        content_collection.insert_one(new_content)
        return True
    except Exception as e:
        return e
# print(create_new_content(
#     content="This is a test content",
#     created_by="admin",
#     created_at="2021-09-01",
#     privacy="private"))

def delete_created_content(username, content_id):
    try:
        content_collection.delete_one({"created_by": username, "_id": ObjectId(content_id)})
        return True
    except Exception as e:
        return e
# print(delete_created_content("admin", "679247d7534cb2be9ce79877"))

def get_created_content(username):
    try:
        public_data = list(content_collection.find({"privacy": "public"}))
        data = list(content_collection.find({"created_by": username, "privacy": "private"}))
        data.extend(public_data)
        # sort by created_at
        data.sort(key=lambda x: x["created_at"], reverse=True)
        return data
    except Exception as e:
        return None
# print(get_created_content("admin"))

def add_comment(commented_by, comment, commented_at, content_id):
    try:
        content = content_collection.find_one({"_id": ObjectId(content_id)})
        comments = content.get("interaction").get("comments")
        comments.append({
            "commented_by": commented_by,
            "comment": comment,
            "commented_at": commented_at
        })
        content_collection.update_one({"_id": ObjectId(content_id)}, {"$set": {"interaction.comments": comments}})
        return True
    except Exception as e:
        return e
# print(add_comment(
#     commented_by="admin", 
#     comment="Nice content", 
#     commented_at="2021-09-01", 
#     content_id="679247d7534cb2be9ce79877"))

def like_content(content_id):
    try:
        content = content_collection.find_one({"_id": ObjectId(content_id)})
        likes = content.get("interaction").get("likes")
        likes += 1
        content_collection.update_one({"_id": ObjectId(content_id)}, {"$set": {"interaction.likes": likes}})
        return True
    except Exception as e:
        return e
# print(like_content("679247d7534cb2be9ce79877"))

def view_content(content_id):
    try:
        content = content_collection.find_one({"_id": ObjectId(content_id)})
        views = content.get("interaction").get("views")
        views += 1
        content_collection.update_one({"_id": ObjectId(content_id)}, {"$set": {"interaction.views": views}})
        return True
    except Exception as e:
        return e
# print(view_content("679247d7534cb2be9ce79877"))

def delete_comment(commented_by, content_id, comment_to_delete):
    try:
        content = content_collection.find_one({"_id": ObjectId(content_id)})
        comments = content.get("interaction").get("comments")
        for comment in comments:
            if comment.get("comment") == comment_to_delete and comment.get("commented_by") == commented_by:
                comments.remove(comment)
                break
        content_collection.update_one({"_id": ObjectId(content_id)}, {"$set": {"interaction.comments": comments}})
        return True
    except Exception as e:
        return e
# print(delete_comment("admin", "679247d7534cb2be9ce79877", "Nice content"))

