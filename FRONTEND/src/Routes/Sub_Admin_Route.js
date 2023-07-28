import React from 'react'
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";

import Wraper from '../Components/Dashboard/Wraper/Wraper';

import Dashboard from '../layout/Sub_Admin/Dashboard/Dashboard';


const Admin = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const role_id = localStorage.getItem("Role")


    return (
        <>
            {location.pathname !== "/subadmin" && location.pathname !== "/subadmin/*" ? <Wraper /> : null}

            <Routes>
                {/* <> */}
                <Route exact path="/dashboard" element={<Dashboard />} />
                {/* <Route exact path="/admins" element={<Admins />} />
                <Route exact path="/admin/add" element={<AddAdmins />} />
                <Route exact path="/admin/edit/:id" element={<EditEdmins />} />
                <Route exact path="/system" element={<System />} />
                <Route exact path="system/editsystem/:id" element={<Editsystem />} /> */}

                {/* </> */}
            </Routes>


        </>
    )
}

export default Admin