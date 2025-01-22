from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
client = MongoClient(str(os.getenv("MONGO_ATLAS_URI")))

_db = str(os.getenv("DB_NAME"))

_test_db_collection = str(os.getenv("COLLECTION_DATA"))
_user_db_collection = str(os.getenv("COLLECTION_USER"))


def insert_test_data(db, test_db_collection):
    db = client[db]
    collection = db[test_db_collection]

    test_data = [
        {"_id": 1, "name": "Alice", "role": "admin"},
        {"_id": 2, "name": "Bob", "role": "editor"},
        {"_id": 3, "name": "Charlie", "role": "viewer"},
    ]
    collection.insert_many(test_data)
    print("Test data inserted successfully")

def insert_user_data(db, collection_name):
    db = client[db]
    collection = db[collection_name]

    test_data = [
        {"username": "admin", "password": "admin", "privileges": ["admin", "create", "read", "update", "delete", "login"]},
        {"username": "editor", "password": "editor", "privileges": ["create", "read", "login"]},
        {"username": "viewer", "password": "viewer", "privileges": ["read", "login"]},
        {"username": "user", "password": "user", "privileges": ["login"]},
        {"username": "test", "password": "test", "privileges": []},
    ]
    collection.insert_many(test_data)
    print("User data inserted successfully")

def delete_data(db, collection_name):
    db = client[db]
    collection = db[collection_name]
    collection.delete_many({})
    print("Data deleted successfully")

# # Insert test data
# insert_test_data(_db, _test_db_collection)
# insert_user_data(_db, _user_db_collection)

# # Delete data from the collections
# delete_data(_db, _test_db_collection)
# delete_data(_db, _user_db_collection)

client.close()