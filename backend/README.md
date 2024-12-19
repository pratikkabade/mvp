 opa run --server backend/security/policy.rego

 mongod

 mongod --bind_ip 127.0.0.1 --port 27017 --dbpath /data/db --logpath ~/mongodb_logs/mongodb.log

curl -X POST http://localhost:5000/auth/check_username -H "Content-Type: application/json" -d '{"username": "admin"}'

curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d '{"username": "admin", "password": "admin"}'

curl -X POST http://localhost:5000/auth/check_privilege      -H "Content-Type: application/json"      -d '{"username": "admin", "user_id": "676bd319fab70f833221d5d4", "privilege": "read"}'

curl -X GET http://localhost:5000/get_data/test -H "Content-Type: application/json" -d '{"username": "admin"}'


use user_database
db.createCollection("users")
db.users.insertOne({ "username": "admin", "password": "password", "privileges": ["read", "write"] })

db.users.find({ "username": "admin" }).pretty()
db.users.find()

# remove all data
db.users.remove({})


db.createCollection("test_data")
db.users.insertOne({ "username": "user", "password": "password", "privileges": ["write"] })



opa
curl -X POST http://localhost:8181/v1/data/example/authz/allow -H "Content-Type: application/json" -d '{"input": {"user": "admin","action": "read","privileges": ["read", "write"]}}'
