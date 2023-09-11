import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import Admin from './Admin_Route'
import SuperAdmin from './Super_Admin_Route'
import SubAdmin from "./Sub_Admin_Route"
import Client from "./User_Route"

import Login from "../layout/Auth/Login"


import ForgetPassword from '../layout/Auth/ForgetPassword';
import UpdatePassword from '../layout/Auth/UpdatePassword.js';
import Testing from "../test"
// import NotFound from "../Layout/NotFound"



const Routing = () => {
  const location = useLocation();

  const navigate = useNavigate()
  // const accessToken = localStorage.getItem("user_details").accessToken

  const roles = JSON.parse(localStorage.getItem('user_role'))
  const gotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
  const user_role_goTo = JSON.parse(localStorage.getItem('user_role_goTo'))




  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
    if (roles != null) {
      if (roles === "ADMIN" && location.pathname === "/") {
        navigate("/admin/dashboard");
      } else if (roles === "USER" && location.pathname === "/") {
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
    } else if (gotodashboard != null) { 
      if (user_role_goTo === "USER" && location.pathname === "/") {
        navigate("/client/dashboard");
      }  else if (roles === "SUBADMIN" && location.pathname === "/") {
        navigate("/subadmin/dashboard");
      }
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])


  return <>
    <Routes>
      <Route path="/super/*" element={(roles === "SUPERADMIN") ? <SuperAdmin /> : <Login />} />
      <Route path="/admin/*" element={(roles === "ADMIN") ? <Admin /> : <Login />} />
      {/* <Route path="/subadmin/*" element={(roles === "SUBADMIN") ? <SubAdmin /> : <Login />} /> */}
      <Route path="/client/*" element={gotodashboard != null ? <Client /> :   (roles === "USER") ? <Client /> : <Login />} />

      <Route path="/subadmin/*" element={gotodashboard != null ? <SubAdmin /> :   (roles === "SUBADMIN") ? <SubAdmin /> : <Login />} />

      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<ForgetPassword />} />
      <Route path="/profile" element={<ForgetPassword />} />
      <Route path="/update/:id" element={<UpdatePassword />} />
      <Route path="/Testing" element={<Testing />} />




    </Routes>


  </>
}

export default Routing