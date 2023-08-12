/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import Content from '../../../Components/Dashboard/Content/Content';
import Theme_Content from '../../../Components/Dashboard/Content/Theme_Content';
// import "../../../component/admin/admin-assets/css/style.css"

// import { AddClients } from "../../../ReduxStore/Slice/AdminMasters"



const Report = () => {


    return (
        <>
            <Content Page_title="Report">

            </Content >

        </>
    )
}


export default Report

