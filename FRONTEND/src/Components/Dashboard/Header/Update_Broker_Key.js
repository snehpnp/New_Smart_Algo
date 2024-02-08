/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from 'react'
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Update_Broker_Keys } from '../../../ReduxStore/Slice/Users/BrokerUpdateSlice';
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const Update_Broker_Key = ({ closeModal }) => {



    const dispatch = useDispatch();

    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;
    const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
    const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))

    const [Refresh, setRefresh] = useState(false)
    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });




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
    }, [Refresh]);






    const formik = useFormik({
        initialValues: {
            app_id: 'null',
            api_type: 'null',
            client_code: 'null',
            api_key: 'null',
            api_secret: 'null',
            app_key: 'null',
            demat_userid: 'null',
            broker: 'null',
        },
        validate: (values) => {
            const errors = {};
            // if (!values.setapikey) {
            //   errors.setapikey = valid_err.APIKEY_ERROR;
            // }
            // if (!values.setappid) {
            //   errors.setappid = valid_err.APIID_ERROR;
            // }
            // if (!values.setapisecret) {
            //   errors.setapisecret = valid_err.APISECRET_ERROR;
            // }

            return errors;
        },
        onSubmit: async (values) => {



            const req = {
                "id": user_id,
                data: {
                    "api_secret": values.api_secret,
                    "demat_userid": values.demat_userid,
                    "client_code": values.client_code,
                    "app_id": values.app_id,
                    "app_key": values.app_key,
                    "api_key": values.api_key,
                    "api_type": values.api_type,
                }
            }

     



            await dispatch(Update_Broker_Keys({ req: req, token: AdminToken })).unwrap().then((response) => {

                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setTimeout(() => {
                        closeModal(false)
                        setRefresh(!Refresh)
                    }, 1000);
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })

        }
    });

    const fields = [

        {
            name: 'api_key',
            label: formik.values.broker === 19? "Api Key": formik.values.broker === 4 ? 'App Key' : formik.values.broker === 7 ? "Consumer Key" : formik.values.broker === 9 ? "Vendor Key" : formik.values.broker === 8 ? 'App Key' : formik.values.broker === 10 ? 'App Key' : "Api Key", type: 'text',
            showWhen: values => values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6'|| values.broker === '19',
            label_size: 12, col_size: 6, disable: false
        },
        {
            name: 'client_code',
            label: formik.values.broker === 1 ? 'User' : formik.values.broker === 4 ? "Client Code" : formik.values.broker === 7 ? "User Name" : formik.values.broker === 9 ? "Vander Id" : formik.values.broker === 11 ? "Client Code" : formik.values.broker === 11 ? "client_code" : 'User Id', type: 'text',
            showWhen: values => values.broker === '1' || values.broker === '5' || values.broker === '4' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '6',
            label_size: 12, col_size: 6, disable: false
        },
        {
            name: 'demat_userid',
            label: formik.values.broker === 9 ? 'User Id' : formik.values.broker === '2' ? 'Demat User ID' : '', type: 'text',
            showWhen: values => values.broker === '9' || values.broker === '2',
            label_size: 12, col_size: 6, disable: false
        },
        {
            name: 'app_id',
            label: formik.values.broker === 1 ? 'Verification Code' : formik.values.broker === 5 ? 'Password' : formik.values.broker === 7 ? 'Demat Password' : formik.values.broker === 11 ? 'Password' : formik.values.broker === 13 ? 'App Id' : formik.values.broker === 9 ? 'Password' : formik.values.broker === 14 ? 'User Id ' : 'App Id', type: 'text',
            showWhen: values =>
                //  values.broker === '2' ||
                values.broker === '1' || values.broker === "3" || values.broker === '5' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '13' || values.broker === '14',
            label_size: 12, col_size: 6, disable: false
        },
        {
            name: 'app_key',
            label: formik.values.broker === 5 || 6 ? 'App Key' : "", type: 'text',
            showWhen: values => values.broker === '5',
            label_size: 12, col_size: 6, disable: false
        },

        {
            name: 'api_secret',
            label: formik.values.broker === 1 ? 'Password Code' : formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Consumer Secret' : formik.values.broker === 9 ? 'Encryption Secret Key' : formik.values.broker === 10 ? 'Api Secret Key' : formik.values.broker === 11 ? '2FA' : formik.values.broker === 14 ? 'Encryption Key' : 'Api Secret', type: 'text',
            showWhen: values => values.broker === '1'
                ||
                // values.broker === '2' ||
                values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15'|| values.broker === '19',
            label_size: 12, col_size: 6, disable: false
        },
        {
            name: 'api_type',
            label: formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Trade Api Password' : formik.values.broker === 9 ? 'Encryption IV' : 'Api Secret', type: 'text',
            showWhen: values =>
                values.broker === '7' || values.broker === '9',
            label_size: 12, col_size: 6, disable: false
        },


    ];


    useEffect(() => {

        formik.setFieldValue('app_id', UserDetails.data !== undefined && UserDetails.data.app_id);
        formik.setFieldValue('api_type', UserDetails.data !== undefined && UserDetails.data.api_key);
        formik.setFieldValue('client_code', UserDetails.data !== undefined && UserDetails.data.client_code);
        formik.setFieldValue('api_key', UserDetails.data !== undefined && UserDetails.data.api_key);
        formik.setFieldValue('api_secret', UserDetails.data !== undefined && UserDetails.data.api_secret);
        formik.setFieldValue('app_key', UserDetails.data !== undefined && UserDetails.data.app_key);
        formik.setFieldValue('demat_userid', UserDetails.data !== undefined && UserDetails.data.demat_userid);
        formik.setFieldValue('broker', UserDetails.data !== undefined && UserDetails.data.broker);

        // }
    }, [UserDetails.data]);

    return (
        <div>
            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update" title="brokerkey"
            />
            <ToastButton />

        </div>
    )
}

export default Update_Broker_Key