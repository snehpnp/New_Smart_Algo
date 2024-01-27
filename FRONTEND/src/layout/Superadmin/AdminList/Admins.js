/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import * as  valid_err from "../../../Utils/Common_Messages"

import Loader from '../../../Utils/Loader'
import { Pencil, Trash2, Pointer } from 'lucide-react';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { All_Panel_List, Update_Panel_Theme, Close_Admin_Panel } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Theme } from '../../../ReduxStore/Slice/ThemeSlice';
import Modal from '../../../Components/ExtraComponents/Modal';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useFormik } from 'formik';
import toast from 'react-hot-toast';


import Formikform from "../../../Components/ExtraComponents/Form/Formik_form"


const AdminsList = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem('user_details')).token


    const [showModal, setshowModal] = useState(false)
    const [Panelid, setPanelid] = useState('')
    const [themeList, setThemeList] = useState();


    const [themeData, setThemeData] = useState({
        loading: true,
        data: []
    });




    const GetAllThemes = async () => {
        await dispatch(Get_All_Theme()).unwrap()
            .then((response) => {
                setThemeList(response && response.data);
            })
    }

    const data = async () => {
        await dispatch(All_Panel_List()).unwrap()
            .then((response) => {

                setThemeData({
                    loading: false,
                    data: response.data
                });
            })
    }
    useEffect(() => {
        data()
        GetAllThemes()
    }, [])




    const panelDetails = (panel_id) => {
        
        setPanelid(panel_id)
        setshowModal(true)
    }


    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'panel_name',
            text: 'Panel Name'
        },
        {
            dataField: 'domain',
            text: 'Domain Name'
        },

        {
            dataField: 'port',
            text: 'Port No'
        },
        {
            dataField: 'key',
            text: 'Key'
        },

        {
            dataField: 'is_active',
            text: 'Close Panel',
            formatter: (cell, row) => (
                <label class="toggle mt-3">
                    <input class="toggle-checkbox bg-primary" type="checkbox"
                        defaultChecked={row.is_active == 0}
                        onChange={(e) => CloseCompany(row.domain, e.target.checked)}
                    />
                    <div class={`toggle-switch bg-primary`}></div>
                </label>
            )
        },


        {
            dataField: 'a',
            text: 'Update Theme',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Edit">
                    <Pointer size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => panelDetails(row._id)} />
                </span>
            ),
        },

        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (



                <div style={{ width: "120px" }}>
                    <div>
                        <Link to={`/super/panel/edit/${row._id}`} state={row}>
                            <span data-toggle="tooltip" data-placement="top" title="Edit">
                                <Pencil
                                    size={20}
                                    color="#198754"
                                    strokeWidth={2}
                                    className="mx-1"
                                />
                            </span>
                        </Link>


                        {0 == "1" ?
                            <Link>
                                <span data-toggle="tooltip" data-placement="top" title="Delete">
                                    <Trash2
                                        size={20}
                                        color="#d83131"
                                        strokeWidth={2}
                                        className="mx-1"
                                    // onClick={(e) => Delete_user(row._id)}
                                    />
                                </span>
                            </Link>
                            : ""}

                    </div>
                </div>
            ),
        },
    ];





    const formik = useFormik({
        initialValues: {
            theme_update: null,

        },
        validate: (values) => {
            const errors = {};
            if (!values.theme_update) {
                errors.theme_update = valid_err.THEMESELECT_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {
            

            const req = {
                userid: Panelid,
                theme_id: values.theme_update,
                token: token

            }

            await dispatch(Update_Panel_Theme(req)).unwrap()
                .then((response) => {
                    // console.log("response", response);
                    if (response.status) {
                        toast.success(response.msg)
                        setshowModal(false)

                    }
                })
        }
    });


    const fields = [
        {
            name: 'theme_update',
            label: 'Theme',
            type: 'select',
            options:
                themeList && themeList.map((item) => ({ label: item.theme_name, value: item._id }))
            ,
            // showWhen: values => values.licence === '2'
        },

    ];



    const CloseCompany = async (domain, status) => {

        const req = {
            "domain": domain,
            "status": status ? 0 : 1
        }


        await dispatch(Close_Admin_Panel(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success(response.msg);
                    // setRefresh(!refresh)
                } else {
                    toast.error(response.msg);
                }
            })
    }

    return (
        <>
            {
                themeData.loading ? <Loader /> :
                    <>
                        <Content Page_title="Company Names"
                            button_title="Add Client"
                            route="/super/panel/add">
                            {
                                themeData.data && themeData.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <FullDataTable TableColumns={columns} tableData={themeData.data} pagination1={true} />

                                        <Modal isOpen={showModal} backdrop="static" size="sm" title="Update Company Theme" hideBtn={true}
                                            handleClose={() => setshowModal(false)}
                                        >

                                            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update Theme"
                                                title="update_theme"
                                            />
                                        </Modal >

                                        <ToastButton />

                                    </>
                            }
                        </Content>
                    </>
            }
        </ >
    );
}


export default AdminsList
