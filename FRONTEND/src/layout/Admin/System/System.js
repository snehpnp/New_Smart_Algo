/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import FullDataTable from '../../../Components/ExtraComponents/Datatable/FullDataTable'
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { GET_COMPANY_INFOS } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content"
import { Pencil, Trash2 } from 'lucide-react';
import $ from "jquery"


import UpdateCompanyInfo from './UpdateCompanyInfo';
import UpdateImages from './UpdateImages';
import UpdateSmptDetails from './UpdateSmptDetails';

import { useDispatch, useSelector } from "react-redux";

const System = () => {




    const dispatch = useDispatch()
    const [getCompanyName, setCompanyName] = useState({
        loading: true,
        data: []
    });


    //  for Panel Details
    const [PanelDetailsModal, setPanelDetailsModal] = useState(false)

    //  for Show Clients
    const [ShowEmailModal, setShowEmailModal] = useState(false)
    //  for Subadmins
    const [showImgModal, setshowImgModal] = useState(false)


    const CompanyName = async () => {
        await dispatch(GET_COMPANY_INFOS()).unwrap()
            .then((response) => {
                if (response.status) {
                     
                    setCompanyName({
                        loading: false,
                        data: response.data
                    });
                    $(".set_Favicon")

                    let favicon = $("link[rel='icon']").length
                        ? $("link[rel='icon']")
                        : $("<link rel='icon' type='image/x-icon' />");
                    favicon.attr('href', response.data && response.data[0].favicon);
                    $('head').append(favicon);
                }
            })
    }
    useEffect(() => {
        CompanyName()
    }, [])

    const Company_columns = [
        {
            dataField: 'index',
            text: 'Company ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'panel_name',
            text: 'Company Name'
        },
        {
            dataField: 'panel_short_name',
            text: 'Panel Key'
        },
        {
            dataField: 'panel_short_name',
            text: 'Company Short Name'
        },
        // {
        //     dataField: 'broker_url',
        //     text: 'Broker Name'
        // },
        {
            dataField: 'prefix',
            text: 'Version'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => setPanelDetailsModal(true)} />
                    </span>

                </div>
            ),
        },
    ];

    const Email_columns = [
        {
            dataField: 'id',
            text: 'Email ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: 'cc_mail',
            text: 'CC'
        },
        {
            dataField: 'bcc_mail',
            text: 'BCC'
        },
        {
            dataField: 'smtp_password',
            text: 'Password'
        },
        {
            dataField: 'smtphost',
            text: 'SMTP Host'
        },
        {
            dataField: 'smtpport',
            text: 'SMTP Port'
        },
        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => setShowEmailModal(true)} />
                    </span>

                </div>
            ),
        },
    ];


    const background_images = [
        {
            dataField: 'id',
            text: 'ID',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },

        {
            dataField: 'favicon',
            text: 'Favicon',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Favicon" className="logo-abbr w-25" width="100" height='100' />
            ),
        },
        {
            dataField: 'logo',
            text: 'Logo',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Logo" className='logo-abbr w-25' width="100" height='100' />
            ),
        },
        {
            dataField: 'loginimage',
            text: 'Login Image',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Login Image" className='logo-abbr w-25' width="100" height='100' />
            ),
        },
        {
            dataField: 'watermark',
            text: 'Water Mark',
            formatter: (cell, row, rowIndex) => (
                <img src={cell} alt="Water Mark" className='logo-abbr ' width="100" height='100' />
            ),
        },

        {
            dataField: 'Action',
            text: 'Action',
            formatter: (cell, row) => (
                <div>
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" onClick={() => setshowImgModal(true)} />
                    </span>

                </div>
            ),
        },
    ];
    return <>
        <Content Page_title="System" button_status={false}>


            <h2>Company Information</h2>
            <BasicDataTable tableData={getCompanyName.data} TableColumns={Company_columns} dropdown={false} />
            <br />

            <h2>Email Information</h2>
            <BasicDataTable tableData={getCompanyName.data} TableColumns={Email_columns} dropdown={false} />
            <br />

            <h2>Background Images</h2>
            <BasicDataTable tableData={getCompanyName.data} TableColumns={background_images} dropdown={false} />


            <UpdateCompanyInfo data={getCompanyName && getCompanyName.data} showModal={PanelDetailsModal} setshowModal={() => setPanelDetailsModal(false)} />
            <UpdateSmptDetails data={getCompanyName && getCompanyName.data} showModal={ShowEmailModal} setshowModal={() => setShowEmailModal(false)} />
            <UpdateImages data={getCompanyName && getCompanyName.data} showModal={showImgModal} setshowModal={() => setshowImgModal(false)} />
            <br />

        </Content>
    </>
}


export default System

