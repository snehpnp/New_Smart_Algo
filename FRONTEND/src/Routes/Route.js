import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Admin from "./Admin_Route";
import SuperAdmin from "./Super_Admin_Route";
import SubAdmin from "./Sub_Admin_Route";
import Client from "./User_Route";
import Login from "../layout/Auth/Login";
import ForgetPassword from "../layout/Auth/ForgetPassword";
import UpdatePassword from "../layout/Auth/UpdatePassword.js";
import Deactivate_Company from "../layout/Auth/Deactivate_Company";
import NotFound from "../layout/Auth/Not_Found";
import SignUp from "../layout/Sign_Up_Users/Main";
import NewSignUp from "../layout/Sign_Up_Users/signUp";

const Routing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = JSON.parse(localStorage.getItem("user_details"));
  const roles = JSON.parse(localStorage.getItem("user_role"));
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));

  useEffect(() => {
    if (location.pathname === "/forget") {
      navigate("/forget");
      return;
    }
    if (location.pathname.startsWith("/update")) {
      navigate(location.pathname);
      return;
    }
    if (location.pathname === "/") {
      navigate("/login");
    }
    if (location.pathname.startsWith("/newsignup")) {
      navigate(location.pathname);
      return;
    }

    if (
      accessToken === null ||
      accessToken === undefined ||
      accessToken === "null"
    ) {
      navigate("/login");
      return;
    }
    
    if(location.pathname.includes("/admin/" || "/subadmin/") && gotodashboard != null){
      localStorage.removeItem("gotodashboard");
      localStorage.removeItem("user_role_goTo");
      localStorage.removeItem("user_details_goTo")
      window.location.reload();
    }

    if (roles !== null) {
      if (roles === "ADMIN" && location.pathname === "/login") {
        navigate("/admin/dashboard");
        window.location.reload();
      } else if (roles === "USER" && location.pathname === "/login") {
        navigate("/client/dashboard");
        window.location.reload();
      } else if (roles === "SUBADMIN" && location.pathname === "/login") {
        navigate("/subadmin/clients");
        window.location.reload();
      } else if (roles === "SUPERADMIN" && location.pathname === "/login") {
        navigate("/super/dashboard");
        window.location.reload();
      }
    } else if (gotodashboard != null) {

      if (user_role_goTo === "USER" && location.pathname === "/") {
        navigate("/client/dashboard");
      } else if (roles === "SUBADMIN" && location.pathname === "/") {
        navigate("/subadmin/clients");
      }
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route
          path="/super/*"
          element={roles === "SUPERADMIN" ? <SuperAdmin /> : <Login />}
        />
        <Route
          path="/admin/*"
          element={roles === "ADMIN" ? <Admin /> : <Login />}
        />
        <Route
          path="/client/*"
          element={
            gotodashboard != null ? (
              <Client />
            ) : roles === "USER" ? (
              <Client />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/subadmin/*"
          element={
            gotodashboard != null ? (
              <SubAdmin />
            ) : roles === "SUBADMIN" ? (
              <SubAdmin />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/subadmin/*"
          element={roles === "SUBADMIN" ? <SubAdmin /> : <Login />}
        />
        <Route
          path="/client/*"
          element={
            gotodashboard != null ? (
              <Client />
            ) : roles === "USER" ? (
              <Client />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/login" element={<Login />} />

        <Route path="/newsignup/:id" element={<NewSignUp />} />
        <Route path="/newsignup" element={<NewSignUp />} />

        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/profile" element={<ForgetPassword />} />
        <Route path="/update/:id" element={<UpdatePassword />} />
        <Route path="/notfound" element={<Deactivate_Company />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Routing;
