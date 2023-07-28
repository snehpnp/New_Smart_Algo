import React from 'react'
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";

import Wraper from '../Components/Dashboard/Wraper/Wraper';

import Dashboard from '../layout/Superadmin/Dashboard/Dashboard';
import Admins from '../layout/Superadmin/AdminList/Admins';
import  History from  '../layout/Superadmin/History/History';
import  Support from  '../layout/Superadmin/Support/Support';

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
                <Route exact path="/history" element={<History />} />
                <Route exact path="/support" element={<Support />} />
                {/* </> */}
            </Routes>


        </>
    )
}

export default Admin