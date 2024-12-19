from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def insert_test_data(test_db_name, test_db_collection, mongo_uri):
    client = MongoClient(mongo_uri)
    db = client[test_db_name]
    collection = db[test_db_collection]

    test_data = [
        {"_id": 1, "name": "Alice", "role": "admin"},
        {"_id": 2, "name": "Bob", "role": "editor"},
        {"_id": 3, "name": "Charlie", "role": "viewer"},
    ]
    collection.insert_many(test_data)
    print("Test data inserted successfully")
    client.close()

def insert_user_data(database_name, collection_name, mongo_uri):
    client = MongoClient(mongo_uri)
    db = client[database_name]
    collection = db[collection_name]

    test_data = [
        {"username": "admin", "password": "admin", "privileges": ["read", "write", "delete", "login"]},
        {"username": "editor", "password": "editor", "privileges": ["read", "write", "login"]},
        {"username": "viewer", "password": "viewer", "privileges": ["read", "login"]},
        {"username": "user", "password": "user", "privileges": ["login"]},
        {"username": "test", "password": "test", "privileges": []},
    ]
    collection.insert_many(test_data)
    print("User data inserted successfully")
    client.close()

def delete_data(database_name, collection_name, mongo_uri):
    client = MongoClient(mongo_uri)
    db = client[database_name]
    collection = db[collection_name]
    collection.delete_many({})
    print("Data deleted successfully")
    client.close()

# MongoDB Configuration
mongouri = str(os.getenv("MONGO_URL"))
test_db_name = str(os.getenv("DB_DATA"))
test_db_collection = str(os.getenv("COLLECTION_DATA"))

user_db_name = str(os.getenv("DB_USER"))
user_db_collection = str(os.getenv("COLLECTION_USER"))

# # Insert test data
# insert_test_data(test_db_name, test_db_collection, mongouri)
# insert_user_data(user_db_name, user_db_collection, mongouri)

# # Delete data from the collections
# delete_data(test_db_name, test_db_collection, mongouri)
# delete_data(user_db_name, user_db_collection, mongouri)
