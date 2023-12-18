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
import { GET_BROKER_INFORMATIONS, UPDATE_BROKER_INFORMATIONS, FIND_BROKER_RESPONSES } from '../../../ReduxStore/Slice/Admin/DashboardSlice'
import { useDispatch, useSelector } from "react-redux";
import { fDate } from "../../../Utils/Date_formet";
import Modal from '../../../Components/ExtraComponents/Modal';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast from 'react-hot-toast';


const Broker_info = () => {

    const dispatch = useDispatch()


    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

    const [Refresh, setRefresh] = useState(false)


    const [showModal, setshowModal] = useState(false)
    const [getBrokerId, setGetBrokerId] = useState('')

    const [getBrokerInfo, setBrokerInfo] = useState({
        loading: true,
        data: {}
    });
    const [GetBrokerInfo, setGetBrokerInfo] = useState({
        loading: true,
        data: []
    });

    const Find_broker_info = async (id) => {
        await dispatch(FIND_BROKER_RESPONSES({ id: id })).unwrap()
            .then((response) => {
                if (response.status) {
                    setBrokerInfo({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setBrokerInfo({
                        loading: false,
                        data: response.data
                    });
                }
            })
            .catch((err) => {
                console.log("err", err);
            })
    }


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
            dataField: 'updatedAt',
            text: 'Create Date',
            formatter: (cell, row) => fDate(cell)

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
        Find_broker_info(row._id)
        setGetBrokerId(row.broker_id)
        setshowModal(true)
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


            return errors;
        },
        onSubmit: async (values) => {
          

            const req = {
                "id": getBrokerInfo.data && getBrokerInfo.data._id,
                broker_data: {
                    "apiSecret": values.api_secret,
                    "demat_userid": values.demat_userid,
                    "client_code": values.client_code,
                    "app_code": values.app_id,
                    "app_key": values.app_key,
                    "api_key": values.api_key,
                    "api_type": values.api_type,
                }
            }

            await dispatch(UPDATE_BROKER_INFORMATIONS({ req: req, token: AdminToken })).unwrap().then((response) => {

                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setTimeout(() => {
                        setshowModal(!showModal)
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
        // {
        //     name: 'demat_userid',
        //     label: formik.values.broker === '2' ? 'Demat User Id' : '', type: 'text',
        //     showWhen: values => values.broker === '2',
        //     label_size: 12, col_size: 6, disable: false
        // },

        {
            name: 'app_id',
            label: formik.values.broker === '2' ? 'app key' : '', type: 'text',
            showWhen: values => values.broker === '2',
            label_size: 12, col_size: 6, disable: false
        },
        {
            name: 'api_secret',
            label: formik.values.broker === '2' ? 'secret key' : '', type: 'text',
            showWhen: values => values.broker === '2',
            label_size: 12, col_size: 6, disable: false
        },


    ];



    useEffect(() => {
        formik.setFieldValue('broker', getBrokerId && getBrokerId);
        formik.setFieldValue('app_id', getBrokerInfo.data && getBrokerInfo.data.app_code);
        // formik.setFieldValue('api_type', getBrokerInfo.data && getBrokerInfo.data);
        formik.setFieldValue('client_code', getBrokerInfo.data && getBrokerInfo.data.client_code);
        formik.setFieldValue('api_key', getBrokerInfo.data && getBrokerInfo.data.api_key);
        formik.setFieldValue('api_secret', getBrokerInfo.data && getBrokerInfo.data.apiSecret);
        // formik.setFieldValue('app_key', getBrokerInfo.data && getBrokerInfo.data);
        formik.setFieldValue('demat_userid', getBrokerInfo.data && getBrokerInfo.data.demat_userid);

    }, [getBrokerInfo]);

       
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
                            <ToastButton />

                        </Content>
                    </>
            }

        </ >
    )


}


export default Broker_info;


