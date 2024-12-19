package example.authz

default allow = false

allow {
    input.action == input.privileges[_]
}
