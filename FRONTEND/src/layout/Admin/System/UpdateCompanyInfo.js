import React, { useEffect, useState } from 'react'

import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"

import { useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { Update_smtp_details } from '../../../ReduxStore/Slice/Admin/SystemSlice';
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

const UpdateCompanyInfo = ({ showModal, setshowModal, data }) => {

    const dispatch = useDispatch();

    const user_token = JSON.parse(localStorage.getItem('user_details')).token;


    useEffect(() => {
        formik.setFieldValue('companyname', data.length > 0 && data[0].panel_name);
        formik.setFieldValue('panel_key', data.length > 0 && data[0].panel_key);
        formik.setFieldValue('shortname', data.length > 0 && data[0].panel_short_name);
        formik.setFieldValue('broker', data.length > 0 && data[0].broker_url);
        formik.setFieldValue('version', data.length > 0 && data[0].version);
        formik.setFieldValue('domain_url', data.length > 0 && data[0].domain_url);
        formik.setFieldValue('domain_url_https', data.length > 0 && data[0].domain_url_https);



    }, [data && data]);




    const formik = useFormik({
        initialValues: {
            companyname: "",
            panel_key: "",
            shortname: "",
            broker: '',
            version: '',
            domain_url:"",
            domain_url_https:""
        },
        touched: {
            companyname: false,
            panel_key: false,
            shortname: false,
            broker: false,
            version: false,
            domain_url:false,
            domain_url_https:false,
        },
        validate: (values) => {

            const errors = {};
            if (!values.companyname && formik.touched.companyname) {
                errors.companyname = valid_err.EMPTY_COMPANY_NAME_ERR;
            }
            if (!values.panel_key && formik.touched.panel_key) {
                errors.panel_key = valid_err.EMPTY_PANEL_KEY_ERR;
            }
            if (!values.shortname && formik.touched.shortname) {
                errors.shortname = valid_err.EMPTY_SHORT_NAME_ERR;
            }
            if (!values.broker && formik.touched.broker) {
                errors.broker = valid_err.EMPTY_BROKER_NAME_ERR;
            }
            if (!values.version && formik.touched.version) {
                errors.version = valid_err.EMPTY_VERSION_NAME_ERR;
            }
            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "id": data.length > 0 && data[0]._id,
                data: {
                    "panel_name": values.companyname,
                    "panel_key": values.panel_key,
                    "panel_short_name": values.shortname,
                    "broker_url": values.broker,
                    "version": values.version,
                    "prefix": values.shortname,
                    "domain_url":values.domain_url,
                    "domain_url_https":values.domain_url_https

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
        { name: 'companyname', label: 'Company Name', type: 'text', label_size: 12, col_size: 6, disable: false },
        { name: 'panel_key', label: 'Panel Key', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'shortname', label: 'Short Name', type: 'text', label_size: 12, col_size: 6, disable: false },
        // { name: 'broker', label: 'Broker Url', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'domain_url', label: 'Domain Url', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'domain_url_https', label: 'Login Url', type: 'text', label_size: 12, col_size: 6, disable: true },
        { name: 'version', label: 'Version ', type: 'text', label_size: 12, col_size: 6, disable: true },

    ];

    return (
        <div>   <Modal isOpen={showModal} size="lg" title="Company Information" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
            />
            <ToastButton />

        </Modal ></div>
    )
}

export default UpdateCompanyInfo