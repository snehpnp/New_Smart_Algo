import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import FullDataTable from '../../../Components/ExtraComponents/Datatable/FullDataTable'
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { GET_COMPANY_INFOS } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import { Pencil, Trash2 } from 'lucide-react';

import { useDispatch, useSelector } from "react-redux";

const System = () => {


    const dispatch = useDispatch()
    const [getCompanyName, setCompanyName] = useState({
        loading: true,
        data: []
    });


    const CompanyName = async () => {
        await dispatch(GET_COMPANY_INFOS()).unwrap()
            .then((response) => {
                if (response.status) {
                    setCompanyName({
                        loading: false,
                        data: response.data
                    });
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
            dataField: 'prefix',
            text: 'Company Short Name'
        },
        {
            dataField: 'prefix',
            text: 'Broker Name'
        },
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
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
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
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>

                </div>
            ),
        },
    ];
    return <>
        <Content Page_title="System">


            <h2>Company Information</h2>
            <BasicDataTable tableData={getCompanyName.data} TableColumns={Company_columns} dropdown={false} />
            <br />

            <h2>Email Information</h2>
            <BasicDataTable tableData={getCompanyName.data} TableColumns={Email_columns} dropdown={false} />
            <br />

        </Content>
    </>
}


export default System


