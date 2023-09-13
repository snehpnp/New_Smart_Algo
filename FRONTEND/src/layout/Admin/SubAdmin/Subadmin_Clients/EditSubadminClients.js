import Content from "../../../../Components/Dashboard/Content/Content"
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import { Pencil, Trash2 ,  } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_SUBADMIN } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const EditSubadminClient = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [Addsubadmin, setAddsubadmin] = useState({
        loading: false,
        data: []
    });


    // const data = async () => {
    //     await dispatch(Get_All_SUBADMIN()).unwrap()
    //         .then((response) => {
    //             if (response.status) {
    //                 setAddsubadmin({
    //                     loading: false,
    //                     data: response.data
    //                 });
    //             }
    //         })
    // }
    // useEffect(() => {
    //     data()
    // }, [])

    const fields = [
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'mobile', label: 'Mobile', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
    ]

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            mobile: '',
            password: '',
        },
        // validate: (values) => {
        //     const errors = {};
        //     if (!values.username) {
        //         errors.username = valid_err.USERNAME_ERROR;
        //     }
        //     if (!values.fullName) {
        //         errors.fullName = valid_err.FULLNAME_ERROR;
        //     }
        //     if (!values.mobile) {
        //         errors.mobile = valid_err.CONTACT_ERROR;
        //     } else if (!isValidContact(values.mobile)) {
        //         errors.mobile = valid_err.INVALID_CONTACT_ERROR;
        //     }
        //     // if (!values.licencetype) {
        //     //   errors.licence = valid_err.LICENCE_TYPE_ERROR;
        //     // }
        //     // if (!values.tomonth) {
        //     //   errors.tomonth = valid_err.LICENCE_ERROR;
        //     // }
        //     if (!values.broker) {
        //         errors.broker = valid_err.BROKER_ERROR;
        //     }
        //     // if (!values.apisecret) {
        //     //   errors.apisecret = valid_err.APISECRET_ERROR;
        //     // }
        //     // if (!values.apikey) {
        //     //   errors.apikey = valid_err.APIKEY_ERROR;
        //     // }
        //     // if (!values.apiid) {
        //     //   errors.apiid = valid_err.APIID_ERROR;
        //     // }

        //     if (!values.email) {
        //         errors.email = valid_err.EMPTY_EMAIL_ERROR;
        //     } else if (!isValidEmail(values.email)) {
        //         errors.email = valid_err.INVALID_EMAIL_ERROR;
        //     }

        //     return errors;
        // },
        onSubmit: async (values) => {

            const req = {
                // "fullname": values.fullName,
                // "username": values.username,
                // "email": values.email,
                // "phone_number": values.mobile,
                // "license_type": "1",
                // "licence": "0",
                // "roleId": "3",
                // "roles": RoleId,
                // "master_id": "0",
                // "parent_admin_id": userid,
                // "parent_role_id": setRoleId(RoleId),
                // // "parent_role_id": roleId,
                // "broker": values.broker,
                // "api_secret": values.api_secret,
                // "app_id": values.app_id,
                // "client_code": values.client_code,
                // "api_key": values.api_key,
                // "app_key": values.app_key,
                // "api_type": values.api_type,

                // "demat_userid": values.demat_userid
            }
        }
    });


    return (
        <>
            {
                Addsubadmin.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Edit Sub-Admin Clients" button_title="Back" route="/admin/subadminclients">

                            <Formikform fieldtype={fields.filter(field => !field.showWhen)} formik={formik} btn_name="Edit Sub-Admin Client" />
                        </Theme_Content>
                    </>
            }



        </ >
    )
    {/* <>
        <Content Page_title="AllSubadmin">
            <p>AllSubadmin 123</p>
        </Content>
        )
    </> */}
}


export default EditSubadminClient;
