import cash from "cash-dom";
import React, { useEffect } from 'react'
import {
    BrowserRouter as Router, Route,
} from 'react-router-dom'

import MainRoutes from "./routes";

import '@theme/js/app';
import './styles/rubic/js/app';
import {Helmet} from 'react-helmet';
import favicon from './assets/images/IPPS-logo.png';

const profile = {
    image: require("@assets/images/profile-13.jpg")
};

const init = () => {
    cash("html").app();
}

const App = () => {
    useEffect(() => {
        init();
    });

    return (
        <Router> 
            <Helmet>
                <title>DSS LINEUP SOCCER</title>
                <link data-react-helmet="true" rel="icon" type="image/png" href={favicon} sizes="32x32"/>
            </Helmet>
            <MainRoutes />
        </Router>
    )
}

export default App;
