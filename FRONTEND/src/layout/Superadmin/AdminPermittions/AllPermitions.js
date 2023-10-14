/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import * as  valid_err from "../../../Utils/Common_Messages"

import Loader from '../../../Utils/Loader'
import { FolderLock, Plus, FileClock, HelpingHand, Users2, ScrollText } from 'lucide-react';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { All_Panel_List, Update_Panel_Theme, GET_PANEL_INFORMATIONS } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Theme } from '../../../ReduxStore/Slice/ThemeSlice';
import Modal from '../../../Components/ExtraComponents/Modal';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

import SidebarPermission from './Sidebar_permission';
import PanelDetails from './PanelDetails';
import ShowAllClients from './ShowAllClients';
import ShowAllSubadmins from './ShowAllSubadmins';
import AddLicence from './Add_Licence';
import LicenceDetails from './LicenceDetails';


const AllPermitions = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem('user_details')).token


    //  for permission
    const [showModal, setshowModal] = useState(false)

    //  for Panel Details
    const [PanelDetailsModal, setPanelDetailsModal] = useState(false)

    //  for Show Clients
    const [ShowClientsModal, setShowClientsModal] = useState(false)
    //  for Subadmins
    const [showSubadminsModal, setshowSubadminsModal] = useState(false)

    //  for Add Licence
    const [showAddLicenceModal, setshowAddLicenceModal] = useState(false)
    const [showPanelName, setshowPanelName] = useState(false)


    //  for Add Licence
    const [showLicenceModal, setshowLicenceModal] = useState(false)




    const [Panelid, setPanelid] = useState('')
    const [themeList, setThemeList] = useState();


    const [themeData, setThemeData] = useState({
        loading: true,
        data: []
    });


    const [panelInfo, setpanelInfo] = useState({
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

    const Panel_Info = async (row) => {

        setPanelDetailsModal(true)
        await dispatch(GET_PANEL_INFORMATIONS({ id: row._id })).unwrap()
            .then((response) => {
                console.log(":v" ,response)
                setpanelInfo({
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
        // {
        //     dataField: 'domain',
        //     text: 'Domain Name'
        // },

        {
            dataField: 'panel_name',
            text: 'Company Status',
            formatter: (cell, row) => (

                <label class="toggle mt-3">
                    <input class="toggle-checkbox bg-primary" type="checkbox"
                    // onChange={(e) => {
                    //   setShowAllStratagy(e.target.checked)
                    // }}
                    />
                    <div class={`toggle-switch bg-primary`}></div>
                </label>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Close Panel',
            formatter: (cell, row) => (
                <label class="toggle mt-3">
                    <input class="toggle-checkbox bg-primary" type="checkbox"
                    // onChange={(e) => {
                    //   setShowAllStratagy(e.target.checked)
                    // }}
                    />
                    <div class={`toggle-switch bg-primary`}></div>
                </label>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Permission',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Sidebar Permission">
                    <FolderLock size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => setshowModal(true)}
                    />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Licence Details',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <FileClock size={20} color="#198754" strokeWidth={2}
                        onClick={(e) => { setshowLicenceModal(true) }}
                        className="mx-1" />
                </span>
            )

        },
        {
            dataField: 'panel_name',
            text: 'Panel Details',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <FileClock size={20} color="#198754" strokeWidth={2}
                        onClick={(e) => Panel_Info(row)}
                        className="mx-1" />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Clients',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <Users2 size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => setShowClientsModal(true)}
                    />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Subadmins',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <Users2 size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => setshowSubadminsModal(true)}
                    />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Add Licence',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Add Licence">
                    <Plus size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => { setshowPanelName(row.panel_name); setshowAddLicenceModal(true) }}
                    />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Logs',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Admin Logs">
                    <ScrollText size={20} color="#198754" strokeWidth={2} className="mx-1" />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'HelpingHand ',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="HelpingHand ">
                    <HelpingHand size={20} color="#198754" strokeWidth={2} className="mx-1" />
                </span>
            )
        },
    ];





    // const formik = useFormik({
    //     initialValues: {
    //         theme_update: null,

    //     },
    //     validate: (values) => {
    //         const errors = {};
    //         if (!values.theme_update) {
    //             errors.theme_update = valid_err.THEMESELECT_ERROR;
    //         }
    //         return errors;
    //     },
    //     onSubmit: async (values) => {

    //         const req = {
    //             userid: Panelid,
    //             theme_id: values.theme_update,
    //             token: token

    //         }
    //         await dispatch(Update_Panel_Theme(req)).unwrap()
    //             .then((response) => {
    //                 console.log("response", response);
    //                 if (response.status) {
    //                     toast.success(response.msg)
    //                     setshowModal(false)
    //                 }
    //             })
    //     }
    // });

    // const fields = [
    //     {
    //         name: 'theme_update',
    //         label: 'Theme',
    //         type: 'select',
    //         options:
    //             themeList && themeList.map((item) => ({ label: item.theme_name, value: item._id }))
    //         ,
    //     },

    // ];




    return (
        <>
            {
                themeData.loading ? <Loader /> :
                    <>
                        <Content Page_title="Admin Permission" button_status={false}>
                            {
                                themeData.data && themeData.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <SidebarPermission showModal={showModal} setshowModal={() => setshowModal(false)} />

                                        <ShowAllSubadmins showModal={showSubadminsModal} setshowModal={() => setshowSubadminsModal(false)} />

                                        <ShowAllClients showModal={ShowClientsModal} setshowModal={() => setShowClientsModal(false)} />

                                        <PanelDetails showModal={PanelDetailsModal} data={panelInfo && panelInfo} setshowModal={() => setPanelDetailsModal(false)} />

                                        <AddLicence showPanelName={showPanelName} showModal={showAddLicenceModal} setshowModal={() => setshowAddLicenceModal(false)} />

                                        <LicenceDetails showModal={showLicenceModal} setshowModal={() => setshowLicenceModal(false)} />

                                        <FullDataTable TableColumns={columns} tableData={themeData.data} />
                                        <ToastButton />
                                    </>
                            }
                        </Content>
                    </>
            }
        </ >
    );
}


export default AllPermitions
