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

def insert_more_user_data(db, collection_name):
    db = client[db]
    collection = db[collection_name]

    test_data = [
        {"username": "test1", "password": "test1", "privileges": []},
        {"username": "test2", "password": "test2", "privileges": []},
        {"username": "test3", "password": "test3", "privileges": []},
        {"username": "test4", "password": "test4", "privileges": []},
        {"username": "test5", "password": "test5", "privileges": []},
        {"username": "test6", "password": "test6", "privileges": []},
        {"username": "test7", "password": "test7", "privileges": []},
        {"username": "test8", "password": "test8", "privileges": []},
        {"username": "test9", "password": "test9", "privileges": []},
        {"username": "test10", "password": "test10", "privileges": []},
        {"username": "test11", "password": "test11", "privileges": []},
        {"username": "test12", "password": "test12", "privileges": []},
        {"username": "test13", "password": "test13", "privileges": []},
        {"username": "test14", "password": "test14", "privileges": []},
        {"username": "test15", "password": "test15", "privileges": []},
        {"username": "test16", "password": "test16", "privileges": []},
        {"username": "test17", "password": "test17", "privileges": []},
        {"username": "test18", "password": "test18", "privileges": []},
        {"username": "test19", "password": "test19", "privileges": []},
        {"username": "test20", "password": "test20", "privileges": []},
        {"username": "test21", "password": "test21", "privileges": []},
        {"username": "test22", "password": "test22", "privileges": []},
        {"username": "test23", "password": "test23", "privileges": []},
        {"username": "test24", "password": "test24", "privileges": []},
        {"username": "test25", "password": "test25", "privileges": []},
        {"username": "test26", "password": "test26", "privileges": []},
        {"username": "test27", "password": "test27", "privileges": []},
        {"username": "test28", "password": "test28", "privileges": []},
        {"username": "test29", "password": "test29", "privileges": []},
        {"username": "test30", "password": "test30", "privileges": []},
        {"username": "test31", "password": "test31", "privileges": []},
        {"username": "test32", "password": "test32", "privileges": []},
        {"username": "test33", "password": "test33", "privileges": []},
        {"username": "test34", "password": "test34", "privileges": []},
        {"username": "test35", "password": "test35", "privileges": []},
        {"username": "test36", "password": "test36", "privileges": []},
        {"username": "test37", "password": "test37", "privileges": []},
        {"username": "test38", "password": "test38", "privileges": []},
        {"username": "test39", "password": "test39", "privileges": []},
        {"username": "test40", "password": "test40", "privileges": []},
        {"username": "test41", "password": "test41", "privileges": []},
        {"username": "test42", "password": "test42", "privileges": []},
        {"username": "test43", "password": "test43", "privileges": []},
        {"username": "test44", "password": "test44", "privileges": []},
        {"username": "test45", "password": "test45", "privileges": []},
        {"username": "test46", "password": "test46", "privileges": []},
        {"username": "test47", "password": "test47", "privileges": []},
        {"username": "test48", "password": "test48", "privileges": []},
        {"username": "test49", "password": "test49", "privileges": []},
        {"username": "test50", "password": "test50", "privileges": []},
    ]
    collection.insert_many(test_data)
    print("More User data inserted successfully")


def delete_data(db, collection_name):
    db = client[db]
    collection = db[collection_name]
    collection.delete_many({})
    print("Data deleted successfully")

# # Insert test data
# insert_test_data(_db, _test_db_collection)
# insert_user_data(_db, _user_db_collection)
# insert_more_user_data(_db, _user_db_collection)

# # Delete data from the collections
# delete_data(_db, _test_db_collection)
# delete_data(_db, _user_db_collection)

client.close()