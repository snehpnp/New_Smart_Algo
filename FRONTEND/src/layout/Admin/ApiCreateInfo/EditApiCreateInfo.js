/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import AlertToast from '../../../Components/ExtraComponents/Alert_Toast'
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"
import { useFormik } from 'formik';
import { useNavigate, useLocation } from "react-router-dom";

import * as  valid_err from "../../../Utils/Common_Messages"
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


import toast, { Toaster } from 'react-hot-toast';
import { Update_Api_Info_Theme } from '../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice';


const Edit_Create_Api_Info = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    console.log("location", location.state)


    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const token = JSON.parse(localStorage.getItem("user_details")).token;


    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });



    const formik = useFormik({
        initialValues: {
            "title": location.state ? location.state.title : null,
            "description": location.state ? location.state.description : null,
            "steponeurl": location.state ? location.state.steponeurl : null,
            "imageone": location.state ? location.state.imageone : null,
            "steptwourl": location.state ? location.state.steptwourl : null,
            "imagetwo": location.state ? location.state.imagetwo : null,
            "stepthree": location.state ? location.state.stepthree : null,
            "imagethree": location.state ? location.state.imagethree : null,
            "note": location.state ? location.state.note : null,
            "youtubeurl": location.state ? location.state.youtubeurl : null
        },
        validate: (values) => {

            const errors = {};

            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "_id": location.state && location.state._id ,
                "title": values.title,
                "description": values.description,
                "steponeurl": values.steponeurl,
                "imageone": values.imageone,
                "steptwourl": values.steptwourl,
                "imagetwo": values.imagetwo,
                "stepthree": values.stepthree,
                "imagethree": values.imagethree,
                "note": values.note,
                "youtubeurl": values.youtubeurl
            }


            // console.log("reqreqreqreqreq", req);

            // return

            await dispatch(Update_Api_Info_Theme({ req: req, token: token })).unwrap().then((response) => {

                console.log("response", response)
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setTimeout(() => {
                        navigate("/admin/apicreateinfo")
                    }, 1000);
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }
    });


    console.log("initialValues", formik.values)



    const fields = [
        { name: 'title', label: 'Title', type: 'text', label_size: 12, col_size: 12, disable: false },
        { name: 'description', label: 'Description', type: 'msgbox', label_size: 12, col_size: 12, row_size: 2 },

        // { name: 'firststep', label: 'Title', type: 'text', label_size: 12, col_size: 12, disable: false },
        { name: 'steponeurl', label: 'Step One Url', type: 'msgbox', label_size: 12, col_size: 6, row_size: 2 },
        { name: 'imageone', label: 'Image One', type: 'file', label_size: 12, col_size: 6, row_size: 2 },

        // { name: 'steptwo', label: 'Title', type: 'text', label_size: 12, col_size: 12, disable: false },
        { name: 'steptwourl', label: 'Step two Url', type: 'msgbox', label_size: 12, col_size: 6, row_size: 2 },
        { name: 'imagetwo', label: 'Image Two', type: 'file', label_size: 12, col_size: 6, disable: false },

        // { name: 'stepthree', label: '', type: 'text', label_size: 12, col_size: 12, disable: false },
        { name: 'stepthree', label: 'Step Three Url', type: 'msgbox', label_size: 12, col_size: 6, row_size: 2 },
        { name: 'imagethree', label: 'Image Three', type: 'file', label_size: 12, col_size: 6, disable: false },

        { name: 'note', label: 'Note', type: 'msgbox', label_size: 12, col_size: 12, disable: false },
        { name: 'youtubeurl', label: 'Youtube Link', type: 'msgbox', label_size: 12, col_size: 12, disable: false },


    ];








    return <>
        <Content Page_title="Edit Api" button_title="Back" route="/admin/apicreateinfo" >
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
            />
            <ToastButton />

        </Content>
        )
    </>
}


export default Edit_Create_Api_Info




