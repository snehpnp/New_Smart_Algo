/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2, GanttChartSquare } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable"

import { Get_All_Service, Get_All_Catagory, Service_By_Catagory, GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { GET_ALL_SERVICES_NAMES, DELETE_GROUP_SERVICE, GET_ALL_SERVICES_USER_NAMES } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';
import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
const ServicesList = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)
    const [showModaluser, setshowModaluser] = useState(false)

    const [getrefresh, setrefresh] = useState(false)
    const [getServicesName, setServicesName] = useState([])
    const [getServicesuserName, setServicesuserName] = useState([])
    const [AllGroupServices, setAllGroupServices] = useState({
        loading: true,
        data: []
    });

    
    const handleClose = () => setshowModal(false);
    const handleClose1 = () => setshowModaluser(false);




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
                    // onClick={(e) => setshowModal(true)}
                    >
                        <GanttChartSquare onClick={(e) => GetAllServicesName(row)} size={20} color="#198754" strokeWidth={2} className="mx-1" />

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
                        onClick={(e) => setshowModaluser(true)}
                    >
                        <GanttChartSquare onClick={(e) => GetAllServicesUserName(row)} size={20} color="#198754" strokeWidth={2} className="mx-1" />

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

    // GET ALL GROUP SERVICES NAME
    const GetAllServicesName = async (row) => {

        await dispatch(GET_ALL_SERVICES_NAMES({
            data: row
        })).unwrap()
            .then((response) => {
                if (response.status) {
                    setshowModal(true);
                    setServicesName({
                        loading: false,
                        data: response
                    });
                }
            })
    }

    // GET ALL GROUP SERVICES USER NAME
    const GetAllServicesUserName = async (row) => {
        setshowModal(true);
        //     await dispatch(GET_ALL_SERVICES_USER_NAMES({
        //         data: row
        //     })).unwrap()
        //         .then((response) => {
        //             console.log("123", response);
        //             if (response.status) {
        //                 console.log("responseresponseresponse", response.data);

        //                 // setServicesuserName(response.data);


        //             }
        //         })
    }

    // DELETE GROUP
    const DeleteGroup = async (row) => {

        var req = {
            id: row._id
        }
        await dispatch(DELETE_GROUP_SERVICE(req)).unwrap()
            .then((response) => {
                if (response.status) {

                    toast.success("Done")
                    // window.location.reload()
                } else {

                    toast.error(response.msg)
                }
            })
    }


    useEffect(() => {
        data()
    }, [])

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
                                        < Modal isOpen={showModal} backdrop="static" size="ms-5" title="Services" hideBtn={true} onHide={handleClose}
                                        >
                                            <BasicDataTable TableColumns={[
                                                {
                                                    dataField: "index",
                                                    text: "SR. No.",
                                                    formatter: (cell, row, rowIndex) => rowIndex + 1,
                                                },
                                                {
                                                    dataField: 'name',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'lotsize',
                                                    text: 'lotsize'
                                                },

                                            ]} tableData={getServicesName && getServicesName.data.data} />

                                            <button onClick={handleClose}>off</button>
                                        </Modal >
                                    </>
                                    : ""
                            }
                            {
                                showModaluser ?
                                    <>
                                        < Modal isOpen={showModaluser} backdrop="static" size="ms-5" title="Services" hideBtn={true} onHide={handleClose1}
                                        >
                                            {/* <BasicDataTable TableColumns={[
                                                {
                                                    dataField: "index",
                                                    text: "SR. No.",
                                                    formatter: (cell, row, rowIndex) => rowIndex + 1,
                                                },
                                                {
                                                    dataField: 'user_id',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'user_id',
                                                    text: 'lotsize'
                                                },

                                            ]} tableData={ getServicesuserName.data} /> */}

                                            <button onClick={handleClose1}>off</button>
                                        </Modal >
                                    </>
                                    : ""
                            }
                        </Theme_Content>
                        <ToastButton />
                    </>
            }



        </ >
    );
}


export default ServicesList
