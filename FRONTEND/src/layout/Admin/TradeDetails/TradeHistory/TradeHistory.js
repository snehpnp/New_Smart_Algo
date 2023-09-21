// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_Tradehisotry } from '../../../../ReduxStore/Slice/Admin/TradehistorySlice'
import { useDispatch, useSelector } from "react-redux";
import { fa_time, fDateTimeSuffix } from '../../../../Utils/Date_formet'
import { Eye, CandlestickChart, Pencil } from 'lucide-react';
import DetailsView from './DetailsView';



const TradeHistory = () => {


    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem("user_details")).token;


    const [showModal, setshowModal] = useState(false)


    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [disableFromDate, setDisableFromDate] = useState(false);

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);

        setDisableFromDate(true);
    };



    const [tradeHistoryData, setTradeHistoryData] = useState({
        loading: true,
        data: []
    });


    const [tradeHistoryData1, setTradeHistoryData1] = useState({
        loading: true,
        data: []
    });


    console.log("tradeHistoryData", tradeHistoryData)



    const getsignals = async (e) => {
        let startDate = getActualDateFormate(fromDate)
        let endDate = getActualDateFormate(toDate)

        e.preventDefault()

        await dispatch(Get_Tradehisotry({ startDate: startDate, endDate: endDate, token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    setTradeHistoryData({
                        loading: false,
                        data: response.data
                    });
                }
            })
        // }
    }




    const getsignals11 = async (e) => {
        let abc = new Date()
        let month = abc.getMonth() + 1
        let date = abc.getDate()
        let year = abc.getFullYear()
        let full = `${year}/${month}/${date}`
        await dispatch(Get_Tradehisotry({ startDate: full, endDate: full, token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    setTradeHistoryData({
                        loading: false,
                        data: response.data
                    });
                    setTradeHistoryData1({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }

    useEffect(() => {
        getsignals11()
    }, [])


    const getActualDateFormate = (date) => {
        const dateParts = date.split('-');
        const formattedDate = `${dateParts[0]}/${parseInt(dateParts[1], 10)}/${parseInt(dateParts[2], 10)}`;
        return formattedDate
    }

    const ResetDate = (e) => {
        e.preventDefault()
        setFromDate("")
        setToDate("")
        setTradeHistoryData({
            loading: false,
            data: tradeHistoryData1.data
        });
    }

    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'createdAt',
            text: 'Signals time',
            formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>
        },
        {
            dataField: 'trade_symbol',
            text: 'Symbol'
        },
        {
            dataField: 'entry_qty_percent',
            text: 'Entry',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
                </span>
        },
        {
            dataField: 'exit_qty_percent',
            text: 'Exit Qty',
            formatter: (cell, row, rowIndex) => <span className='text'>
                {cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
            </span>
        },
        {
            dataField: 'entry_price',
            text: 'Entry Price',
            formatter: (cell, row, rowIndex) => <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
        },
        {
            dataField: 'exit_price',
            text: 'Exit Price',
            formatter: (cell, row, rowIndex) => <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
        },
        {
            dataField: 'Action',
            text: 'R/P&L',
        },
        {
            dataField: 'Action',
            text: 'U/P&l',
        },

        {
            dataField: 'Action',
            text: 'T/P&L',
        },
        {
            dataField: 'strategy',
            text: 'Strategy',
        },

        {
            dataField: '',
            text: 'Details View',
            formatter: (cell, row, rowIndex) => <div>
                <Eye className='mx-2'
                    onClick={() => setshowModal(true)}
                />
            </div>
        },
    ];




    return (


        <>
            <Content Page_title="All Services" button_status={false}>
                <div className="row d-flex  align-items-center justify-content-start">
                    <div className="col-lg-3">
                        <div className="form-check custom-checkbox mb-3">
                            <label className="col-lg-6" htmlFor="fromdate">
                                From Date
                            </label>
                            <input
                                type="date"
                                name="fromdate"
                                className="form-control"
                                id="fromdate"
                                value={fromDate}
                                onChange={handleFromDateChange}
                            // min={new Date().toISOString().split('T')[0]} // Disable past dates
                            // disabled={disableFromDate}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="form-check custom-checkbox mb-3">
                            <label className="col-lg-6" htmlFor="endDate">
                                To Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                className="form-control"
                                id="endDate"
                                value={toDate}
                                onChange={handleToDateChange}
                                min={
                                    // new Date().toISOString().split('T')[0] &&
                                    fromDate} // Disable past dates
                            />
                        </div>
                    </div>
                    <div className="col-lg-3 d-flex">
                        <button className="btn btn-primary mx-2" onClick={(e) => getsignals(e)}>Search</button>
                        <button className="btn btn-primary" onClick={(e) => ResetDate(e)}>Reset</button>
                    </div>
                </div>

                {
                    tradeHistoryData.data && tradeHistoryData.data.length === 0 ? (
                        <FullDataTable TableColumns={columns} tableData={tradeHistoryData.data} />
                    )
                        :
                        <>
                            <FullDataTable TableColumns={columns} tableData={tradeHistoryData.data} />
                        </>
                }

                {/*  For Detailed View  */}
                <DetailsView showModal={showModal} setshowModal={() => setshowModal(false)} tradeHistoryData={tradeHistoryData} />
            </Content>
        </ >

    )
}


export default TradeHistory;



