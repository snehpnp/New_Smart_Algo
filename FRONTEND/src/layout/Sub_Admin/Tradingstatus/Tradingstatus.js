// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../Utils/Loader'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
// import { GET_ALL_CLIENTS } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import { Get_All_TRADINGSTATUS_USER, user_activity_logs } from '../../../ReduxStore/Slice/Users/TradingStatusSlice'

import { useDispatch, useSelector } from "react-redux";
// import Modal from '../../../../Components/ExtraComponents/Modal';
import { fDate, fDateTimeSuffix } from '../../../Utils/Date_formet';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



const TradingStatus = () => {

    const dispatch = useDispatch()

    const user_Id = JSON.parse(localStorage.getItem('user_details')).user_id;


    const [first, setfirst] = useState('all')

    const [DateFilter, setDateFilter] = useState();
    const [DateArray, setDateArray] = useState([]);


    const [getAllUserTrading_status, setAllUserTrading_status] = useState({
        loading: true,
        data: []
    });
    const [userLogs, setUserLogs] = useState({
        loading: true,
        data: []
    });



    let req = {
        user_Id: user_Id,
    };

    const data1 = async () => {
        await dispatch(Get_All_TRADINGSTATUS_USER(req)).unwrap()
            .then((response) => {
                if (response.status) {

                    if (first === "all") {
                        setAllUserTrading_status({
                            loading: false,
                            data: response.data
                        });
                    }
                    let abc = response.data.filter((item) => {
                        return item.createdAt.split("T")[0] === first
                    })
                    setAllUserTrading_status({
                        loading: false,
                        data: abc
                    });
                }
            })
        await dispatch(user_activity_logs(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    setUserLogs({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data1()
    }, [first])
    const data2 = async () => {

        await dispatch(user_activity_logs(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    setUserLogs({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data2()
    }, [])

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'createdAt',
            text: 'Time',
            formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),

        },
        {
            dataField: 'login_status',
            text: 'login status',
            formatter: (cell, row) => (
                <>
                    <div>
                        <span data-toggle="tooltip" data-placement="top" title="Delete">
                            {row.login_status == null ? row.trading_status : row.login_status}
                        </span>

                    </div>

                </>


            ),
        },

        {
            dataField: 'role',
            text: 'role'
        },
        {
            dataField: 'system_ip',
            text: 'system_ip'
        },

    ];

    const columns1 = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'createdAt',
            text: 'Time',
            formatter: (cell, row, rowIndex) => fDateTimeSuffix(cell),

        },
        {
            dataField: 'Strategy',
            text: 'Strategy',
            formatter: (cell, row) => (
                <>
                    <div>
                        {cell ? cell : "-"}
                    </div>

                </>


            ),
        },
        {
            dataField: 'message',
            text: 'Update',
            formatter: (cell, row) => (
                <>
                    <div>
                        {cell ? cell : "-"}
                    </div>
                </>
            ),
        },
        {
            dataField: 'quantity',
            text: 'Qty',
            formatter: (cell, row) => (
                <>
                    <div>
                        {cell ? cell : "-"}
                    </div>
                </>
            ),
        },

        {
            dataField: 'system_ip',
            text: 'IP'
        },
        {
            dataField: 'device',
            text: 'Device'
        },

    ];


    var dateArray = [];
    const dateArr = () => {
        for (let i = 0; i < 3; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - i);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;  // Months are zero-based, so add 1
            const year = currentDate.getFullYear();
            const formattedDate = `${year}-${month}-${day}`;
            dateArray.push(formattedDate);

        }
        setDateArray(dateArray)
        setfirst(dateArray[0])
    }
    useEffect(() => {
        dateArr()
    }, [])

    return (
        <>
            {
                getAllUserTrading_status.loading ? <Loader /> :
                    <>
                        <Content Page_title="Trading Status" button_status={false}>

                            <Tabs
                                defaultActiveKey="home"
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="home" title="Panel Trading Status">
                                    <div className="col-lg-6">
                                        <div className="mb-3 row">
                                            <div className="col-lg-7">
                                                <select
                                                    className="default-select wide form-control"
                                                    id="validationCustom05"
                                                    onChange={(e) => setfirst(e.target.value)}
                                                >

                                                    {/* <option selected value="all">
                                                All
                                            </option> */}
                                                    {DateArray && DateArray.map((item) => {
                                                        return <>
                                                            <option value={item}>{item}</option>
                                                        </>
                                                    })}

                                                </select>

                                            </div>
                                        </div>
                                    </div>
                                    {
                                        getAllUserTrading_status.data && getAllUserTrading_status.data.length === 0 ? (
                                            <FullDataTable TableColumns={columns} tableData={getAllUserTrading_status.data} />
                                        ) :
                                            <>
                                                <FullDataTable TableColumns={columns} tableData={getAllUserTrading_status.data} />
                                            </>
                                    }
                                </Tab>
                                <Tab eventKey="profile" title="Update Status">
                                    {
                                        getAllUserTrading_status.data && getAllUserTrading_status.data.length === 0 ? (
                                            <FullDataTable TableColumns={columns1} tableData={userLogs.data} />
                                        ) :
                                            <>
                                                <FullDataTable TableColumns={columns1} tableData={userLogs.data} />
                                            </>
                                    }s
                                </Tab>

                            </Tabs>

                        </Content>
                    </>
            }



        </ >
    )

}


export default TradingStatus

