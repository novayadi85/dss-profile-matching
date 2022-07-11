import { useEffect } from "react"

const ErrorLayout = ({ children, ...other }) => {
    useEffect(() => {
        document.body.classList.add('main');
        document.body.classList.remove('logij')
    }, [])
    return children
}

export default ErrorLayout