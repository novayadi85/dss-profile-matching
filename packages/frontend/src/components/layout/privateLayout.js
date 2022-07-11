import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Users, ChevronRight, Search, Inbox, CreditCard, Bell, Lock, HelpCircle, ToggleRight } from 'react-feather'

import { SideMenu, SidebarMobile } from "@components/sidebar"

const notifications = {
    'response': 200,
    'data': [
        /*{
            'id': 1,
            'po': '001',
            'date': '1 jan 2022',
            'time': '07:00 AM',
            'note': 'Please '
        },*/
    ]
};

const PrivateLayout = ({ children }) => {
    const dispatch = useDispatch()
    const { isLogin } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const profile = {
        image: require("@assets/images/profile-13.jpg")
    };

    const notification = notifications.data.map(
        (d, index) =>
            <div key={index} className="cursor-pointer relative flex items-center mt-5">
                <div className="w-12 h-12 flex-none image-fit mr-1">
                    <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src={profile.image} />
                    <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                        <a href="#" className="font-medium truncate mr-5">#{d.po}</a>
                        <div className="text-xs text-gray-500 ml-auto whitespace-nowrap">{d.date} - {d.time}</div>
                    </div>
                    <div className="w-full truncate text-gray-600 mt-0.5">{d.note}</div>
                </div>
            </div>
    );


    useEffect(() => {
        document.body.classList.add('main');
        document.body.classList.remove('login')
    }, [])
    useEffect(() => {
        if (!isLogin)
            navigate("/auth", { replace: true })
    }, [isLogin])

    return <>
        <SidebarMobile />
        <div className="flex">
            <SideMenu />
            <div className="content">
                <div className="top-bar">
                    <div className="-intro-x breadcrumb mr-auto hidden sm:flex">
                        <a href="">Application</a>
                        <ChevronRight className="breadcrumb__icon" />
                        <a href="" className="breadcrumb--active">Dashboard</a>
                    </div>
                    <div className="intro-x relative mr-3 sm:mr-6">
                        <div className="search hidden sm:block">
                            <input type="text" className="search__input form-control border-transparent placeholder-theme-13" placeholder="Search..." />
                            <Search className="search__icon dark:text-gray-300" />
                        </div>
                        <a className="notification sm:hidden" href="">
                            <Search className="notification__icon dark:text-gray-300" />
                        </a>
                        <div className="search-result">
                            <div className="search-result__content">
                                <div className="search-result__content__title">Pages</div>
                                <div className="mb-5">
                                    <a href="" className="flex items-center">
                                        <div className="w-8 h-8 bg-theme-18 text-theme-9 flex items-center justify-center rounded-full">
                                            <Inbox className="w-4 h-4" /> </div>
                                        <div className="ml-3">Mail Settings</div>
                                    </a>
                                    <a href="" className="flex items-center mt-2">
                                        <div className="w-8 h-8 bg-theme-17 text-theme-11 flex items-center justify-center rounded-full">
                                            <Users className="w-4 h-4" /> </div>
                                        <div className="ml-3">Users & Permissions</div>
                                    </a>
                                    <a href="" className="flex items-center mt-2">
                                        <div className="w-8 h-8 bg-theme-14 text-theme-10 flex items-center justify-center rounded-full">
                                            <CreditCard className="w-4 h-4" /> </div>
                                        <div className="ml-3">Transactions Report</div>
                                    </a>
                                </div>
                                <div className="search-result__content__title">Users</div>
                                <div className="mb-5">
                                    <a href="" className="flex items-center mt-2">
                                        <div className="w-8 h-8 image-fit">
                                            <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src={profile.image} />
                                        </div>
                                        <div className="ml-3">Kevin Spacey</div>
                                        <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">kevinspacey@left4code.com</div>
                                    </a>
                                    <a href="" className="flex items-center mt-2">
                                        <div className="w-8 h-8 image-fit">
                                            <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src={profile.image} />
                                        </div>
                                        <div className="ml-3">Al Pacino</div>
                                        <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">alpacino@left4code.com</div>
                                    </a>

                                </div>
                                <div className="search-result__content__title">Products</div>
                                <a href="" className="flex items-center mt-2">
                                    <div className="w-8 h-8 image-fit">
                                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src="/assets/images/preview-2.jpg" />
                                    </div>
                                    <div className="ml-3">Nike Air Max 270</div>
                                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">Sport &amp; Outdoor</div>
                                </a>
                                <a href="" className="flex items-center mt-2">
                                    <div className="w-8 h-8 image-fit">
                                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src="/assets/images/preview-6.jpg" />
                                    </div>
                                    <div className="ml-3">Apple MacBook Pro 13</div>
                                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">PC &amp; Laptop</div>
                                </a>
                                <a href="" className="flex items-center mt-2">
                                    <div className="w-8 h-8 image-fit">
                                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src="/assets/images/preview-14.jpg" />
                                    </div>
                                    <div className="ml-3">Samsung Galaxy S20 Ultra</div>
                                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">Smartphone &amp; Tablet</div>
                                </a>
                                <a href="" className="flex items-center mt-2">
                                    <div className="w-8 h-8 image-fit">
                                        <img alt="Rubick Tailwind HTML Admin Template" className="rounded-full" src="/assets/images/preview-2.jpg" />
                                    </div>
                                    <div className="ml-3">Dell XPS 13</div>
                                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">PC &amp; Laptop</div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="intro-x dropdown mr-auto sm:mr-6">
                        <div className="dropdown-toggle notification notification--bullet cursor-pointer" role="button" aria-expanded="false">
                            <Bell className="notification__icon dark:text-gray-300" />
                        </div>
                        <div className="notification-content pt-2 dropdown-menu">
                            <div className="notification-content__box dropdown-menu__content box dark:bg-dark-6">
                                <div className="notification-content__title">Notifications</div>
                                {notification}
                            </div>
                        </div>
                    </div>

                    <div className="intro-x dropdown w-8 h-8">
                        <div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in" role="button" aria-expanded="false">
                            <img alt="Rubick Tailwind HTML Admin Template" src={profile.image} />
                        </div>
                        <div className="dropdown-menu w-56">
                            <div className="dropdown-menu__content box bg-theme-26 dark:bg-dark-6 text-white">
                                <div className="p-4 border-b border-theme-27 dark:border-dark-3">
                                    <div className="font-medium">Admin</div>
                                    <div className="text-xs text-theme-28 mt-0.5 dark:text-gray-600">Internal & External</div>
                                </div>
                                <div className="p-2" style={{display: 'none'}}>
                                    <a href="/profile" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md">
                                        <Users className="w-4 h-4 mr-2" /> Profile
                                    </a>
                                    <a href="/resetpass" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md">
                                        <Lock className="w-4 h-4 mr-2" /> Reset Password
                                    </a>
                                    <a href="" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md">
                                        <HelpCircle className="w-4 h-4 mr-2" /> Help
                                    </a>
                                </div>
                                <div className="p-2 border-t border-theme-27 dark:border-dark-3">
                                    <a
                                        href='/auth/signout'
                                        className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md w-full">
                                        <ToggleRight className="w-4 h-4 mr-2" /> Logout
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/*  start content */}
                {children}
                {/* end content */}
            </div>

        </div>
        <div data-url="side-menu-dark-dashboard-overview-1.html" className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box dark:bg-dark-2 border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10">
            <div className="mr-4 text-gray-700 dark:text-gray-300">Dark Mode</div>
            <div className="dark-mode-switcher__toggle border"></div>
        </div>
    </>
}

export default PrivateLayout