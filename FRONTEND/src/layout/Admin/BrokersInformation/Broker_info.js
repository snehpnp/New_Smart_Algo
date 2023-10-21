// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Loader from '../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_BROKER_INFORMATIONS } from '../../../ReduxStore/Slice/Admin/DashboardSlice'
import { useDispatch, useSelector } from "react-redux";
import { fa_time } from "../../../Utils/Date_formet";
import Modal from '../../../Components/ExtraComponents/Modal';



const Broker_info = () => {

    const dispatch = useDispatch()


    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

    const [Refresh, setRefresh] = useState(false)


    const [showModal, setshowModal] = useState(false)
    const [getBrokerId, setGetBrokerId] = useState('')

    const [GetBrokerInfo, setGetBrokerInfo] = useState({
        loading: true,
        data: []
    });

    // console.log("getBrokerId", typeof getBrokerId)


    const data = async () => {
        await dispatch(GET_BROKER_INFORMATIONS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setGetBrokerInfo({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setGetBrokerInfo({
                        loading: false,
                        data: response.data
                    });
                }
            })
            .catch((err) => {
                console.log("err", err);
            })
    }
    useEffect(() => {
        data()
    }, [])

    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'broker_name',
            text: 'User Name'
        },
        {
            dataField: 'app_code',
            text: 'App Code'
        },
        {
            dataField: 'createdAt',
            text: 'Create Date',
            formatter: (cell, row) => fa_time(cell)

        },
        {
            dataField: "actions",
            text: "Actions",
            formatter: (cell, row) => (
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <div>

                        <span data-toggle="tooltip" data-placement="top" title="Edit">
                            <Pencil
                                size={20}
                                color="#198754"
                                strokeWidth={2}
                                className="mx-1"
                                onClick={(e) => GetBrokerInformation(row)}
                            />
                        </span>

                    </div>
                </div>

            ),
        },


    ];



    // GET ALL GROUP SERVICES NAME
    const GetBrokerInformation = async (row) => {
        setGetBrokerId(row.broker_id)
        console.log("row", row)
        setshowModal(true)

        // await dispatch(GET_ALL_SERVICES_NAMES({
        //     data: row
        // })).unwrap()
        //     .then((response) => {

        //         if (response.status) {
        //             setServicesName({
        //                 loading: false,
        //                 data: response.data
        //             });
        //         }
        //         else {
        //             setServicesName({
        //                 loading: false,
        //                 data: []
        //             });

        //         }
        //     })
    }







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

            console.log("values", values);

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

            console.log("test", req);



            // await dispatch(Update_Broker_Keys({ req: req, token: AdminToken })).unwrap().then((response) => {

            //     if (response.status === 409) {
            //         toast.error(response.data.msg);
            //     }
            //     else if (response.status) {
            //         toast.success(response.msg);
            //         setTimeout(() => {
            //             closeModal(false)
            //             setRefresh(!Refresh)
            //         }, 1000);
            //     }
            //     else if (!response.status) {
            //         toast.error(response.msg);
            //     }

            // })

        }
    });


    const fields = [

        {
            name: 'api_key',
            label: formik.values.broker === 4 ? 'App Key' : formik.values.broker === 7 ? "Consumer Key" : formik.values.broker === 9 ? "Vendor Key" : formik.values.broker === 8 ? 'App Key' : formik.values.broker === 10 ? 'App Key' : "'Api Key", type: 'text',
            showWhen: values => values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6',
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
            label: formik.values.broker === 9 ? 'User Id' : formik.values.broker === '2' ? 'Demat UserId' : '', type: 'text',
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
                values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15',
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

        // formik.setFieldValue('app_id', UserDetails.data !== undefined && UserDetails.data.app_id);
        // formik.setFieldValue('api_type', UserDetails.data !== undefined && UserDetails.data.api_key);
        // formik.setFieldValue('client_code', UserDetails.data !== undefined && UserDetails.data.client_code);
        // formik.setFieldValue('api_key', UserDetails.data !== undefined && UserDetails.data.api_type);
        // formik.setFieldValue('api_secret', UserDetails.data !== undefined && UserDetails.data.api_secret);
        // formik.setFieldValue('app_key', UserDetails.data !== undefined && UserDetails.data.app_key);
        // formik.setFieldValue('demat_userid', UserDetails.data !== undefined && UserDetails.data.demat_userid);
        formik.setFieldValue('broker', getBrokerId && getBrokerId);
    }, [getBrokerId]);


    return (
        <>
            {
                GetBrokerInfo.loading ? <Loader /> :
                    <>
                        <Content Page_title="Set Broker Information" button_status={false}  >


                            <FullDataTable TableColumns={columns} tableData={GetBrokerInfo.data} />

                            {
                                showModal ?
                                    <>
                                        <Modal isOpen={showModal} size="ms-5" title="Update Keys" hideBtn={true}
                                            // onHide={handleClose}
                                            handleClose={() => setshowModal(false)}
                                        >
                                            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update" title="brokerkey" />
                                        </Modal >
                                    </>
                                    : ""
                            }
                        </Content>
                    </>
            }

        </ >
    )


}


export default Broker_info;


