/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import { useFormik } from 'formik';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable"
import Formikform1 from "../../../../Components/ExtraComponents/Form/Formik_form1"
import * as  valid_err from "../../../../Utils/Common_Messages"
import { useDispatch } from "react-redux";
import { Get_All_Service_for_Client } from '../../../../ReduxStore/Slice/Common/commoSlice'
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import toast from 'react-hot-toast';
import { fDateTimeSuffix } from "../../../../Utils/Date_formet";
import { Trash2 } from "lucide-react";


import { Add_Message_Broadcast, Getl_All_Message_Broadcast, Remove_Message_Broadcast } from "../../../../ReduxStore/Slice/Admin/MessageBroadcastSlice";


import { GET_PANEL_BROKERS } from "../../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";

const MsgBroadCast = () => {

    const dispatch = useDispatch()

    const user_token = JSON.parse(localStorage.getItem("user_details")).token;


    const [AllStrategy, setAllStrategy] = useState({
        loading: true,
        data: []
    });

    const [AllBrokers, setBrokers] = useState([]);
    const [AllMessage, setAllMessages] = useState({
        loading: true,
        data: []
    });

    const [refresh, setRefresh] = useState(false);


    const [UserDetails, setUserDetails] = useState({
        loading: true,
        data: [],
    });



    const broker_list = async () => {
        // await dispatch(GET_PANEL_BROKERS({ domain: "sneh.com" })).unwrap().then((response) => {
        //     if (response.status) {
        //         setBrokers(response.data.broker_id)
        //     }
        // })
    }

    const formik = useFormik({
        initialValues: {
            message: null,
            Strategy: "All",

        },
        validate: (values) => {

            const errors = {};
            if (!values.message) {
                errors.message = valid_err.USERNAME_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {
            
            const req = {
                "Broker": values.Broker,
                "message": values.message,
                "starteg_id": values.Strategy ? values.Strategy : "All",
            }

            await dispatch(Add_Message_Broadcast({ req: req, token: user_token })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                     
                    setRefresh(!refresh)
                    formik.setFieldValue('message', "")
                    formik.setFieldValue('Strategy', "")
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }
    });



    const fields = [
        {
            name: 'Broker',
            label: 'Broker',
            type: 'select',
            options: [
                { label: "All Users", value: "-1" },
                { label: "Demo", value: "0" },
                ...AllBrokers && AllBrokers.map((item) => ({ label: item.name, value: item.id }))],
            label_size: 12, col_size: 3, disable: false
        },
        { name: 'message', label: 'Entery Your Message', type: 'msgbox', label_size: 12, row_size: 3, col_size: 12, disable: true },
    ];

     



    useEffect(() => {
        // data()
        broker_list()
    }, [])


    //  FOR GET ALL BROADCAST MESSAGES
    const GetAllMsg = async () => {
        await dispatch(Getl_All_Message_Broadcast({
            req: {
            }, token: user_token
        })).unwrap().then((response) => {
            if (response.status) {
                setAllMessages({
                    loading: false,
                    data: response.data
                });
            }
        })
    }


    useEffect(() => {
        GetAllMsg()
    }, [refresh])


    //  REMOVE BROADCAST MESSAGES
    const Remove_Message = async (id) => {
        if (window.confirm("Do You Really Want To Remove ")) {

            await dispatch(Remove_Message_Broadcast({
                id: id, token: user_token
            })).unwrap().then((response) => {
                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                    setRefresh(!refresh)
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }
            })
        } else {
            return console.log("Ss")
        }
    }


    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        // {
        //     dataField: "_id",
        //     text: "SR. No.",
        // },
        {
            dataField: 'Message',
            text: 'Message'
        },
        {
            dataField: 'createdAt',
            text: 'Message',
            formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),

        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" onClick={() => Remove_Message(row._id)} />
                    </span>
                </div>
            ),
        },

    ];

    return <>
        <Content Page_title="Message Broadcast" button_status={false}>
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen)} formik={formik} btn_name="Send" />
            <div className="mt-5">
            </div>
            <FullDataTable TableColumns={columns} tableData={AllMessage.data} />
            < ToastButton />

        </Content>
    </>
}


export default MsgBroadCast


