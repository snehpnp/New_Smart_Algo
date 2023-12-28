import React, { useEffect, useState } from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"
import { useDispatch, useSelector } from "react-redux";
import { Update_smtp_details } from '../../../ReduxStore/Slice/Admin/SystemSlice';
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const UpdateImages = ({ showModal, setshowModal, data }) => {

    const dispatch = useDispatch();

    const user_token = JSON.parse(localStorage.getItem('user_details')).token;

    useEffect(() => {
        formik.setFieldValue('logo', data.length > 0 && data[0].logo);
        formik.setFieldValue('favicon', data.length > 0 && data[0].favicon);
        formik.setFieldValue('watermark', data.length > 0 && data[0].watermark);
        formik.setFieldValue('loginimg', data.length > 0 && data[0].loginimage);

    }, [data && data]);


    const formik = useFormik({
        initialValues: {
            logo: '',
            favicon: '',
            watermark: '',
            loginimg: '',
        },
        touched: {
            logo: '',
            favicon: '',
            watermark: '',
            loginimg: '',
        },
        validate: (values) => {
            const errors = {};
            // if (!values.licence) {
            //     errors.licence = valid_err.USERNAME_ERROR;
            // }
            return errors;
        },
        onSubmit: async (values) => {

            const req = {
                "id": data.length > 0 && data[0]._id,
                data: {
                    "logo": values.logo,
                    "favicon": values.favicon,
                    "watermark": values.watermark,
                    "loginimage": values.loginimg,
                }
            }

            await dispatch(Update_smtp_details({ req: req, token: user_token })).unwrap().then((response) => {

                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setshowModal(false)

                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }
    });


    const fields = [
        { name: 'logo', label: 'Logo', type: 'file', label_size: 12, col_size: 6, disable: false },
        { name: 'favicon', label: 'Favicon', type: 'file', label_size: 12, col_size: 6, disable: false },
        { name: 'watermark', label: 'WaterMark', type: 'file', label_size: 12, col_size: 6, disable: false },
        { name: 'loginimg', label: 'loginImg', type: 'file', label_size: 12, col_size: 6, disable: false },

    ];

    return (
        <div>   <Modal isOpen={showModal} size="lg" title="Update Images" hideBtn={true}
            handleClose={() => setshowModal(false)}>

            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
                showImagePreview={true}
            />
            <ToastButton />

        </Modal ></div>
    )
}

export default UpdateImages