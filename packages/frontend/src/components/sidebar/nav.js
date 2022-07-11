import React from 'react';
import { Home, Users, FileText, Film, Trello, Edit, Layout, CreditCard, HardDrive } from 'react-feather'
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/images/logo.svg';

export const jMenu = {
    'response': 200,
    'data': [
        {
            'id': 1,
            'name': 'Dashboard',
            'design': <Home />,
            'path': '/'
        },
        {
            'id': 2,
            'name': 'User',
            'design': <Users />,
            'path': '/users'
        },
        {
            'id': 3,
            'name': 'Player',
            'design': <HardDrive />,
            'path': '/players'
        },
        {
            'id': 4,
            'name': 'Category',
            'design': <FileText />,
            'path': '/category'
        },
        {
            'id': 5,
            'name': 'Critera',
            'design': <FileText />,
            'path': '/criteria'
        },
        {
            'id': 6,
            'name': 'GAP Integrity',
            'design': <Trello />,
            'path': '/gap'
        },
        {
            'id': 7,
            'name': 'Scores',
            'design': <FileText />,
            'path': '/scores'
        },
    ]
};

export const MappingMenu = ({ location }) => {
    return jMenu.data.map(
        (d, index) => {
            let className = 'side-menu';
            if ((d.path == '/' || d.path == '') && location.pathname == d.path) className = "side-menu side-menu--active";
            else if (location.pathname.match(d.path) && d.path != '/') className = "side-menu side-menu--active";
            return (
                <li key={index}>
                    <Link className={className} to={d.path}>
                        <div className="side-menu__icon"> {d.design}</div>
                        <div className="side-menu__title"> {d.name} </div>
                    </Link>
                </li>
            )

        }
    );
}

const SideMenu = () => {
    const location = useLocation();

    return (
        <nav className="side-nav">
            <Link to='' className="intro-x flex items-center pl-5 pt-4">
                <img alt={'DSS LINEUP SOCCER'} className="w-6" src={logo} />
                <span className="hidden xl:block text-white text-lg ml-3"> DSS<span className="font-medium">SOCCER</span> </span>
            </Link>
            <div className="side-nav__devider my-6"></div>
            <ul><MappingMenu location={location} /></ul>
        </nav>
    )
}

export default SideMenu;