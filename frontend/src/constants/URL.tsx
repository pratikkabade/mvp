const BASEURL = 'http://localhost:5000'

export const URL = BASEURL
export const LOGO_URL = BASEURL + '/logo'

export const USER_CHECK_URL = (id: any) => `${BASEURL}/api/users/${id}`
export const USER_PASSWORD_URL = `${BASEURL}/api/users/login`
