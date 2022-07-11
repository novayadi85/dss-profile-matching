import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { logout } from '@store/auth/action';

import GlobalLayout from '@components/layout/globalLayout';

const SignOut = () => {
    const dispatch = useDispatch()
    const { isLogin } = useSelector(state => state.auth)
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(logout())
    }, [])

    useEffect(() => {
        if (!isLogin)
            navigate("/auth/signin", { replace: true })
    }, [isLogin])

    return <GlobalLayout>
        {/*bisa di design ulang*/}
        <h3>Anda sudah keluar...</h3>
    </GlobalLayout>
}

export default SignOut