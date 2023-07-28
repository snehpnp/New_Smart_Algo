import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import Admin from './Admin_Route'
import SuperAdmin from './Super_Admin_Route'
import SubAdmin from "./Sub_Admin_Route"
import Client from "./User_Route"

import Login from "../layout/Auth/Login"

// import SuperAdmin from './Superadmin'
// import Client from './Child_Client'
// import Master_Client from './Master_Clients'
// import Login from '../Layout/Auth/Login'
// import ResetPassword from '../Layout/Auth/ResetPassword';
// import UpdatePassword from '../Layout/Auth/UpdatePassword';
// import Testing from "../Testing"
// import NotFound from "../Layout/NotFound"



const Routing = () => {
  const location = useLocation();

  const navigate = useNavigate()
  // const accessToken = localStorage.getItem("user_details").accessToken

  const roles = JSON.parse(localStorage.getItem('user_role'))


  // let roles = {
  //   roles: ["SUPERADMIN"]
  // }
  // let roles = {
  //   roles: ["ADMIN"]
  // }
  // let roles = {
  //   roles: ["SUBADMIN"]
  // }


  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
    if (roles != null) {
      if (roles === "ADMIN" && location.pathname === "/") {
        navigate("/admin/dashboard");
      } else if (roles === "CLIENT" && location.pathname === "/") {
        navigate("/client/dashboard");
      }
      else if (roles === "SUBADMIN" && location.pathname === "/") {
        navigate("/subadmin/dashboard");
      }
      else if (roles === "SUPERADMIN" && location.pathname === "/") {
        navigate("/super/dashboard");
      }
      // else {
      //   navigate("/login");
      // }
    }
    else {
      navigate("/login");
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])


  return <>
    <Routes>
      <Route path="/super/*" element={(roles === "SUPERADMIN") ? <SuperAdmin /> : <Login />} />
      <Route path="/admin/*" element={(roles === "ADMIN") ? <Admin /> : <Login />} />
      <Route path="/subadmin/*" element={(roles === "SUBADMIN") ? <SubAdmin /> : <Login />} />
      <Route path="/client/*" element={(roles === "CLIENT") ? <Client /> : <Login />} />
      <Route path="/login" element={<Login />} />




    </Routes>


  </>
}

export default Routing