const BASEURL = 'https://expert-space-enigma-rqrvrw4v5px3xrx4-5000.app.github.dev'

export const URL = BASEURL
export const HEALTH_CHECK_URL = `${BASEURL}/health_check/`
export const LOGO_URL = `${BASEURL}/logo`

// export const USER_CHECK_URL = (id: any) => `${BASEURL}/api/users/${id}`
export const USER_CHECK_URL =`${BASEURL}/auth/check_username`
export const USER_PASSWORD_URL = `${BASEURL}/auth/login`
export const PRIVILEGE_CHECK_URL = `${BASEURL}/auth/check_privilege`
export const DUMMY_DATA_URL = `${BASEURL}/get_data/test`
