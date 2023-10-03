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

    const [first, setfirst] = useState('USER')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });


    const data = async () => {
        await dispatch(GET_ALL_TRADING_STATUS({ Role: first })).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllClients({
                        loading: false,
                        data: response.data
                    });
                } else {
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
    }, [first])

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
            dataField: 'login_status',
            text: 'Login And Trading  Status',
            // formatter: (cell, row) => cell == null || "" ? "-" : cell
            formatter: (cell, row) => row.login_status == null ? row.trading_status : row.login_status
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


    ];

    var RoleArr = ["ADMIN", "USER", "SUBADMIN"]

    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Trading Status" button_status={false}  >
                            <div className="col-lg-6">
                                <div className="mb-3 row">
                                    <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => setfirst(e.target.value)}
                                        >
                                            <option disabled>
                                                Please Select Catagory
                                            </option>
                                            {/* <option selecte d value="all">
                                                All
                                            </option> */}
                                            {RoleArr && RoleArr.map((item) => {
                                                return <>
                                                    <option value={item}>{item}</option>
                                                </>
                                            })}

                                        </select>

                                    </div>
                                </div>
                            </div>

                            <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
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


