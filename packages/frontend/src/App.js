import cash from "cash-dom";
import React, { useEffect, Suspense } from 'react'
import {
    BrowserRouter as Router, Route,
} from 'react-router-dom'

import MainRoutes from "./routes";
import { site } from '@config';
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
                <title>{ site.name}</title>
                <link data-react-helmet="true" rel="icon" type="image/png" href={favicon} sizes="32x32"/>
            </Helmet>
            <Suspense fallback="loading">
                <MainRoutes />
            </Suspense>
        </Router>
    )
}

export default App;
