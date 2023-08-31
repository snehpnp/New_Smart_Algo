// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const AllClients = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });


    const data = async () => {
        await dispatch(GET_ALL_CLIENTS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data()
    }, [])

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'UserName',
            text: 'User Name'
        },
        {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number'
        },
        {
            dataField: 'CreateDate',
            text: 'CreateDate',
            formatter: (cell, row) => cell.split('T')[0]

        },
        {
            dataField: 'CreateDate',
            text: 'CreateDate',
            formatter: (cell, row) => cell.split('T')[0]

        },
        {
            dataField: 'CreateDate',
            text: 'CreateDate',
            formatter: (cell, row) => cell.split('T')[0]

        },
        {
            dataField: 'Otp',
            text: 'Password'
        },
        {
            dataField: 'ActiveStatus',
            text: 'Status',
            formatter: (cell, row) => (
                <>
                    <label class="switch" >
                        <input type="checkbox" className="bg-primary" checked={row.ActiveStatus == "1" ? true : false} />
                        <span class="slider round"></span>
                    </label>

                </>


            ),
        },
        {
            dataField: 'ActiveStatus',
            text: 'Go To Dashboard',
            formatter: (cell, row) => (
                <>
                    Broker
                </>


            ),
        },
        {
            dataField: 'ActiveStatus',
            text: 'Dashboard',
            formatter: (cell, row) => (
                <>
                    <button
                        className="btn btn-new-block"
                        style={row.AppLoginStatus == '0' && row.WebLoginStatus == '0' ? { backgroundColor: "#FF0000",color:"black" } : { backgroundColor: "#008000",color:"black" }}
                    // onClick={() => goToDashboard(row.id, row.client_id)}
                    >
                        Dashboard
                    </button>

                </>


            ),
        },
        {
            dataField: 'TradingStatus',
            text: 'TradingStatus',
            formatter: (cell, row) => (
                <>
                <span style={(cell == "off" ||cell === null) ? { color: "#FF0000", fontSize: "40px" } : { color: "#008000", fontSize: "40px" }}>&#9679;</span>
              </>


            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div style={{width:"120px"}}>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                    </span>

                </div>
            ),
        },
    ];
    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="All Clients" button_title="Add Client" route="/client/add">

                            {
                                getAllClients.data && getAllClients.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                                    </>
                            }
                            {
                                showModal ?
                                    <>
                                        < Modal isOpen={showModal} backdrop="static" size="sm" title="Verify OTP" btn_name="Verify"
                                        //  handleClose={setshowModal(false)}
                                        >
                                        </Modal >
                                    </>
                                    : ""
                            }
                        </Theme_Content>
                    </>
            }



        </ >
    )

}


export default AllClients

