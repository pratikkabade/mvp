package authz

default allow = false

allow {
    input.action == "login"
    input.privileges[_] == "read"
}
