import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';

import AlertToast from '../../../../Components/ExtraComponents/Alert_Toast'
import Formikform1 from "../../../../Components/ExtraComponents/Form/Formik_form1"
import * as  valid_err from "../../../../Utils/Common_Messages"
import { useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Service_for_Client } from '../../../../ReduxStore/Slice/Common/commoSlice'

import { User_Profile } from "../../../../ReduxStore/Slice/Common/commoSlice.js";

const MsgBroadCast = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem("user_details")).token;


    const [AllStrategy, setAllStrategy] = useState({
        loading: true,
        data: []
    });


    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });



    const formik = useFormik({
        initialValues: {
            username: null,
            fullName: null,
            mobile: null,
            msgbox: null,

        },
        validate: (values) => {

            const errors = {};
            if (!values.msgbox) {
                errors.msgbox = valid_err.USERNAME_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "FullName": values.fullName,
                "UserName": values.username,
                "Email": values.email,

            }


            // console.log("reqreqreqreqreq", req);

            // return

            //   await dispatch(Add_User({ req: req, token: user_token })).unwrap().then((response) => {

            //     if (response.status === 409) {
            //       toast.error(response.data.msg);
            //     }
            //     else if (response.status) {
            //       toast.success(response.msg);
            //       setTimeout(() => {
            //         navigate("/admin/allclients")
            //       }, 1000);
            //     }
            //     else if (!response.status) {
            //       toast.error(response.msg);
            //     }

            //   })
        }
    });



    console.log("AllStrategy", AllStrategy);



    const fields = [
        {
            name: 'Strategy',
            label: 'strategy',
            type: 'select',
            options: AllStrategy.data && AllStrategy.data.map((item) => ({ label: item.strategy_name, value: item._id })),
            label_size: 12, col_size: 3 ,  disable: true
        },
        { name: 'username', label: 'Entery Your Message', type: 'msgbox', label_size: 12, row_size: 4 ,col_size: 12, disable: true },
    ];

    const data = async () => {

        await dispatch(Get_All_Service_for_Client({
            req: {
            }, token: token
        })).unwrap().then((response) => {
            if (response.status) {
                setAllStrategy({
                    loading: false,
                    data: response.data
                });
            }
        })
    }


    useEffect(() => {
        data()
    }, [])

    return <>
        <Content Page_title="Message Broadcast" button_status={false}>
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen)} formik={formik} btn_name="Send" />
        </Content>
    </>
}


export default MsgBroadCast


