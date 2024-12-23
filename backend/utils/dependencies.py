import pymongo
import logging

app_logger = logging.getLogger("application_logger")

def check_dependencies():
    # Check MongoDB
    try:
        client = pymongo.MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
        client.server_info()  # Force connection on a request
    except Exception as e:
        app_logger.error("MongoDB is not running: " + str(e))
        raise RuntimeError("MongoDB is not running")
