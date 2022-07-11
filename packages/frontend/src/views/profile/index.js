import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { Mail, Instagram, Twitter } from 'react-feather'

import { QUERY_USER_BYID } from "@gql/users"
import PrivateLayout from '@components/layout/privateLayout';

const profilePic = "https://picsum.photos/200"

const Profile = () => {
    const [user, setUser] = useState({
        email: "",
        id: "",
        fullName: ""
    })
    const { loading, data, error } = useQuery(QUERY_USER_BYID, {
        variables: {
            id: 100
        }
    })

    console.log({
        data, loading,
        user
    });
    useEffect(() => {
        if (data?.tblUserById) {
            setUser(data.tblUserById)
        }
    }, [data])
    return <PrivateLayout>
        <div className="intro-y flex items-center mt-8">
            <h2 className="text-lg font-medium mr-auto">
                Profile Layout
            </h2>
        </div>

        {/*  BEGIN: Profile Info*/}
        <div className="intro-y box px-5 pt-5 mt-5">
            <div className="flex flex-col lg:flex-row border-b border-gray-200 dark:border-dark-5 pb-5 -mx-5">
                <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src={profilePic} />
                    </div>
                    <div className="ml-5">
                        <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">{user.fullName}</div>
                        <div className="text-gray-600">DevOps Engineer</div>
                    </div>
                </div>
                <div className="mt-6 lg:mt-0 flex-1 dark:text-gray-300 px-5 border-l border-r border-gray-200 dark:border-dark-5 border-t lg:border-t-0 pt-5 lg:pt-0">
                    <div className="font-medium text-center lg:text-left lg:mt-3">Contact Details</div>
                    <div className="flex flex-col justify-center items-center lg:items-start mt-4">
                        <div className="truncate sm:whitespace-normal flex items-center"> <Mail className="w-4 h-4 mr-2" /> {user.email} </div>
                        <div className="truncate sm:whitespace-normal flex items-center mt-3"> <Instagram className="w-4 h-4 mr-2" /> Instagram Morgan Freeman </div>
                        <div className="truncate sm:whitespace-normal flex items-center mt-3"> <Twitter className="w-4 h-4 mr-2" /> Twitter Morgan Freeman </div>
                    </div>
                </div>
                <div className="mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 border-t lg:border-0 border-gray-200 dark:border-dark-5 pt-5 lg:pt-0">
                    <div className="text-center rounded-md w-20 py-3">
                        <div className="font-medium text-theme-1 dark:text-theme-10 text-xl">201</div>
                        <div className="text-gray-600">Orders</div>
                    </div>
                    <div className="text-center rounded-md w-20 py-3">
                        <div className="font-medium text-theme-1 dark:text-theme-10 text-xl">1k</div>
                        <div className="text-gray-600">Purchases</div>
                    </div>
                    <div className="text-center rounded-md w-20 py-3">
                        <div className="font-medium text-theme-1 dark:text-theme-10 text-xl">492</div>
                        <div className="text-gray-600">Reviews</div>
                    </div>
                </div>
            </div>
            {/* <div className="nav nav-tabs flex-col sm:flex-row justify-center lg:justify-start" role="tablist">
                <a id="profile-tab" data-toggle="tab" data-target="#profile" href="javascript:;" className="py-4 sm:mr-8 flex items-center active" role="tab" aria-controls="profile" aria-selected="true"> <i className="w-4 h-4 mr-2" data-feather="user"></i> Profile </a>
                <a id="account-tab" data-toggle="tab" data-target="#account" href="javascript:;" className="py-4 sm:mr-8 flex items-center" role="tab" aria-selected="false"> <i className="w-4 h-4 mr-2" data-feather="shield"></i> Account </a>
                <a id="change-password-tab" data-toggle="tab" data-target="#change-password" href="javascript:;" className="py-4 sm:mr-8 flex items-center" role="tab" aria-selected="false"> <i className="w-4 h-4 mr-2" data-feather="lock"></i> Change Password </a>
                <a id="settings-tab" data-toggle="tab" data-target="#settings" href="javascript:;" className="py-4 sm:mr-8 flex items-center" role="tab" aria-selected="false"> <i className="w-4 h-4 mr-2" data-feather="settings"></i> Settings </a>
            </div> */}
        </div>
        {/*  END: Profile Info*/}
    </PrivateLayout>
}

export default Profile