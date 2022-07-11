import { combineReducers } from "redux";

import countReducer from "./count/reducer"
import authReducer from "./auth/reducer";

const rootReducer = combineReducers({
    count: countReducer,
    auth: authReducer
})
export default rootReducer