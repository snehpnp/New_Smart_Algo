import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"

import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_HELPS } from '../../../ReduxStore/Slice/Admin/AdminHelpSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../Components/ExtraComponents/Modal';

import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Get_Option_Symbols_Expiry, Get_Option_Symbols } from '../../../ReduxStore/Slice/Common/Option_Chain_Slice';






const HelpCenter = () => {

    const dispatch = useDispatch()



    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id
    const token = JSON.parse(localStorage.getItem("user_details")).token


    const [first, setfirst] = useState('all')

    const [All_Symbols, set_All_Symbols] = useState({
        loading: false,
        data: []
    });

    const [symbol, setSymbol] = useState('')


    console.log("All_Symbols", All_Symbols)

    const data = [
        {
            index: 1,
            email: 'test@gmail.com',

        }]


    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'email',
            text: 'User Name',
            formatter: (cell, row) => (
                <>
                    <div className='button-grp-bs border rounded d-flex justify-content-between w-75 mx-auto'>
                        <button className='btn text-success'> <i className="fa-solid fa-money-bill pe-2"></i>Buy</button>
                        <button className='btn text-danger'> <i className="fa-solid fa-money-bill pe-2"></i>Sell</button>
                    </div>
                </>
            ),
        },
        {
            dataField: 'email',
            text: 'Email',
            formatter: (cell, row) => (
                <>
                    <div className='button-grp-bs border rounded d-flex justify-content-between w-75 mx-auto'>
                        <button className='btn text-success' style={{ color: 'green' }}>Buy</button>
                        <button className='btn text-danger'> Sell</button>
                    </div>
                </>
            ),
        },
        {
            dataField: 'email',
            text: 'Phone Number'
        },
        {
            dataField: 'email',
            text: 'Help Message'
        },
        {
            dataField: 'Action',
            text: 'Help Message',
            formatter: (cell, row) => (
                <>
                    <div className='d-flex'>
                        <div><button className="click-btn btn-style904" >Buy</button></div>

                        <div><button className="click-btn btn-style905" >Sell</button></div>
                    </div>

                    <div className='button-grp-bs border rounded d-flex justify-content-between w-75 mx-auto' >
                        <button className='btn text-success'> <i className="fa-solid fa-money-bill pe-2"></i>Buy</button>
                        <button className='btn text-danger'> <i className="fa-solid fa-money-bill pe-2"></i>Sell</button>
                    </div>
                </>


            ),

        },
        // {
        //     dataField: 'ActiveStatus',
        //     text: 'Status',
        //     formatter: (cell, row) => (
        //         <>
        //             <label class="switch" >
        //                 <input type="checkbox" className="bg-primary" checked={row.ActiveStatus == "1" ? true : false} />
        //                 <span class="slider round"></span>
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
    ];


    // --------------- FOR GET OPTIONS SYMBOLS -----------------------

    const symbols = async () => {

        await dispatch(Get_Option_Symbols({ req: '', token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    set_All_Symbols({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        symbols()
    }, [])



    // --------------- FOR GET OPTIONS SYMBOLS -----------------------



    // --------------- FOR GET OPTIONS SYMBOLS -----------------------

    const GetExpiry = async (value) => {

        await dispatch(Get_Option_Symbols({ req: Symbol, token: token })).unwrap()
            .then((response) => {
                if (response.status) {
                    set_All_Symbols({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        GetExpiry()
    }, [Symbol])

    // --------------- FOR GET OPTIONS SYMBOLS -----------------------









    return (
        <>
            {
                All_Symbols.loading ? <Loader /> :
                    <>
                        <Content Page_title="Help Center" button_status={false}>

                            <div className="row">
                                <div className="col-md-2 text-secondary">
                                    <label className="text-secondary"
                                        style={{ fontWeight: "bold", color: "black" }}
                                    >SYMBOLS</label>
                                    <select
                                        name="symbols_filter"
                                        className="default-select wide form-control spacing"
                                        onChange={(e) => {
                                            setSymbol(e.target.value)
                                        }}
                                        value={Symbol}
                                    >
                                        <option value="" selected disabled>--Select stock--</option>
                                        {All_Symbols.data && All_Symbols.data.map((item) => {
                                            return <option value={item.symbol}>{item.symbol}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-2 text-secondary">
                                    <label
                                        className="text-secondary"
                                        style={{ fontWeight: "bold", color: "black" }}
                                    >
                                        EXPIRY DATE
                                    </label>
                                    <select className="default-select wide form-control" name="expiry_date" onChange={(e) => {
                                        // GetExpiry(e.target.value)
                                    }}>
                                        <option value="">--Select expiry--</option>
                                        <option >26OCT2023</option>
                                        <option >02NOV2023</option>
                                        <option >09NOV2023</option>
                                        <option >16NOV2023</option>
                                        <option >23NOV2023</option>
                                        <option>30NOV2023</option>
                                    </select>
                                </div>
                                <div className="col-md-2 ">
                                    <label
                                        className="text-secondary"
                                        style={{ fontWeight: "bold", color: "black" }}
                                    >
                                        STRATEGY
                                    </label>
                                    <select className="default-select wide form-control" name="strategyname">

                                        <option value="STRAT1">STRAT1</option>
                                        <option value="MISTRY">MISTRY</option>
                                        <option value="Smart Algo">Smart Algo</option>
                                    </select>
                                </div>
                                <div className="col-md-2 text-secondary ">
                                    <label
                                        className="text-secondary"
                                        style={{ fontWeight: "bold", color: "black" }}
                                    > Price
                                    </label>
                                    <input type="number" className="new-input-control form-control" />
                                </div>
                            </div>

                            <div className='option-chain mt-5'>
                                <FullDataTable TableColumns={columns} tableData={data} ></FullDataTable>
                            </div>
                        </Content>
                    </>
            }



        </ >
    )

}


export default HelpCenter