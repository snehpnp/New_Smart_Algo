/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable"

import { Pencil, Trash2, UserPlus, LayoutList } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"

import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';
import { Get_All_Strategy, Remove_Strategy_BY_Id, Get_client_By_strategy_Id } from '../../../../ReduxStore/Slice/Admin/StrategySlice';
import TableWIthCustomPaginations from '../../../../Components/ExtraComponents/Tables/TableWIthCustomPaginations';

import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";


const ServicesList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user_token = JSON.parse(localStorage.getItem("user_details")).token

    const [showModal, setshowModal] = useState(false)


    const [refresh, setRefresh] = useState(false);




    const [AllStrategy, setAllStrategy] = useState({
        loading: true,
        data: []
    });

    const [getServicesName, setServicesName] = useState({
        loading: true,
        data: []
    })

    console.log("getServicesName", getServicesName);
    const data = async () => {
        await dispatch(Get_All_Strategy({
            req: {
                "page": "1",
                "limit": "100"
            }, token: user_token
        })).unwrap().then((response) => {
            console.log("response", response);
            if (response.status) {
                setAllStrategy({
                    loading: false,
                    data: response.data
                });
            }
        })
    }

    useEffect(() => {
        data()
    }, [])




    //  For Remove Strategy
    // Remove_Strategy_BY_Id

    const RemoveStrategy = async (strat_id) => {

        if (window.confirm("Do you want to delete this ?")) {

            await dispatch(Remove_Strategy_BY_Id({
                _id: strat_id,
                token: user_token
            })).unwrap().then((response) => {


                if (response.status) {
                    toast.success(response.msg);
                    setRefresh(!refresh)
                    setTimeout(() => {
                        navigate("/admin/strategies")
                    }, 1000);
                }
                else {
                    toast.error(response.msg);
                }
            })

        }
    }



    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'strategy_name',
            text: 'Strategy Name'
        },
        {
            dataField: 'strategy_description',
            text: 'Strategy Description',
            width: '550px',

        },
        // {
        //     dataField: 'strategy_category',
        //     text: 'Strategy Catagory ',
        // },
        {
            dataField: 'strategy_segment',
            text: 'Segment',
        },
        // {
        //     dataField: 'strategy_tester',
        //     text: 'Strategy Tester ',
        // },
        // {
        //     dataField: 'strategy_indicator',
        //     text: 'Strategy Indicator ',
        // },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div className='d-flex'>
                    <span data-toggle="tooltip" data-placement="top" title="Get Clients">
                        <UserPlus size={20} strokeWidth={2} className="mx-1" onClick={(e) => GetAllServicesName(row)} />
                    </span>
                    {/* <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <LayoutList size={20} strokeWidth={2} className="mx-1" />
                    </span> */}
                    <Link to={`/admin/strategies/edit/${row._id}`} state={row}>
                        <span data-toggle="tooltip" data-placement="top" title="Edit">
                            <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                            <>{cell}</>
                        </span>
                    </Link>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" onClick={() => RemoveStrategy(row._id)} />
                    </span>
                </div>
            ),
        },
    ];





    // GET ALL GROUP SERVICES NAME
    const GetAllServicesName = async (row) => {
        console.log("row", row);

        await dispatch(Get_client_By_strategy_Id({
            _id: row._id, token: user_token
        })).unwrap()
            .then((response) => {
                setshowModal(true)

                if (response.status) {
                    setServicesName({
                        loading: false,
                        data: response.data
                    });
                }
                else {
                    setServicesName({
                        loading: false,
                        data: []
                    });

                }
            })
    }


    return (
        <>
            {
                AllStrategy.loading ? <Loader /> :
                    <>
                        <Content Page_title="All Strategy" button_title="Add Strategy" route="/admin/strategies/add">
                            {
                                AllStrategy.data && AllStrategy.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={AllStrategy.data} />
                                    </>

                            }
                            <ToastButton />


                            {
                                showModal ?
                                    <>
                                        <Modal isOpen={showModal} size="ms-5" title="Clients" hideBtn={true}
                                            // onHide={handleClose}
                                            handleClose={() => setshowModal(false)}
                                        >
                                            <BasicDataTable TableColumns={[
                                                {
                                                    dataField: "index",
                                                    text: "SR. No.",
                                                    formatter: (cell, row, rowIndex) => rowIndex + 1,
                                                },
                                                {
                                                    dataField: 'users.UserName',
                                                    text: 'user Name'
                                                },
                                                {
                                                    dataField: 'users.license_type',
                                                    text: 'lotsize',
                                                    formatter: (cell, row, rowIndex) => <>
                                                        <span>{cell === "2" ? "LIVE" : cell === "1" ? "DEMO" : "2 Days"}</span>
                                                    </>,

                                                },
                                            ]} tableData={getServicesName && getServicesName.data} />

                                        </Modal >
                                    </>
                                    : ""
                            }
                        </Content>
                    </>
            }




        </ >
    );
}


export default ServicesList
