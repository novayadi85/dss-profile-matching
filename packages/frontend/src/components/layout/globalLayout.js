import { useEffect } from "react"

const GlobalLayout = ({ children, ...other }) => {
    useEffect(() => {
        document.body.classList.add('login');
        document.body.classList.remove('main')
    }, [])
    return <div className="container sm:px-10" {...other}>{children}</div>
}

export default GlobalLayout