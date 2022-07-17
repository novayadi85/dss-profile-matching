import {
    Routes,
    Route
} from 'react-router-dom'

import RequestAuth from '@components/layout/requestAuth';

import Dashboard from '@views/home';
import User from "@views/users";
import Player from "@views/players";
import Gap from "@views/gap";
import Category from "@views/category";
import Criteria from "@views/criteria";
import SubCriteria from "@views/subcriteria";
import Score from '@views/scores';
import Calculate from '@views/calculation';
import Signin from "@views/auth/signin";
import SignOut from "@views/auth/signout";
import SignUp from "@views/auth/signUp";
import Forgot from '@views/auth/forgot';
import PageNotFound from '@views/pageNotFound';

const MainRoutes = () => {
    return <Routes>
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signout" element={<SignOut />} />
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route path="/auth/*" element={<Signin />} />
        {/* req auth */}
        <Route path="/users/*" element={<RequestAuth><User /></RequestAuth>} />
        <Route path="/rating/*" element={<RequestAuth><Calculate /></RequestAuth>} />
        <Route path="/scores/*" element={<RequestAuth><Score /></RequestAuth>} />
        <Route path="/category/*" element={<RequestAuth><Category /></RequestAuth>} />
        <Route path="/gap/*" element={<RequestAuth><Gap /></RequestAuth>} />
        <Route path="/sub-criteria/*" element={<RequestAuth><SubCriteria /></RequestAuth>} />
        <Route path="/criteria/*" element={<RequestAuth><Criteria /></RequestAuth>} />
        <Route path="/players/*" element={<RequestAuth><Player /></RequestAuth>} />
        <Route path="/" element={<RequestAuth><Dashboard /></RequestAuth>} />
        <Route path="/auth/forgot" element={<Forgot />} />
        <Route path="/*" element={<PageNotFound />} />
    </Routes>
}

export default MainRoutes