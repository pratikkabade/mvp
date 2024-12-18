 opa run --server backend/security/policy.rego

 mongod

 mongod --bind_ip 127.0.0.1 --port 27017 --dbpath /data/db --logpath ~/mongodb_logs/mongodb.log

curl -X POST http://localhost:5000/auth/check_username -H "Content-Type: application/json" -d '{"username": "admin"}'

curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d '{"username": "admin", "password": "password"}'

curl -X POST http://localhost:5000/auth/check_privilege      -H "Content-Type: application/json"      -d '{"username": "admin", "user_id": "676b242fcdb9aea4d6567a2b", "privilege": "read"}'



use user_database
db.createCollection("users")
db.users.insertOne({ "username": "admin", "password": "password", "privileges": ["read", "write"] })

db.users.find({ "username": "admin" }).pretty()
db.users.find()

# remove all data
db.users.remove({})