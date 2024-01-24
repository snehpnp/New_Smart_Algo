/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import * as  valid_err from "../../../Utils/Common_Messages"
import { Link } from "react-router-dom";
import Loader from '../../../Utils/Loader'
import { FolderLock, Plus, FileClock, HelpingHand, Users2,Link2, ScrollText } from 'lucide-react';
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable"
import { All_Panel_List, Update_Panel_Theme, Close_Admin_Panel, GET_PANEL_INFORMATIONS, All_Brokers } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";
import * as Config from "../../../Utils/Config";

import { Get_All_Theme } from '../../../ReduxStore/Slice/ThemeSlice';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import toast, { Toaster } from 'react-hot-toast';

import SidebarPermission from './Sidebar_permission';
import PanelDetails from './PanelDetails';


import AddLicence from './Add_Licence';
import LicenceDetails from './LicenceDetails';
import BrokerPermittion from './Broker_Permittion';
import html2canvas from 'html2canvas';


const AllPermitions = () => {

    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem('user_details')).token


    //  for permission
    const [showModal, setshowModal] = useState(false)

    //  for Panel Details
    const [PanelDetailsModal, setPanelDetailsModal] = useState(false)

    //  for Show Clients
    const [ShowClientsModal, setShowClientsModal] = useState(false)
    const [ShowClientsList, setShowClientsList] = useState([])


    //  for Subadmins
    const [showSubadminsModal, setshowSubadminsModal] = useState(false)
    const [ShowSubadminList, setShowSubadminList] = useState([])

    //  for Add Licence
    const [showAddLicenceModal, setshowAddLicenceModal] = useState(false)
    const [showPanelName, setshowPanelName] = useState(false)


    //  for Add Licence
    const [showLicenceModal, setshowLicenceModal] = useState(false)
    const [showLicenceDetails, setshowLicenceDetails] = useState([])

    // For Admin Help
    const [getAdminHelps, setGetAdminelp] = useState('')

    //  for Broker Permission
    const [showBrokerModal, setshowBrokerModal] = useState(false)
    const [showBrokerDetails, setshowBrokerDetails] = useState("")


    // const [Panelid, setPanelid] = useState('1')
    const [themeList, setThemeList] = useState();
    const [refresh, setRefresh] = useState(false)


    const [panelData, setPanelData] = useState({
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
                setPanelData({
                    loading: false,
                    data: response.data
                });
            })
    }

    const Panel_Info = async (row) => {
        setshowLicenceDetails({ id: row._id, db_url: row.db_url, db_name: row.db_name })
        setshowLicenceModal(true)
    }




    useEffect(() => {
        data()
        GetAllThemes()
    }, [refresh])





  



    // const panelDetails = (panel_id) => {
    //     setPanelid(panel_id)
    //     setshowModal(true)
    // }


   

    const CloseCompany = async (status) => {

        const req = {
            "domain": Config.react_domain,
            "status": status ? 1 : 0
        }


        await dispatch(Close_Admin_Panel(req)).unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success(response.msg);
                    setRefresh(!refresh)
                } else {
                    toast.error(response.msg);
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
            dataField: 'panel_name',
            text: 'Panel Name', 
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <Link to={`${row.domain}`}>
                        {row.panel_name}
                    </Link>
                </span>
            ) 
        },

        {
            dataField: 'Broker',
            text: 'Broker',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Sidebar Permission">
                    <FolderLock size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => { setshowBrokerModal(true); setshowBrokerDetails(row) }}
                    />
                </span>
            )
        },
        {
            dataField: 'panel_name',
            text: 'Permission',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Sidebar Permission">
                    <FolderLock size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => { setshowPanelName({ rowdata: row, panel_name: row.panel_name, id: row._id, db_url: row.db_url, db_name: row.db_name, key: row.key }); setshowModal(true) }}
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
                        // onClick={(e) => { setshowLicenceModal(true) }}
                        onClick={(e) => Panel_Info(row)}
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
                        className="mx-1" />
                </span>
            )
        },

        {
            dataField: 'panel_name',
            text: 'Clients',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <Link to={`/super/showclient`} state={row}>
                        <Users2 size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </Link>
                </span >
            )
        },

        {
            dataField: 'panel_name',
            text: 'Subadmins',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Panel Views">
                    <Link to='/super/subadminlist' state={row}>
                        <Users2 size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </Link>
                </span >
            )
        },
        {
            dataField: 'panel_name',
            text: 'Add Licence',
            formatter: (cell, row) => (
                <span data-toggle="tooltip" data-placement="top" title="Add Licence">
                    <Plus size={20} color="#198754" strokeWidth={2} className="mx-1"
                        onClick={(e) => { setshowPanelName({ panel_name: row.panel_name, id: row._id, db_url: row.db_url, db_name: row.db_name, key: row.key }); setshowAddLicenceModal(true) }}
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
                <span data-toggle="tooltip" data-placement="top" title="HelpingHand">
                    <Link to='/super/helps' state={row}>
                        <HelpingHand size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </Link>
                </span >
            )
        },
    ];


    const SaveSS = async () => {
        const element = document.getElementById('main-wrapper');


        const options = {
            width: document.documentElement.scrollWidth, // Set custom width
            height: document.documentElement.scrollHeight, // Set custom height
        };


        window.scrollTo(0, 0);

        var screenshotUrl
        await html2canvas(document.documentElement, options).then(canvas => {
            // Convert canvas to an image and download it
            const screenshot = canvas.toDataURL('image/png');
            screenshotUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = screenshot;
            link.download = 'screenshot.png';
            link.click();

        })
    }




    return (
        <>
            {
                panelData.loading ? <Loader /> :
                    <>
                        <Content Page_title="Admin Permission" button_status={false}>
                            <button onClick={() => SaveSS()}>click</button>

                            {
                                panelData.data && panelData.data.length === 0 ? (
                                    'No data found') :
                                    <>
                                        <SidebarPermission showPanelName={showPanelName} showModal={showModal} setshowModal={() => setshowModal(false)} />
                                        <BrokerPermittion List={showBrokerDetails} showModal={showBrokerModal} setshowModal={() => setshowBrokerModal(false)} />
                                        <PanelDetails showModal={PanelDetailsModal} data={panelInfo && panelInfo} setshowModal={() => setPanelDetailsModal(false)} />
                                        <AddLicence showPanelName={showPanelName} showModal={showAddLicenceModal} setshowModal={() => setshowAddLicenceModal(false)} />
                                        <LicenceDetails id={showLicenceDetails} showModal={showLicenceModal} setshowModal={() => setshowLicenceModal(false)} />
                                        <FullDataTable TableColumns={columns} tableData={panelData.data}  pagination1={true} />
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
