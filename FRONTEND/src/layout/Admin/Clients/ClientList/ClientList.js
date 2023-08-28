// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'

import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form"
import { Formik, Form, Field, useFormik } from 'formik';
import { Pencil, Trash2 } from 'lucide-react';
// import * as  valid_err from "../../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../../Utils/Common_regex"

import Content from "../../../../Components/Dashboard/Content/Content"
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { GET_ALL_CLIENTS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'

import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const AllClients = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModal, setshowModal] = useState(false)

    const [getAllClients, setAllClients] = useState({
        loading: true,
        data: []
    });


    const data = async () => {
        await dispatch(GET_ALL_CLIENTS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setAllClients({
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

            name: 'api_key',
            label: formik.values.broker === 4 ? 'App Key' : formik.values.broker === 7 ? "Consumer Key" : formik.values.broker === 9 ? "Vendor Key" : formik.values.broker === 8 ? 'App Key' : formik.values.broker === 10 ? 'App Key' : "'Api Key", type: 'text',
            showWhen: values => values.broker === '4' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '12' || values.broker === '14' || values.broker === '15' || values.broker === '6'
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
                    <Link to="/admin/client/edit">
                        <span data-toggle="tooltip" data-placement="top" title="Edit Client" route>
                            <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                        </span>
                    </Link>
                    <Link to="">
                        <span data-toggle="tooltip" data-placement="top" title="Delete">
                            <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
                        </span>
                    </Link>
                </div>
            ),
            },

        {
            name: 'client_code',
            label: formik.values.broker === 1 ? 'User' : formik.values.broker === 4 ? "Client Code" : formik.values.broker === 7 ? "User Name" : formik.values.broker === 9 ? "Vander Id" : formik.values.broker === 11 ? "Client Code" : formik.values.broker === 11 ? "client_code" : 'User Id', type: 'text',
            showWhen: values => values.broker === '1' || values.broker === '5' || values.broker === '4' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '6'
        },
        {
            name: 'demat_userid',
            label: formik.values.broker === 9 ? 'User Id' : '', type: 'text',
            showWhen: values => values.broker === '9'

        },


        {
            name: 'app_id',
            label: formik.values.broker === 1 ? 'Verification Code' : formik.values.broker === 5 ? 'Password' : formik.values.broker === 7 ? 'Demat Password' : formik.values.broker === 11 ? 'Password' : formik.values.broker === 13 ? 'App Id' : formik.values.broker === 9 ? 'Password' : formik.values.broker === 14 ? 'User Id ' : 'App Id', type: 'text',
            showWhen: values => values.broker === '2' || values.broker === '1' || values.broker === "3" || values.broker === '5' || values.broker === '7' || values.broker === '9' || values.broker === '11' || values.broker === '13' || values.broker === '14'
        },



        {
            name: 'app_key',
            label: formik.values.broker === 5 || 6 ? 'App Key' : "", type: 'text',
            showWhen: values => values.broker === '5'
        },

        {
            name: 'api_secret',
            label: formik.values.broker === 1 ? 'Password Code' : formik.values.broker === 5 ? 'DOB' : formik.values.broker === 7 ? 'Consumer Secret' : formik.values.broker === 9 ? 'Encryption Secret Key' : formik.values.broker === 10 ? 'Api Secret Key' : formik.values.broker === 11 ? '2FA' : formik.values.broker === 14 ? 'Encryption Key' : 'Api Secret', type: 'text',
            showWhen: values => values.broker === '1'
                || values.broker === '2' || values.broker === '3' || values.broker === '5' || values.broker === '6' || values.broker === '7' || values.broker === '8' || values.broker === '9' || values.broker === '10' || values.broker === '11' || values.broker === '13' || values.broker === '14' || values.broker === '15',
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
                        <input type="checkbox" className="bg-primary" checked={row.ActiveStatus == "1" ? true : false}/>
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
                        <Theme_Content Page_title="All Clients" button_title="Add Client" route="/client/add">

                            {
                                getAllClients.data && getAllClients.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
                                    </>
                            }
                            {
                                showModal ?
                                    <>
                                        < Modal isOpen={showModal} backdrop="static" size="sm" title="Verify OTP" btn_name="Verify"
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
    )

}


export default AllClients

