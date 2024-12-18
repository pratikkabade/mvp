import pymongo
import logging
import os

app_logger = logging.getLogger("application_logger")

def check_dependencies():
    # Check MongoDB
    try:
        client = pymongo.MongoClient(os.getenv("MONGO_URL"), serverSelectionTimeoutMS=2000)
        client.server_info()  # Force connection on a request
    except Exception as e:
        app_logger.error("MongoDB is not running: " + str(e))
        raise RuntimeError("MongoDB is not running")

    # # Check OPA
    # opa_url = "http://localhost:8181/health"
    # try:
    #     response = requests.get(opa_url, timeout=2)  # Short timeout for a quick check
    #     if response.status_code == 200 and response.json().get("status") == "healthy":
    #         app_logger.info("OPA is running.")
    #     else:
    #         raise RuntimeError("OPA is not healthy: " + response.text)
    # except Exception as e:
    #     app_logger.error("OPA is not running: " + str(e))
    #     raise RuntimeError("OPA is not running")
