 opa run --server backend/security/policy.rego

 mongod

 mongod --bind_ip 127.0.0.1 --port 27017 --dbpath /data/db --logpath ~/mongodb_logs/mongodb.log

 curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "password"}'
