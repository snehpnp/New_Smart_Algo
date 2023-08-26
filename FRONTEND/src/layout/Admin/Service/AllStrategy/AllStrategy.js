/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2, UserPlus, LayoutList } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"

import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';
import { Get_All_Strategy, Remove_Strategy_BY_Id } from '../../../../ReduxStore/Slice/Admin/StrategySlice';
import TableWIthCustomPaginations from '../../../../Components/ExtraComponents/Tables/TableWIthCustomPaginations';

import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";


const ServicesList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user_token = JSON.parse(localStorage.getItem("user_details")).token

    const [refresh, setRefresh] = useState(false);




    const [AllStrategy, setAllStrategy] = useState({
        loading: true,
        data: []
    });

    console.log("AllStrategy", AllStrategy);



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
    }, [refresh])




    //  For Remove Strategy
    // Remove_Strategy_BY_Id

    const RemoveStrategy = async (strat_id) => {

        await dispatch(Remove_Strategy_BY_Id({
            _id: strat_id,
            token: user_token
        })).unwrap().then((response) => {
            console.log("response", response);
            if (response.status === 409) {
                toast.error(response.data.msg);
            }
            else if (response.status) {
                toast.success(response.msg);
                setRefresh(!refresh)
                setTimeout(() => {
                    navigate("/admin/strategies")
                }, 1000);
            }

        })

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
            text: 'Strategy Description'
        },
        // {
        //     dataField: 'strategy_category',
        //     text: 'Strategy Catagory ',
        // },
        {
            dataField: 'strategy_segment',
            text: 'Strategy Segment ',
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
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <UserPlus size={20} strokeWidth={2} className="mx-1" />
                    </span>
                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <LayoutList size={20} strokeWidth={2} className="mx-1" />
                    </span>
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

                        </Content>
                    </>
            }



        </ >
    );
}


export default ServicesList
