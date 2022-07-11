import { SET_LOGIN, LOGOUT } from "./type"

export const setLogin = (data = []) => ({ type: SET_LOGIN, payload: data })
export const logout = () => ({ type: LOGOUT })