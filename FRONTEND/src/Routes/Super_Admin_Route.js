import React from 'react'
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";

import Wraper from '../Components/Dashboard/Wraper/Wraper';

import Dashboard from '../layout/Superadmin/Dashboard/Dashboard';
import Admins from '../layout/Superadmin/AdminList/Admins';
import History from '../layout/Superadmin/History/History';
import Support from '../layout/Superadmin/Support/Support';
import CompanyTheme from '../layout/Superadmin/ThemeSelect/CompanyTheme';
import Profile from '../layout/Superadmin/Profile/Profile';
import Permitions from '../layout/Superadmin/AdminPermittions/AllPermitions';
import AdminHelps from '../layout/Superadmin/AdminPermittions/AdminHelps';


// ApiCreateInfo
import ApiCreateInfo from '../layout/Superadmin/ApiCreateInfo/ApiCreateInfo';
import AddApiCreateInfo from '../layout/Superadmin/ApiCreateInfo/AddApiCreateInfo';
import EditApiCreateInfo from '../layout/Superadmin/ApiCreateInfo/EditApiCreateInfo';



const Admin = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const role_id = localStorage.getItem("Role")


    return (
        <>
            {location.pathname !== "/super" && location.pathname !== "/super/*" ? <Wraper /> : null}
            <Routes>
                {/* <> */}
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/alladmins" element={<Admins />} />
                <Route exact path="/permitions" element={<Permitions />} />
                <Route exact path="/history" element={<History />} />
                <Route exact path="/support" element={<Support />} />
                <Route exact path="/selecttheme" element={<CompanyTheme />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/helps" element={<AdminHelps />} />
                <Route exact path="/apicreateinfo" element={<ApiCreateInfo />} />
                <Route exact path="/apicreateinfo/add" element={<AddApiCreateInfo />} />
                <Route exact path="/apicreateinfo/edit" element={<EditApiCreateInfo />} />
                {/* </> */}
            </Routes>


        </>
    )
}

export default Admin