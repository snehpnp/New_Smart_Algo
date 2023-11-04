/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import AlertToast from '../../../Components/ExtraComponents/Alert_Toast'
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import * as Config from "../../../Utils/Config";

import { useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { Create_Help } from "../../../ReduxStore/Slice/Users/ClientHelpSlice";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

import socketIOClient from "socket.io-client";

// import { io  , socketIOClient} from "socket.io-client";


import toast, { Toaster } from 'react-hot-toast';


const ApiCreateInfo = () => {




    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const token = JSON.parse(localStorage.getItem("user_details")).token;
    const role = JSON.parse(localStorage.getItem("user_role"));


    const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))
    const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
  

    
    const [refresh, setRefresh] = useState(false);

    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });


    const formik = useFormik({
        initialValues: {
            username: null,
            fullName: null,
            mobile: null,
            email: null,
            msg: null,
            admin_id: null,
        },
        validate: (values) => {

            const errors = {};
            if (!values.msg) {
                errors.msg = valid_err.EMPTY_MSG_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {


            const req = {
                "username": values.fullName,
                "fullname": values.username,
                "email": values.email,
                "mobile": values.mobile,
                "helpmsg": values.msg,
                "admin_id":  values.admin_id,
                "user_id": user_id,
            }

            await dispatch(Create_Help({ req: req, token: token })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {

                    // const socket = socketIOClient(`${Config.base_url}`);
                    // socket.emit("help_from_client", req);

                    setRefresh(!refresh)
                    toast.success(response.msg);
                    setTimeout(() => {
                        navigate("/client/dashboard")
                    }, 1000);
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }
    });






    const fields = [
        { name: 'username', label: 'Username', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'fullName', label: 'FullName', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'mobile', label: 'Mobile', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'email', label: 'Email', type: 'text', label_size: 12, col_size: 3, disable: true },
        { name: 'msg', label: 'Your Massage', type: 'msgbox', label_size: 12, col_size: 12, row_size: '4' },
    ];




    const data = async () => {
        await dispatch(User_Profile({ id: isgotodashboard ? gotodashboard.user_id : user_id }))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setUserDetails({
                        loading: false,
                        data: response.data,
                    });
                }
            });
    };
    useEffect(() => {
        data();
    }, [refresh]);



    useEffect(() => {
        formik.setFieldValue('username', UserDetails.data.UserName);
        formik.setFieldValue('fullName', UserDetails.data.FullName);
        formik.setFieldValue('mobile', UserDetails.data.PhoneNo);
        formik.setFieldValue('email', UserDetails.data.Email);
        formik.setFieldValue('admin_id', UserDetails.data.parent_id);
    }, [UserDetails]);







    return <>
        <Content Page_title="Help Center" button_status={false} >
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Send"
            />
            <ToastButton />

        </Content>
        )
    </>
}


export default ApiCreateInfo




