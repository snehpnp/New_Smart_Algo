/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2, GanttChartSquare } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_Service, Get_All_Catagory, Service_By_Catagory, GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { GET_ALL_SERVICES_NAMES, DELETE_GROUP_SERVICE } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const ServicesList = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [AllGroupServices, setAllGroupServices] = useState({
        loading: true,
        data: []
    });


    const [CatagoryData, setCatagoryData] = useState({
        loading: true,
        data: []
    });




    const data = async () => {
        await dispatch(GET_ALL_GROUP_SERVICES()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllGroupServices({
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
            dataField: 'name',
            text: 'Group Services Name'
        },
        {
            dataField: 'resultCount',
            text: 'Service Count'
        },
        {
            dataField: 'categoryResult.segment',
            text: 'Services',
            formatter: (cell, row) => (
                <div>
                    <button
                        className="btn  btn-color"
                        onClick={(e) => GetAllServicesName(row)}
                    >
                        <GanttChartSquare size={20} color="#198754" strokeWidth={2} className="mx-1" />

                    </button>
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Client Using',
            formatter: (cell, row) => (
                <div>
                    <button
                        className="btn  btn-color"
                        onClick={(e) => setshowModal(true)}
                    >
                        <GanttChartSquare size={20} color="#198754" strokeWidth={2} className="mx-1" />

                    </button>
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>

                    <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <Trash2 onClick={(e) => DeleteGroup(row)} size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                    </span>

                </div>
            ),
        },
    ];

    // GET ALL GROUP SERVICES NAME
    const GetAllServicesName = async (row) => {

        // setshowModal(true);

        var req = {
            data: row
        }

        await dispatch(GET_ALL_SERVICES_NAMES(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    console.log("response", response.data);
                    // setAllGroupServices({
                    //     loading: false,
                    //     data: response.data
                    // });
                }
            })
    }

    // DELETE GROUP
    const DeleteGroup = async (row) => {
        console.log("DeleteGroup", row._id);
        var req = {
            id: row._id
        }
        await dispatch(DELETE_GROUP_SERVICE(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    console.log("response", response.data);
                    // setAllGroupServices({
                    //     loading: false,
                    //     data: response.data
                    // });
                }
            })
    }


    return (
        <>
            {
                AllGroupServices.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Group Service" button_title="Add Grouop" route="/admin/groupservices/add">

                            {
                                AllGroupServices.data && AllGroupServices.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={AllGroupServices.data} />
                                    </>
                            }
                            {
                                showModal ?
                                    <>
                                        < Modal isOpen={showModal} backdrop="static" size="sm" title="Services" btn_name="Verify"
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
    );
}


export default ServicesList
