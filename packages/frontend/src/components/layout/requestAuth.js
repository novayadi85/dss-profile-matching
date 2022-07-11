import { useSelector } from "react-redux"
import { Navigate, useLocation } from 'react-router-dom'

const RequestAuth = ({ children }) => {
    const location = useLocation()
    const { isLogin } = useSelector(state => state.auth)
    if (!isLogin)
        return <Navigate to="/auth/sigin" state={{ from: location }} replace />
    return children
}

export default RequestAuth