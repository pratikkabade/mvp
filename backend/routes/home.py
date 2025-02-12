from flask import Blueprint, jsonify, send_file
from config.log_config import info_logger

# Define Blueprint
home_bp = Blueprint('home', __name__)

@home_bp.route('/', methods=['GET'])
def home():
    info_logger.info(f"Home route hit successfully")
    return jsonify({"Message":"Welcome to MVP"}), 200

@home_bp.route('/logo', methods=['GET'])
def get_logo():
    file_path = 'assets/logo.png'
    try:
        info_logger.info('Serving logo')
        return send_file(file_path, mimetype='image/png'), 200
    except Exception as e:
        info_logger.info(f'Error serving logo: {e}')
        return jsonify({'error': str(e)}), 500