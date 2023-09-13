/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import AlertToast from '../../../Components/ExtraComponents/Alert_Toast'
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import { useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";


import toast, { Toaster } from 'react-hot-toast';


const Create_Api_Info = () => {

    const dispatch = useDispatch()

    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;


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






    const fields = [
        { name: 'title', label: 'Title', type: 'text', label_size: 12, col_size: 12, disable: true },
        { name: 'description', label: 'Description', type: 'msgbox', label_size: 12, col_size: 12, row_size: 2 },

        // { name: 'firststep', label: 'Title', type: 'text', label_size: 12, col_size: 12, disable: true },
        { name: 'link1', label: 'Step One Url', type: 'msgbox', label_size: 12, col_size: 6, row_size: 2 },
        { name: 'image1', label: 'Image One', type: 'file', label_size: 12, col_size: 6, row_size: 2 },

        // { name: 'steptwo', label: 'Title', type: 'text', label_size: 12, col_size: 12, disable: true },
        { name: 'link2', label: 'Step two Url', type: 'msgbox', label_size: 12, col_size: 6, row_size: 2 },
        { name: 'image3', label: 'Image Two', type: 'file', label_size: 12, col_size: 6, disable: true },

        // { name: 'stepthree', label: '', type: 'text', label_size: 12, col_size: 12, disable: true },
        { name: 'link2', label: 'Step Three Url', type: 'msgbox', label_size: 12, col_size: 6, row_size: 2 },
        { name: 'image3', label: 'Image Three', type: 'file', label_size: 12, col_size: 6, disable: true },

        { name: 'youtube', label: 'Note', type: 'msgbox', label_size: 12, col_size: 12, disable: true },
        { name: 'youtube', label: 'Youtube Link', type: 'msgbox', label_size: 12, col_size: 12, disable: true },


    ];




    const data = async () => {
        await dispatch(User_Profile({ id: user_id }))
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
    }, []);



    useEffect(() => {
        formik.setFieldValue('username', UserDetails.data.UserName);
        formik.setFieldValue('fullName', UserDetails.data.FullName);
        formik.setFieldValue('mobile', UserDetails.data.PhoneNo);
    }, [UserDetails]);






    return <>
        <Content Page_title="Help Center" button_status={false} >
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Send"
            />
        </Content>
        )
    </>
}


export default Create_Api_Info




