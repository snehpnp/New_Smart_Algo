import React, { useEffect, useState } from 'react'
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';


import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { useDispatch, useSelector } from "react-redux";


const Update_Broker_Key = () => {



    const dispatch = useDispatch();

    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;

    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });



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



    console.log("UserDetails", UserDetails.data.broker);



    const formik = useFormik({
        initialValues: {
            setclient_code: null,
            setdemat_userid: null,
            setapp_id: null,
            setapp_key: null,
            setapi_key: null,
            setapi_type: null,
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
            // console.log("test", values);

            const req = {
                "api_secret": values.setapi_secret,
                "demat_userid": values.setdemat_userid,
                "client_code": values.setclient_code,
                "app_id": values.setapp_id,
                "app_key": values.app_key,
                "api_key": values.setapi_key,
                "api_type": values.setapi_type,
                // "id": userid,
            }

            // await dispatch(UpadateBrokerAPiKey({ req: req, AdminToken: AdminToken })).then((res) => {
            //     if (res.meta.requestStatus === "fulfilled") {
            //         toast.success(res.payload.data)
            //         setTimeout(() => {
            //             setModalOpen(false)
            //         }, 1000);
            //     }

            // })


        }
    });

    const fields = [

        {
            name: 'setapi_key',
            label: formik.values.broker == 4 ? 'App Key' : formik.values.broker == 7 ? "Consumer Key" : formik.values.broker == 9 ? "Vendor Key" : formik.values.broker == 8 ? 'App Key' : formik.values.broker == 10 ? 'App Key' : "'Api Key", type: 'text',
            showWhen: values => values.broker === 4 || values.broker === 7 || values.broker === 8 || values.broker === 9 || values.broker === 10 || values.broker === 11 || values.broker === 12 || values.broker === 14 || values.broker === 15 || values.broker === 6
                || values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6'
        },
        {
            name: 'setclient_code',
            label: formik.values.broker == 1 ? 'User' : formik.values.broker == 4 ? "Client Code" : formik.values.broker == 7 ? "User Name" : formik.values.broker == 9 ? "Vander Id" : formik.values.broker == 11 ? "Client Code" : 'User Id', type: 'text',
            showWhen: values => values.broker === 1 || values.broker === 5 || values.broker === 4 || values.broker === 7 || values.broker === 9 || values.broker === 11 || values.broker === 6
                || values.broker === '1' || values.broker === '5' || values.broker === '4' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === "6"
        },
        {
            name: 'setdemat_userid',
            label: formik.values.broker == 9 ? 'User Id' : '', type: 'text',
            showWhen: values => values.broker === 9 || values.broker === '9'
        },


        {
            name: 'setapp_id',
            label: formik.values.broker == 1 ? 'Verification Code' : formik.values.broker == 5 ? 'Password' : formik.values.broker == 7 ? 'Demat Password' : formik.values.broker == 11 ? 'Password' : formik.values.broker == 13 ? 'App Id' : formik.values.broker == 9 ? 'Password' : formik.values.broker == 14 ? 'User Id ' : 'App Id', type: 'text',
            showWhen: values => values.broker === 2 || values.broker === 1 || values.broker === 3 || values.broker === 5 || values.broker === 7 || values.broker === 9 || values.broker === 11 || values.broker === 13 || values.broker === 14
                || values.broker === '2' || values.broker === '1' || values.broker === '3' || values.broker === '5' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '13' || values.broker === '14'
        },



        {
            name: 'setapp_key',
            label: formik.values.broker == 5 || 6 ? 'App Key' : "", type: 'text',
            showWhen: values => values.broker === 5 || values.broker === '5' || values.broker === '6'
        },

        {
            name: 'setapi_secret',
            label: formik.values.broker == 1 ? 'Password Code' : formik.values.broker == 5 ? 'DOB' : formik.values.broker == 7 ? 'Consumer Secret' : formik.values.broker == 9 ? 'Encryption Secret Key' : formik.values.broker == 10 ? 'Api Secret Key' : formik.values.broker == 11 ? '2FA' : formik.values.broker == 14 ? 'Encryption Key' : 'Api Secret', type: 'text',
            showWhen: values => values.broker === 1
                || values.broker === 2 || values.broker === 3 || values.broker === 5 || values.broker === 6 || values.broker === 7 || values.broker === 8 || values.broker === 9 || values.broker === 10 || values.broker === 11 || values.broker === 13 || values.broker === 14 || values.broker === 15

                || values.broker === '1' || values.broker === '2' || values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15'
        },
        {
            name: 'setapi_type',
            label: formik.values.broker == 5 ? 'DOB' : formik.values.broker == 7 ? 'Trade Api Password *' : formik.values.broker == 9 ? 'Encryption IV' : 'Api Secret', type: 'text',
            showWhen: values => values.broker === 3 || values.broker === 7 || values.broker === 9 ||
                values.broker === '3' || values.broker === '7' || values.broker === '9'
        },


    ];

    console.log("fords", formik.values);

    useEffect(() => {
        // if (onchild && onchild.length > 0) {
        formik.setValues({
            // setapi_secret: UserDetails.data && UserDetails.data.|| null,
            // setclient_code: UserDetails.data && UserDetails.data. || null,
            // setdemat_userid: UserDetails.data && UserDetails.data. || null,
            // setapp_id: UserDetails.data && UserDetails.data. || null,
            // setapp_key: UserDetails.data && UserDetails.data. || null,
            // setapi_key: UserDetails.data && UserDetails.data. || null,
            // setapi_type: UserDetails.data && UserDetails.data. || null,
            broker: UserDetails.data && UserDetails.data.broker,

        });
    // }
      }, [UserDetails, formik.setValues]);



return (
    <div>
        <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update" title="brokerkey"
    />
    </div>
)
}

export default Update_Broker_Key