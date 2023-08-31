// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { Get_All_SUBADMIN_CLIENT } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { Get_All_SUBADMIN } from '../../../../ReduxStore/Slice/Subadmin/Subadminslice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const SubadminClient = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });
    const [getAllsubadmins, setAllsubadmins] = useState({
        loading: true,
        data: []
    });

    const data = async () => {
        await dispatch(Get_All_SUBADMIN_CLIENT()).unwrap()
            .then((response) => {
                if (response.status) {
                    if (first == "all") {
                        setAllClients({
                            loading: false,
                            data: response.data
                        });
                    } else {
                        var filter_data = response.data.filter((data) => {
                            return data.parent_id == first
                        })

                        setAllClients({
                            loading: false,
                            data: filter_data
                        });
                    }

                }
            })
    }
    const data1 = async () => {
        await dispatch(Get_All_SUBADMIN()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllsubadmins({
                        loading: false,
                        data: response.data
                    });
                }
            })
    }
    useEffect(() => {
        data()
        data1()
    }, [first])

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'UserName',
            text: 'User Name'
        },
        {
            dataField: 'Email',
            text: 'Email'
        },
        {
            dataField: 'PhoneNo',
            text: 'Phone Number'
        },
        {
            dataField: 'Otp',
            text: 'Password'
        },
        {
            dataField: 'ActiveStatus',
            text: 'Status',
            formatter: (cell, row) => (
                <>
                    <label class="switch" >
                        <input type="checkbox" className="bg-primary" checked={row.ActiveStatus == "1" ? true : false} />
                        <span class="slider round"></span>
                    </label>

                </>


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
                        <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                    </span>

                </div>
            ),
        },
    ];
    return (
        <>
            {
                getAllClients.loading ? <Loader /> :
                    <>
                        <Theme_Content Page_title="All Subadmin Clients" button_status={false}>
                            
                            <div className="col-lg-6">
                                <div className="mb-3 row">
                                    <div className="col-lg-7">
                                        <select
                                            className="default-select wide form-control"
                                            id="validationCustom05"
                                            onChange={(e) => setfirst(e.target.value)}
                                        >
                                            <option disabled>
                                                Please Select Catagory
                                            </option>
                                            <option selected value="all">
                                                All
                                            </option>
                                            {getAllsubadmins.data && getAllsubadmins.data.map((item) => {
                                                return <>
                                                    <option value={item._id}>{item.FullName}</option>
                                                </>
                                            })}

                                        </select>

                                    </div>
                                </div>
                            </div>
                            {
                                getAllClients.data && getAllClients.data.length === 0 ? (
                                    'No data found') :
                                    <>

                                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                                    </>
                            }
                        </Theme_Content>
                    </>
            }



        </ >
    )

}


export default SubadminClient

