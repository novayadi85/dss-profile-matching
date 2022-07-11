import { SET_LOGIN, LOGOUT } from "./type"

const initialState = {
    isLogin: false,
    token: null,
    user: null,
    refreshToken: null
}

const authReducer = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case SET_LOGIN:
            console.log({ payload });
            return {
                ...state,
                isLogin: true,
                token:  payload?.jwt ?? null
                //token: payload?.token?.AccessToken ?? null,
                //refreshToken: payload?.token?.RefreshToken ?? null,
                // Just For Dev
                // user: payload?.user ?? null,
            }
        case LOGOUT:
            console.log("ok");
            return { ...initialState }
        default:
            return state
    }
}

export default authReducer