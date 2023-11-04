import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import Loader from '../../../Utils/Loader'
import { fa_time, fDateTimeSuffix } from '../../../Utils/Date_formet'
import { Pencil, Trash2 } from 'lucide-react';
import { Get_All_Signals } from '../../../ReduxStore/Slice/Admin/SignalsSlice'
import { Get_Sevan_Tradehisotry } from '../../../ReduxStore/Slice/Admin/TradehistorySlice'
import { CreateSocketSession, ConnctSocket, GetAccessToken, } from "../../../Service/Alice_Socket";


import { useDispatch, useSelector } from "react-redux";



const Open_Position = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem("user_details")).token;

    const [ForGetCSV, setForGetCSV] = useState([])
    const [UserDetails, setUserDetails] = useState([]);
    const [DateFilter, setDateFilter] = useState();
    const [DateArray, setDateArray] = useState([]);


    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'createdAt',
            text: 'Signals Time',
            formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>
        },
        {
            dataField: 'entry_type',
            text: 'Type'
        },
        {
            dataField: 'trade_symbol',
            text: 'Symbol'
        },
        {
            dataField: 'entry_price',
            text: 'Price'
        },

        {
            dataField: 'strategy',
            text: 'Strategy',
        },
        // {
        //     dataField: 'strategy',
        //     text: 'Squre Off',
        //     formatter: (cell, row) => ( <div> <button
        //         className={`btn btn-success`} > SQURE OFF</button></div>)

        // },
    ];



    const [SignalsData, getSignalsData] = useState({
        loading: true,
        data: []
    });



    const getsignals = async () => {
        await dispatch(Get_Sevan_Tradehisotry({ startDate: DateFilter, token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    getSignalsData({
                        loading: false,
                        data: response.data
                    });
                } else {
                    getSignalsData({
                        loading: false,
                        data: response.data
                    });

                }
            })







    }
    useEffect(() => {
        getsignals()
    }, [DateFilter])

    var dateArray = [];
    const dateArr = () => {
        for (let i = 0; i < 3; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - i);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
            const year = currentDate.getFullYear();
            const formattedDate = `${year}/${month}/${day}`;
            dateArray.push(formattedDate);

        }
        setDateArray(dateArray)
        setDateFilter(dateArray[0])
    }
    useEffect(() => {
        dateArr()
    }, [])



    const forCSVdata = () => {

        let csvArr = []
        if (SignalsData.data.length > 0) {
            SignalsData.data.map((item) => {
                return csvArr.push({
                    "symbol": item.trade_symbol,
                    "EntryType": item.entry_type ? item.entry_type : "-",
                    "ExitType": item.exit_type ? item.exit_type : "-",
                    "Entry Price": item.entry_price,
                    "Entry Qty": item.entry_qty_percent,
                    "Exit Price": item.exit_price ? item.exit_price : "-",
                    "Exit Qty": item.exit_qty_percent ? item.exit_qty_percent : "-",
                    "Entry Time": item.entry_dt_date,
                    "Exit Time": item.exit_dt_date ? item.exit_dt_date : "-",
                    "Exchange": item.exchange,
                    "Strategy": item.strategy,
                })
            })
            setForGetCSV(csvArr)
        }
    }

    useEffect(() => {
        forCSVdata()
    }, [SignalsData.data])




    //  GET_USER_DETAILS
    const UserBrokerDetails = async () => {
        const response = await GetAccessToken({ broker_name: "aliceblue" });

        if (response.status) {
            setUserDetails(response.data[0]);
        }

    };
    useEffect(() => {
        UserBrokerDetails();
    }, []);











    return (


        <Content Page_title="Open_Position" button_status={false}
            show_csv_button={true} csv_data={ForGetCSV} csv_title="LastWeekEntry"
        >
            {/* <div className='d-flex'> */}

            {/* <div className="col-lg-6">
                                    <div className="mb-3 row">
                                        <div className="col-lg-7">
                                            <select
                                                className="default-select wide form-control"
                                                id="validationCustom05"
                                                onChange={(e) => setDateFilter(e.target.value)}
                                            >
                                                <option disabled> Please Select Date </option>

                                                {DateArray && DateArray.map((item) => {
                                                    return <>
                                                        <option value={item.toString()}>{item.toString()}</option>
                                                    </>
                                                })}
                                            </select>
                                        </div>

                                    </div>
                                </div> */}
            {/* </div> */}

            <div style={{ marginTop: '50px' }}>

                <FullDataTable TableColumns={columns} tableData={SignalsData.data} />
            </div>

        </Content>

    );


}

export default Open_Position;
