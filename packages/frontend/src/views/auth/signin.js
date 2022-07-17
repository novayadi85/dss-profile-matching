import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AUTH_MUTATION } from '@gql/users'
import { setLogin } from '@store/auth/action'
import { site } from '@config';
import GlobalLayout from '@components/layout/globalLayout';
import logo from '@assets/images/logo.png';
import Illustration from '@assets/images/illustration.svg'

const Signin = () => {
    const dispatch = useDispatch()
    const { isLogin } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [loginMutation, loginResponse] = useMutation(AUTH_MUTATION)
    const [formData, setFormData] = useState()

    const handlingLogin = async (e) => {
        e.preventDefault()
        console.log({ formData });
        try {
            const { data } = await loginMutation({
                variables: formData
            })
            console.log({ respon: data });
            const { authenticate } = data
            if(authenticate.jwt !== null) dispatch(setLogin(data.authenticate))
            else throw('Error!!!')
        } catch (error) {
            console.log({ loginerror: error });
        }
    }

    useEffect(() => {
        if (isLogin) {
            navigate("/", { replace: true })
        }
    }, [isLogin, navigate])

    return <GlobalLayout>
        <div className="block xl:grid grid-cols-2 gap-4">
            {/* <!-- BEGIN: Login Info --> */}
            <div className="hidden xl:flex flex-col min-h-screen">
                <a href="#" className="-intro-x flex items-center pt-5">
                    <img alt="Rubick Tailwind HTML Admin Template" className="w-6" src={logo} />
                    <span className="text-white text-lg ml-3"> { site.name } </span>
                </a>
                <div className="my-auto">
                    <img alt="Rubick Tailwind HTML Admin Template" className="-intro-x w-1/2 -mt-16" src={Illustration} />
                    <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                        A few more clicks to
                        <br />
                        sign in to your account.
                    </div>
                    <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-gray-500"></div>
                </div>
            </div>
            {/* <!-- END: Login Info --> */}
            {/* <!-- BEGIN: Login Form --> */}
            <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                    <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                        Sign In
                    </h2>
                    
                    <form action="#" onSubmit={handlingLogin}>
                        <div className="intro-x mt-8">
                            <input
                                type="email"
                                className="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                                placeholder="Email"
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                            <input
                                type="password"
                                className="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4"
                                placeholder="Password"
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            />
                        </div>

                        <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                            <button className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" type='submit'>Login</button>
                            
                        </div>
                        
                    </form>
                    
                </div>
            </div>
            {/* <!-- END: Login Form --> */}
        </div>
    </GlobalLayout>
}

export default Signin