import React, { useEffect, useState } from 'react'
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { Formik, Form, Field, useFormik } from 'formik';
// import * as  valid_err from "../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Link } from "react-router-dom";
// import "../../../component/admin/admin-assets/css/style.css"

// import { AddClients } from "../../../ReduxStore/Slice/AdminMasters"

const AddClient = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const AdminToken = JSON.parse(localStorage.getItem('user_details')).accessToken;
    // const userid = JSON.parse(localStorage.getItem('user_details')).id;
    // const roleId = JSON.parse(localStorage.getItem('user_details')).roleId;
    // const admin_id = JSON.parse(localStorage.getItem('user_details')).admin_id;
    // const RoleId = JSON.parse(localStorage.getItem('user_details')).roles;




    const [showLoader, setshowLoader] = useState(false)


    const isValidEmail = (email) => {
        return Email_regex(email)
    }
    const isValidContact = (mobile) => {
        return Mobile_regex(mobile)
    }


    const setRoleId = (role) => {
        if (role === "ADMIN") {
            return "2"
        }
        else if (role === "USER") {
            return "4"
        }
        else if (role === "SUPERADMIN") {
            return "1"
        }
        else if (role === "MASTER") {
            return "2"
        }
    }




    const formik = useFormik({
        initialValues: {
            username: '',
            fullName: '',
            email: '',
            mobile: '',
            broker: '',
            licencetype: '',
            tomonth: "0",

            app_id: 'null',
            api_type: 'null',
            client_code: 'null',
            api_key: 'null',
            api_secret: 'null',
            app_key: 'null',
            demat_userid: 'null'

        },
        validate: (values) => {
            const errors = {};
            // if (!values.username) {
            //   errors.username = valid_err.USERNAME_ERROR;
            // }
            // if (!values.fullName) {
            //   errors.fullName = valid_err.FULLNAME_ERROR;
            // }
            // if (!values.mobile) {
            //   errors.mobile = valid_err.CONTACT_ERROR;
            // } else if (!isValidContact(values.mobile)) {
            //   errors.mobile = valid_err.INVALID_CONTACT_ERROR;
            // }
            // if (!values.licencetype) {
            //   errors.licence = valid_err.LICENCE_TYPE_ERROR;
            // }
            // if (!values.tomonth) {
            //   errors.tomonth = valid_err.LICENCE_ERROR;
            // }
            // if (!values.broker) {
            //   errors.broker = valid_err.BROKER_ERROR;
            // }
            // if (!values.apisecret) {
            //   errors.apisecret = valid_err.APISECRET_ERROR;
            // }
            // if (!values.apikey) {
            //   errors.apikey = valid_err.APIKEY_ERROR;
            // }
            // if (!values.apiid) {
            //   errors.apiid = valid_err.APIID_ERROR;
            // }

            // if (!values.email) {
            //   errors.email = valid_err.EMPTY_EMAIL_ERROR;
            // } else if (!isValidEmail(values.email)) {
            //   errors.email = valid_err.INVALID_EMAIL_ERROR;
            // }

            return errors;
        },
        onSubmit: async (values) => {

            // const req = {
            //   "fullname": values.fullName,
            //   "username": values.username,
            //   "email": values.email,
            //   "phone_number": values.mobile,
            //   "license_type": "1",
            //   "licence": "0",
            //   "roleId": "3",
            //   "roles": RoleId,
            //   "master_id": "0",
            //   "parent_admin_id": userid,
            //   "parent_role_id": setRoleId(RoleId),
            //   // "parent_role_id": roleId,
            //   "broker": values.broker,
            //   "api_secret": values.api_secret,
            //   "app_id": values.app_id,
            //   "client_code": values.client_code,
            //   "api_key": values.api_key,
            //   "app_key": values.app_key,
            //   "api_type": values.api_type,

            //   "demat_userid": values.demat_userid
            // }

            // console.log("res", req);
            // return

            // await dispatch(AddClients({ req: req, AdminToken: AdminToken })).then((res) => {


            //   if (res.meta.requestStatus === "fulfilled") {
            //     if (res.payload === "Failed! Username is already in use!") {
            //       toast.error(res.payload)
            //     } else {
            //       toast.success(res.payload.data)
            //       // setshowLoader(false)
            //       // setshowLoader(false)
            //       setTimeout(() => {
            //         navigate("/admin/masters")
            //       }, 2000);
            //     }
            //   }

            // })
        }
    });

    const fields = [
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'password', label: 'password', type: 'password' },
        {
            name: 'broker',
            label: 'Broker',
            type: 'select',
            options: [
                { label: 'Market Hub', value: '1' },
                { label: 'B2C', value: '11' },
                { label: 'B2C', value: '11' },

            ],
        },
        { name: 'fullName', label: 'FullName', type: 'checkbox', index: '1' },
        { name: 'mobile', label: 'Mobile', type: 'checkbox', index: '2' },
        { name: 'mobile', label: 'Mobile', type: 'checkbox', index: '2' },
        { name: 'mobile', label: 'Mobile', type: 'checkbox', index: '2' },
        { name: 'mobile', label: 'Mobile', type: 'checkbox', index: '2' },
        { name: 'mobile', label: 'Mobile', type: 'checkbox', index: '2' },
        { name: 'mobile', label: 'Mobile', type: 'checkbox', index: '2' },

        {
            name: 'api_key',
            label: formik.values.broker === 4 ? 'App Key' : formik.values.broker === 7 ? "Consumer Key" : formik.values.broker === 9 ? "Vendor Key" : formik.values.broker === 8 ? 'App Key' : formik.values.broker === 10 ? 'App Key' : "'Api Key", type: 'text',
            showWhen: values => values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6'
        },

        {
            name: 'client_code',
            label: formik.values.broker === 1 ? 'User' : formik.values.broker === 4 ? "Client Code" : formik.values.broker === 7 ? "User Name" : formik.values.broker === 9 ? "Vander Id" : formik.values.broker === 11 ? "Client Code" : formik.values.broker === 11 ? "client_code" : 'User Id', type: 'text',
            showWhen: values => values.broker === '1' || values.broker === '5' || values.broker === '4' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '6'
        },
        {
            name: 'demat_userid',
            label: formik.values.broker === 9 ? 'User Id' : '', type: 'text',
            showWhen: values => values.broker === '9'
        },


        {
            name: 'app_id',
            label: formik.values.broker === 1 ? 'Verification Code' : formik.values.broker === 5 ? 'Password' : formik.values.broker === 7 ? 'Demat Password' : formik.values.broker === 11 ? 'Password' : formik.values.broker === 13 ? 'App Id' : formik.values.broker === 9 ? 'Password' : formik.values.broker === 14 ? 'User Id ' : 'App Id', type: 'text',
            showWhen: values => values.broker === '2' || values.broker === '1' || values.broker === "3" || values.broker === '5' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '13' || values.broker === '14'
        },



        {
            name: 'app_key',
            label: formik.values.broker === 5 || 6 ? 'App Key' : "", type: 'text',
            showWhen: values => values.broker === '5'
        },

        {
            name: 'api_secret',
            label: formik.values.broker === 1 ? 'Password Code' : formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Consumer Secret' : formik.values.broker === 9 ? 'Encryption Secret Key' : formik.values.broker === 10 ? 'Api Secret Key' : formik.values.broker === 11 ? '2FA' : formik.values.broker === 14 ? 'Encryption Key' : 'Api Secret', type: 'text',
            showWhen: values => values.broker === '1'
                || values.broker === '2' || values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15'
        },
        {
            name: 'api_type',
            label: formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Trade Api Password' : formik.values.broker === 9 ? 'Encryption IV' : 'Api Secret', type: 'text',
            showWhen: values =>
                values.broker === '7' || values.broker === '9'
        },

    ];




    return (
        <>
            <div className="content-body">
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card form-card">
                                <div className="card-header main-card-header">
                                    <h4 className="card-title">Add Client</h4>
                                </div>
                                <div className="card-body">
                                    <div className="form-validation">
                                        <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Master" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddClient
