import { useEffect, useState } from 'react';
import { BarChart2 } from 'react-feather'
import clsx from 'clsx'
import { useLocation, Link } from 'react-router-dom';

import { jMenu } from "./nav"

import logo from '../../assets/images/logo.svg';

const MappingMenu = ({ location }) => {
    return jMenu.data.map(
        (d, index) => {
            let isActive = false;
            if ((d.path == '/' || d.path == '') && location.pathname == d.path) isActive = true
            else if (location.pathname.match(d.path) && d.path != '/') isActive = true
            return (
                <li key={index}>
                    <Link className={clsx('menu', [isActive && "menu--active"])} to={d.path}>
                        <div className="menu__icon"> {d.design}</div>
                        <div className="menu__title"> {d.name} </div>
                    </Link>
                </li>
            )

        }
    );
}


const SidebarMobile = () => {
    const [isOpen, setOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        window.addEventListener('resize', () => { setOpen(false) })
        return () => {
            window.addEventListener('resize', () => { setOpen(false) })
        }
    })
    return (
        <div className="mobile-menu md:hidden">
            <div className="mobile-menu-bar">
                <a href="/" className="flex mr-auto">
                    <img alt="logo" className="w-6" src={logo} />
                </a>
                <button
                    onClick={() => setOpen(pref => !pref)}>
                    <BarChart2 color='white' className='transform -rotate-90 w-8 h-8' />
                </button>
            </div>
            <ul className={clsx("border-t border-theme-29 py-5 transition-all ease-in-out duration-500", [!isOpen && "hidden"])}>
                <MappingMenu location={location} />
            </ul>
        </div>
    )
}

export default SidebarMobile;