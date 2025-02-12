from flask import Blueprint, jsonify
from config.log_config import info_logger

health_check = Blueprint("health_check", __name__)

@health_check.route("/", methods=["GET"])
def home():
    info_logger.info(f"Health checkup completed successfully")
    return jsonify({"message": "Service is up and running!"}), 200
