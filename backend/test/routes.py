import requests
import json

def make_post_request(url, data):
    try:
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        # print(f"Error while making request to {url}: {e}")
        return None

def make_get_request(url, data):
    try:
        headers = {"Content-Type": "application/json"}
        response = requests.get(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        # print(f"Error while making request to {url}: {e}")
        return None


def check_username_1():
    base_url = "http://localhost:5000/auth/check_username"
    data = {"username": "admin"}

    expected_output = {'exists': True}

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"check_username_1": result})
        return "check_username_1"

def check_username_2():
    base_url = "http://localhost:5000/auth/check_username"
    data = {"username": "admin2"}

    expected_output = None
    
    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"check_username_2": result})
        return "check_username_2"

def login_1():
    base_url = "http://localhost:5000/auth/login"
    data = {"username": "admin", "password": "admin"}

    expected_output = {'message': 'Login successful', 'user': {'privileges': ['read', 'write', 'delete', 'login'], 'user_id': '676bd319fab70f833221d5d4', 'username': 'admin'}}

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"login_1": result})
        return "login_1"

def login_2():
    base_url = "http://localhost:5000/auth/login"
    data = {"username": "admin", "password": "admin1"}

    expected_output = None

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"login_2": result})
        return "login_2"

def login_3():
    base_url = "http://localhost:5000/auth/login"
    data = {"username": "admin2", "password": "password"}

    expected_output = None

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"login_3": result})
        return "login_3"

def check_privilege_1():
    base_url = "http://localhost:5000/auth/check_privilege"
    data = {"username": "admin", "user_id": "676bd319fab70f833221d5d4", "privilege": "read"}

    expected_output = {'exists': True}

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"check_privilege_1": result})
        return "check_privilege_1"

def check_privilege_2():
    base_url = "http://localhost:5000/auth/check_privilege"
    data = {"username": "admin", "user_id": "676b242fcdb9aea4d6567a2b", "privilege": "rea"}

    expected_output = None

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"check_privilege_2": result})
        return "check_privilege_2"

def check_privilege_3():
    base_url = "http://localhost:5000/auth/check_privilege"
    data = {"username": "admin", "user_id": "676b242fcdb9aea4d6567a2", "privilege": "read"}

    expected_output = None

    result = make_post_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"check_privilege_3": result})
        return "check_privilege_3"
    
# '{"username": "admin"}'
def get_data_1():
    base_url = "http://localhost:5000/get_data/test"
    data = {"username": "admin"}

    expected_output = {'data': [{'name': 'Alice', 'role': 'admin'}, {'name': 'Bob', 'role': 'editor'}, {'name': 'Charlie', 'role': 'viewer'}]}

    result = make_get_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"get_data_1": result})
        return "get_data_1"

def get_data_2():
    base_url = "http://localhost:5000/get_data/test"
    data = {"username": "admin2"}

    expected_output = None

    result = make_get_request(base_url, data)
    if result == expected_output:
        return True
    else:
        print({"get_data_2": result})
        return "get_data_2"


def validate_api_calls():
    functions = [check_username_1, check_username_2, login_1, login_2, login_3, check_privilege_1, check_privilege_2, check_privilege_3, get_data_1, get_data_2]
    for func in functions:
        result = func()
        if result is not True:
            return result
    return True

if __name__ == "__main__":
    validation_result = validate_api_calls()
    if validation_result is True:
        print("All API calls returned the expected results.")
    else:
        print(f"API call failed: {validation_result}")
