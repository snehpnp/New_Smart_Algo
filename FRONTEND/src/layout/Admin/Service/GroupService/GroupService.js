/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { GO_TO_DASHBOARDS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'


import { Pencil, Trash2, GanttChartSquare } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable"

import { Get_All_Service, Get_All_Catagory, Service_By_Catagory, GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { GET_ALL_SERVICES_NAMES, DELETE_GROUP_SERVICE, Get_client_By_strategy_Id , GET_ALL_SERVICES_USER_NAMES } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';
import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
const ServicesList = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)
    const [showModaluser, setshowModaluser] = useState(false)

    const [test, settest] = useState(false)


    const [refresh, setrefresh] = useState(false)
    const [getServicesName, setServicesName] = useState({
        loading: true,
        data: []
    })
    const [getServicesuserName, setServicesuserName] = useState([])
    const [AllGroupServices, setAllGroupServices] = useState({
        loading: true,
        data: []
    });


    console.log("getServicesName", getServicesName)



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
                    <GanttChartSquare onClick={(e) => GetAllServicesName(row)} size={20} color="#198754" strokeWidth={2} className="mx-1" />
                </div>
            ),
        },
        {
            dataField: 'dsd',
            text: 'Client Using',
            formatter: (cell, row) => (
                <div>
                    {/* <button
                        className="btn  btn-color"
                        onClick={(e) => GetAllServicesUserName(row)}
                    >
                        OKK */}
                    <GanttChartSquare size={20} onClick={(e) => GetAllServicesUserName(row)} color="#198754" strokeWidth={2} className="mx-1" />

                    {/* </button> */}
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div>

                    <Link to={`/admin/groupservices/edit/${row._id}`} data-toggle="tooltip" data-placement="top" title="Delete">
                        < Pencil size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                    </Link>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Trash2 size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={(e) => DeleteGroup(row)} />
                    </span>

                </div>
            ),
        },
    ];








    // GET ALL GROUP SERVICES NAME
    const GetAllServicesName = async (row) => {
        console.log("row", row);

        await dispatch(GET_ALL_SERVICES_NAMES({
            data: row
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

    // GET ALL GROUP SERVICES USER NAME
    const GetAllServicesUserName = async (row) => {
        await dispatch(GET_ALL_SERVICES_USER_NAMES({
            _id: row._id
        })).unwrap()
            .then((response) => {
                console.log("123", response);
                settest(true);
                if (response.status) {
                    setServicesuserName({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setServicesuserName({
                        loading: false,
                        data: []
                    });

                }
            })
    }

    // GO TO  CLIENT  DASHBOARD
    const goToDashboard = async (email) => {
        let req = {
            Email: email.user.Email,

        };
        await dispatch(GO_TO_DASHBOARDS(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    localStorage.setItem("gotodashboard", JSON.stringify(true));
                    localStorage.setItem("user_details_goTo", JSON.stringify(response.data));
                    localStorage.setItem("user_role_goTo", JSON.stringify(response.data.Role));
                    navigate("/client/dashboard")

                }
            })

    }

    // DELETE GROUP
    const DeleteGroup = async (row) => {

        if (window.confirm("Do You Really Want To Delete ??")) {
            var req = {
                id: row._id
            }
            await dispatch(DELETE_GROUP_SERVICE(req)).unwrap()
                .then((response) => {
                    console.log("response", response)
                    if (response.status) {
                        toast.success(response.msg)
                        setrefresh(!refresh)
                        // window.location.reload()
                    } else {

                        toast.error(response.msg)
                    }
                })
        }
    }

    // GET ALL GROUP SERVICES NAME
    const data = async () => {
        await dispatch(GET_ALL_GROUP_SERVICES()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllGroupServices({
                        loading: false,
                        data: response.data
                    });
                } else {
                    setAllGroupServices({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }


    useEffect(() => {
        data()
    }, [refresh])

    return (
        <>
            {
                AllGroupServices.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="Group Service" button_title="Add Group" route="/admin/groupservices/add">
                            {
                                AllGroupServices.data && AllGroupServices.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={AllGroupServices.data} />

                                    </>
                            }



                            {/* {
                                showModal ?
                                    <>
                                        <Modal isOpen={showModal} backdrop="static" size="ms-5" title="Servics" hideBtn={true}
                                            // onHide={handleClose1}
                                            handleClose={setshowModal(false)}
                                        >
                                            <BasicDataTable TableColumns={[
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
                                            ]} tableData={getServicesName && getServicesName.data} />
                                        </Modal >
                                    </>
                                    : ""
                            } */}


                            {
                                showModal ?
                                    <>
                                        <Modal isOpen={showModal} backdrop="static" size="ms-5" title="Services" hideBtn={true}
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
                                                    dataField: 'name',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'lotsize',
                                                    text: 'lotsize'
                                                },
                                            ]} tableData={getServicesName && getServicesName.data} />

                                        </Modal >
                                    </>
                                    : ""
                            }



                            {
                                test ?
                                    <>
                                        <Modal isOpen={test} backdrop="static" size="ms-5" title="Clients Using" hideBtn={true}
                                            // onHide={handleClose}
                                            handleClose={() => settest(false)}
                                        >
                                            <BasicDataTable TableColumns={[
                                                {
                                                    dataField: "index",
                                                    text: "SR. No.",
                                                    formatter: (cell, row, rowIndex) => rowIndex + 1,
                                                },
                                                {
                                                    dataField: 'user.FullName',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'user.TradingStatus',
                                                    text: 'Go To Dashboard',
                                                    formatter: (cell, row, rowIndex) =>
                                                        <>
                                                            <button
                                                                className={`btn  ${row.AppLoginStatus === '0' && row.WebLoginStatus === '0' ? "btn-success" : "btn-danger"} btn-new-block`}

                                                                onClick={() => goToDashboard(row)}
                                                                disabled={row.AppLoginStatus === '0' && row.WebLoginStatus === '0'}

                                                            > click</button>
                                                        </>
                                                },
                                                {
                                                    dataField: 'user.license_type',
                                                    text: 'Services Name',
                                                    formatter: (cell, row, rowIndex) => cell === '2' ? "Live" : cell === '1' ? "Demo" : "2 Days Only"
                                                },
                                            ]} tableData={getServicesuserName && getServicesuserName.data} />
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
