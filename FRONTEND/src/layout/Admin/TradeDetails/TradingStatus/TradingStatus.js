// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS, GET_ALL_TRADING_STATUS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const TradingStatus = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });


    const data = async () => {
        await dispatch(GET_ALL_TRADING_STATUS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllClients({
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
            dataField: 'userinfo.FullName',
            text: 'User Name'
        },
        {
            dataField: 'prefix',
            text: 'Mobile Number'
        },
        {
            dataField: 'login_status',
            text: 'Login Status',
            formatter: (cell, row) => cell == null || "" ? "-" : cell

        },
        {
            dataField: 'trading_status',
            text: 'Trading Status',
            formatter: (cell, row) => cell == null || "" ? "-" : cell
            
            
        },
        {
            dataField: 'message',
            text: 'message',
            formatter: (cell, row) => cell == null || "" ? "-" : cell

        },

        {
            dataField: 'role',
            text: 'role'
        },
        {
            dataField: 'system_ip',
            text: 'system IP'
        },

        {
            dataField: 'createdAt',
            text: 'Create Date',
            formatter: (cell, row) => cell.split('T')[0] + "   " + cell.split('T')[1]

        },
        // {
        //     dataField: 'ActiveStatus',
        //     text: 'Status',
        //     formatter: (cell, row) => (
        //         <>
        //             <label class="switch" >
        //                 <input type="checkbox" className="bg-primary" checked={row.ActiveStatus == "1" ? true : false}/>
        //                     <span class="slider round"></span>
        //             </label>

        //         </>


        //     ),
        // },
        // {
        //     dataField: 'actions',
        //     text: 'Actions',
        //     formatter: (cell, row) => (
        //         <div>
        //             <span data-toggle="tooltip" data-placement="top" title="Edit">
        //                 <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
        //             </span>
        //             <span data-toggle="tooltip" data-placement="top" title="Delete">
        //                 <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
        //             </span>

        //         </div>
        //     ),
        // },
        // {
        //     dataField: 'prefix',
        //     text: 'Trading On/Off'
        // },
  ];

    return (
   <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Trading Status" button_status={false}  >

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

        // <Content Page_title="Signals">
        //     <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        // </Content>
        // )
}


export default TradingStatus;


