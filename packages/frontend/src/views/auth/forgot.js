import { Link } from "react-router-dom";
import { X, CheckCircle } from 'react-feather'
import { TailSpin } from 'react-loader-spinner'

import GlobalLayout from "@components/layout/globalLayout";

import Logo from "@assets/images/logo.svg";
import Illustration from "@assets/images/illustration.svg";

const Forgot = () => {

    return (
        <GlobalLayout>
            <div className="block xl:grid grid-cols-2 gap-4">
                {/* <!-- BEGIN: Login Info --> */}
                <div className="hidden xl:flex flex-col min-h-screen">
                    <a href="#" className="-intro-x flex items-center pt-5">
                        <img alt="Rubick Tailwind HTML Admin Template" className="w-6" src={Logo} />
                        <span className="text-white text-lg ml-3"> PMS<span className="font-medium">INTA</span> </span>
                    </a>
                    <div className="my-auto">
                        <img alt="Rubick Tailwind HTML Admin Template" className="-intro-x w-1/2 -mt-16" src={Illustration} />
                        <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                            A few more clicks to
                            <br />
                            recover in to your account.
                        </div>
                        <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-gray-500">Manage all your accounts in one place</div>
                    </div>
                </div>
                {/* <!-- END: Login Info --> */}   
            {/* <!-- BEGIN: Login Form --> */}
            <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                    <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                        Recover
                    </h2>
                    <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">A few more clicks to recover in to your
                        account. Manage all your e-commerce accounts in one place</div>
                    <form action="#">
                        <div className="intro-x mt-8">
                            <input
                                value=""
                                type="email"
                                className="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                                placeholder="Email"
                            />
                        </div>
                        <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                            <button className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" type='submit'>Send</button>
                            <a href='/auth/signin' className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                                Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            {/* <!-- END: Login Form --> */}                             
            </div>
        </GlobalLayout >
      );
}
export default Forgot;