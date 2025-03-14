// const BASEURL = 'https://mvp-jgkv.onrender.com'
const BASEURL = 'https://refactored-guide-q54755wwx435rv-5000.app.github.dev'

export const URL = BASEURL
export const HEALTH_CHECK_URL = `${BASEURL}/health_check/`
export const LOGO_URL = `${BASEURL}/logo`

// export const USER_CHECK_URL = (id: any) => `${BASEURL}/api/users/${id}`
export const USER_CHECK_URL = `${BASEURL}/auth/check_username`
export const USER_PASSWORD_URL = `${BASEURL}/auth/login`
export const PRIVILEGE_CHECK_URL = `${BASEURL}/auth/check_privilege`
export const CREATE_USER_URL = `${BASEURL}/auth/create_account`
export const DELETE_USER_URL = `${BASEURL}/auth/delete_account`
export const DUMMY_DATA_URL = `${BASEURL}/get_data/test`
export const ADMIN_USER_DATA_URL = `${BASEURL}/get_data/all_users`
export const ADMIN_USER_UPDATE_URL = `${BASEURL}/get_data/update_privilege`
export const GET_USER_VALUES_URL = (value: any) => `${BASEURL}/get_data/get_value/${value}`

export const GET_CONTENT_URL = (user_id: any) => `${BASEURL}/content/get/${user_id}`
export const VIEW_CONTENT_URL = (content_id: any) => `${BASEURL}/content/view/${content_id}`
export const DELETE_CONTENT_URL = (content_id: any) => `${BASEURL}/content/delete/${content_id}`
export const CREATE_CONTENT_URL = `${BASEURL}/content/create`
export const LIKE_CONTENT_URL = `${BASEURL}/content/like`
export const ADD_COMMENT_URL = `${BASEURL}/content/comment`
export const DELETE_COMMENT_URL = `${BASEURL}/content/delete_comment`
