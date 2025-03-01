/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Loader from '../../../../Utils/Loader'
import { Link, useNavigate } from "react-router-dom";
import { GO_TO_DASHBOARDS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { Pencil, Trash2, GanttChartSquare } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable"
import { GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice';
import { GET_ALL_SERVICES_NAMES, DELETE_GROUP_SERVICE, Get_client_By_strategy_Id, GET_ALL_SERVICES_USER_NAMES } from '../../../../ReduxStore/Slice/Admin/GroupServiceSlice';
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
    const [showDeletModal, setShowDeletModal] = useState(false)
    const [searchInput, setSearchInput] = useState("");
    const [originalData, setOriginalData] = useState([]);
    const [test, settest] = useState(false)
    const [refresh, setrefresh] = useState(false)
    const [getServicesName, setServicesName] = useState({loading: true, data: [] })
    const [getServicesuserName, setServicesuserName] = useState([])
    const [AllGroupServices, setAllGroupServices] = useState({loading: true, data: []});


    useEffect(() => {
        data()
    }, [refresh])

    useEffect(() => {
        const filteredData = originalData.filter((item) => {
            return (
                item.name.toLowerCase().includes(searchInput.toLowerCase())
            );
        });
        setAllGroupServices({
            loading: false,
            data: searchInput ? filteredData : originalData,
        });
    }, [searchInput, originalData]);


    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            sort: true,
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'name',
            text: 'Group Services Name',
            sort: true,

        },
        {
            dataField: 'resultCount',
            text: 'Service Count',
            sort: true,

        },
        {
            dataField: 'categoryResult.segment',
            text: 'Services',
            sort: true,

            formatter: (cell, row) => (
                <div>
                    <GanttChartSquare onClick={(e) => GetAllServicesName(row)} size={20} color="#198754" strokeWidth={2} className="mx-1" />

                </div>
            ),
        },
        {
            dataField: 'dsd',
            text: 'Client Using',
            sort: true,
            formatter: (cell, row) => (
                <div>
                    <GanttChartSquare size={20} onClick={(e) => GetAllServicesUserName(row)} color="#198754" strokeWidth={2} className="mx-1" />
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            sort: true,

            formatter: (cell, row) => (
                <div>

                    <Link to={`/admin/groupservices/edit/${row._id}`} data-toggle="tooltip" data-placement="top" title="Edit">
                        < Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </Link>
                    <span data-toggle="tooltip" data-placement="top" title=" Delete">
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" onClick={(e) => DeleteGroup(row)} />
                    </span>

                </div>
            ),
        },
    ];


    // GET ALL GROUP SERVICES NAME
    const GetAllServicesName = async (row) => {
        setshowModal(true)
        await dispatch(GET_ALL_SERVICES_NAMES({
            data: row
        })).unwrap()
            .then((response) => {
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

    const GetAllServicesUserName = async (row) => {
        await dispatch(GET_ALL_SERVICES_USER_NAMES({
            _id: row._id
        })).unwrap()
            .then((response) => {
            
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
                    localStorage.setItem("page", "groupservices");

                    navigate("/client/dashboard")

                }
            })

    }

    // DELETE GROUP
    const DeleteGroup = async (row) => {
        setShowDeletModal(true)
        var req = {
            id: row._id
        }
        await dispatch(DELETE_GROUP_SERVICE(req)).unwrap()
            .then((response) => {
     
                if (response.status) {
                    toast.success(response.msg)
                    setrefresh(!refresh)
                    // window.location.reload()
                } else {

                    toast.error(response.msg)
                }
            })

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
                    setOriginalData(response.data);

                } else {
                    setAllGroupServices({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }

    const ResetDate = (e) => {
        e.preventDefault();
        setSearchInput("");
    };

    return (
        <>
            {
                AllGroupServices.loading ? <Loader /> :
                    <>
                        <Content Page_title="Group Service" button_title="Add Group" route="/admin/groupservices/add">

                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="mb-3">
                                        <label htmlFor="exampleFormControlInput1" className="form-label">
                                            Search Something Here
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                        />
                                    </div>
                                </div>

                                <div className="col-lg-2 mt-3">
                                    <button
                                        className="btn btn-primary mt-2"
                                        onClick={(e) => ResetDate(e)}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <FullDataTable TableColumns={columns} tableData={AllGroupServices.data} />

                            {
                                showModal ?
                                    <>
                                        <Modal isOpen={showModal} backdrop="static" size="xxl" title="Services" hideBtn={true}
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
                                                    dataField: 'data.name',
                                                    text: 'Services Name'
                                                },
                                                {
                                                    dataField: 'data1.group_qty',
                                                    text: 'group_qty'
                                                },
                                            ]} tableData={getServicesName && getServicesName.data} />

                                        </Modal >
                                    </>
                                    : ""
                            }



                            {
                                test ?
                                    <>
                                        <Modal isOpen={test} backdrop="static" size="xl" title="Clients Using" hideBtn={true}
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
                                                                className={`btn  ${row.user.AppLoginStatus == '1' || row.user.WebLoginStatus == '1' ? "btn-success" : "btn-danger"} btn-new-block`}

                                                                onClick={() => goToDashboard(row)}
                                                                disabled={row.user.AppLoginStatus === '0' && row.user.WebLoginStatus === '0'}

                                                            > click</button>
                                                        </>
                                                },
                                                
                                                {
                                                    dataField: 'user.license_type',
                                                    text: 'License Type',
                                                    formatter: (cell, row, rowIndex) => cell === '2' ? "Live" : cell === '1' ? "Demo" : "2 Days Only"
                                                },
                                            ]} tableData={getServicesuserName && getServicesuserName.data} />
                                        </Modal >
                                    </>
                                    : ""
                            }

                            {showDeletModal == true ?
                                <div
                                    className="modal custom-modal fade modal-delete"
                                    id="delete_modal"
                                    role="dialog"
                                >
                                    <div className="modal-dialog modal-dialog-centered modal-md">
                                        <div className="modal-content">
                                            <div className="modal-body">
                                                <div className="form-header">
                                                    <div className="delete-modal-icon">
                                                        <span>
                                                            <i className="fe fe-check-circle" />
                                                        </span>
                                                    </div>
                                                    <h3>Are You Sure?</h3>
                                                    <p>You want delete company</p>
                                                </div>
                                                <div className="modal-btn delete-action">
                                                    <div className="modal-footer justify-content-center p-0">
                                                        <button
                                                            type="submit"
                                                            data-bs-dismiss="modal"
                                                            className="btn btn-primary paid-continue-btn me-2"
                                                        >
                                                            Yes, Delete
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-bs-dismiss="modal"
                                                            className="btn btn-back cancel-btn"
                                                        >
                                                            No, Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : ''
                            }

                        </Content>
                        <ToastButton />
                    </>
            }
        </ >
    );
}


export default ServicesList
