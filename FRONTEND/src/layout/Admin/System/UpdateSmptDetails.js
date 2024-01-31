import React, { useEffect, useState } from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"
import { Email_regex, Mobile_regex, Name_regex } from "../../../Utils/Common_regex"

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Update_smtp_details } from '../../../ReduxStore/Slice/Admin/SystemSlice';
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

const UpdateSmptDetails = ({ showModal, setshowModal, data }) => {

    const dispatch = useDispatch();

   
    const user_id = JSON.parse(localStorage.getItem('user_details')).user_id;
    const user_token = JSON.parse(localStorage.getItem('user_details')).token;



    useEffect(() => {
        formik.setFieldValue('email', data.length > 0 && data[0].email);
        formik.setFieldValue('cc', data.length > 0 && data[0].cc_mail);
        formik.setFieldValue('bcc', data.length > 0 && data[0].bcc_mail);
        formik.setFieldValue('password', data.length > 0 && data[0].smtp_password);
        formik.setFieldValue('host', data.length > 0 && data[0].smtphost);
        formik.setFieldValue('port', data.length > 0 && data[0].smtpport);

    }, [data && data]);


    // const isValidEmail = (email) => {
    //     return Email_regex(email)
    // }
    const formik = useFormik({
        initialValues: {
            email: "",
            cc: "",
            bcc: '',
            host: '',
            port: '',
            password: '',
        },
        touched: {
            email: false,
            cc: false,
            bcc: false,
            host: false,
            port: false,
            password: false,
        },
        validate: (values) => {
            const errors = {};
            if (!values.email && formik.touched.email) {
                errors.email = valid_err.EMPTY_COMPANY_EMAIL_ERROR;
            }
            // else if (!isValidEmail(values.email)) {
            //     errors.email = valid_err.INVALID_COMPANY_EMAIL_ERROR;
            // }
            if (!values.bcc && formik.touched.bcc) {
                errors.bcc = valid_err.EMPTY_COMPANYBCC_EMAIL_ERROR;
            }
            // else if (!isValidEmail(values.bcc)) {
            //     errors.bcc = valid_err.INVALID_COMPANYBCC_EMAIL_ERROR;
            // }

            if (!values.cc && formik.touched.cc) {
                errors.cc = valid_err.EMPTY_COMPANYCC_EMAIL_ERROR;
            }
            // else if (!isValidEmail(values.cc)) {
            //     errors.cc = valid_err.INVALID_COMPANYCC_EMAIL_ERROR;
            // }


            if (!values.host && formik.touched.host) {
                errors.host = valid_err.COMPANY_HOST_ERROR;
            }
            if (!values.port && formik.touched.port) {
                errors.port = valid_err.COMPANY_PORT_ERROR;
            }

            if (!values.password && formik.touched.password) {
                errors.password = valid_err.COMPANY_PASSWORD_ERROR;
            }

            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "id": data.length > 0 && data[0]._id,
                data: {
                    "email": values.email,
                    "smtp_password": values.password,
                    "cc_mail": values.cc,
                    "bcc_mail": values.bcc,
                    "smtpport": values.port,
                    "smtphost": values.host,
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
        { name: 'email', label: 'Email', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'cc', label: 'CC', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'bcc', label: 'BCC', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'password', label: 'Password', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'host', label: 'HOST', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'port', label: 'PORT', type: 'text', label_size: 12, col_size: 6, disable: false },

    ];


    // useEffect(() => {
    //     setfirst(data && data)

    // }, [data]);












    return (
        <div>   <Modal isOpen={showModal} size="lg" title="Update SMTP Details" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"

            />
            <ToastButton />
        </Modal ></div>
    )
}

export default UpdateSmptDetails

