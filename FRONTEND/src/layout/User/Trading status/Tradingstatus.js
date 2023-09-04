// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
// import Content from "../../../Components/Dashboard/Content/Content"
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
// import { GET_ALL_CLIENTS } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import { Get_All_TRADINGSTATUS_USER } from '../../../ReduxStore/Slice/User/userSlice'

import { useDispatch, useSelector } from "react-redux";
// import Modal from '../../../../Components/ExtraComponents/Modal';


const TradingStatus = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });
    const [getAllUserTrading_status, setAllUserTrading_status] = useState({
        loading: true,
        data: []
    });

    let req = {
        user_Id: '64c76f3032067577d02310e6',
    };

    const data1 = async () => {
        await dispatch(Get_All_TRADINGSTATUS_USER(req)).unwrap()
            .then((response) => {
                console.log("response", response);
                if (response.status) {
                    setAllUserTrading_status({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {

        data1()
    }, [first])

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'createdAt',
            text: 'Time'
        },
        {
            dataField: 'login_status',
            text: 'login status',
            formatter: (cell, row) => (
                <>
                    <div>
                        <span data-toggle="tooltip" data-placement="top" title="Delete">
                            {row.login_status == null ? row.trading_status:row.login_status }
                        </span>

                    </div>

                </>


            ),
        },
        // {
        //     dataField: 'trading_status',
        //     text: 'trading_status'
        // },
        {
            dataField: 'role',
            text: 'role'
        },
        {
            dataField: 'system_ip',
            text: 'system_ip'
        },

    ];
    return (
        <>
            {
                getAllUserTrading_status.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Trading Status" button_status={false}>

                            <div className="col-lg-6">
                                <div className="mb-3 row">
                                    <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => setfirst(e.target.value)}
                                        >

                                            <option selected value="all">
                                                All
                                            </option>
                                            {getAllUserTrading_status.data && getAllUserTrading_status.data.map((item) => {
                                                return <>
                                                    <option value={item._id}>{item.FullName}</option>
                                                </>
                                            })}

                                        </select>

                                    </div>
                                </div>
                            </div>
                            {
                                getAllUserTrading_status.data && getAllUserTrading_status.data.length === 0 ? (
                                    'No data found') :
                                    <>

                                        <FullDataTable TableColumns={columns} tableData={getAllUserTrading_status.data} />
                                    </>
                            }
                        </Theme_Content>
                    </>
            }



        </ >
    )

}


export default TradingStatus

