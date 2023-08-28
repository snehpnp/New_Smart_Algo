/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content"
import Loader from '../../../../Utils/Loader'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2, LayoutList, Users } from 'lucide-react';
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable"
import { Get_All_Service, Get_All_Catagory, Service_By_Catagory, GET_ALL_GROUP_SERVICES } from '../../../../ReduxStore/Slice/Admin/AdminSlice'
import { useDispatch, useSelector } from "react-redux";
import Modal from '../../../../Components/ExtraComponents/Modal';


const ServicesList = () => {

    const dispatch = useDispatch()

    const [first, setfirst] = useState('all')
    const [showModalForService, setshowModalForService] = useState(false)
    const [showModalForCients, setshowModalForCients] = useState(false)




    const [AllGroupServices, setAllGroupServices] = useState({
        loading: true,
        data: []
    });

    console.log("AllGroupServices", AllGroupServices);

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
                    <span
                        className="btn  btn-color"
                        onClick={(e) => setshowModalForService(true)}
                    >
                        <LayoutList size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Clients Using',
            formatter: (cell, row) => (
                <div>
                    <span
                        className="btn  btn-color"
                        onClick={(e) => setshowModalForCients(true)}
                    >
                        <Users size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>
                </div>
            ),
        },
        {
            dataField: 'actions',
            text: 'Actions',
            formatter: (cell, row) => (
                <div>
                    <Link to="/admin/groupservices/edit" state={row}>
                        <span data-toggle="tooltip" data-placement="top" title="Edit">
                            <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                            <>{cell}</>
                        </span>
                    </Link>
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

                                {/*  For Show Service  */}
                                {
                                    showModalForService ?
                                        <>
                                            < Modal isOpen={showModalForService} backdrop="static" size="md" title="Services" btn_name="Verify"
                                                handleClose={() => setshowModalForService(false)}
                                                closeButton
                                            >


                                            </Modal >
                                        </>
                                        : ""
                                }

                                {/*  For Show Users Which Is Use Thier Services */}

                                {
                                    showModalForCients ?
                                        <>
                                            < Modal isOpen={showModalForCients} backdrop="static" size="sm" title="Client List " btn_name="Verify"
                                                handleClose={() => setshowModalForCients(false)}
                                                closeButton
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
