import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';


const HelpCenter = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'username',
            text: 'User Name'
        },
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: 'mobile',
            text: 'Mobile'
        },
        {
            dataField: 'message',
            text: 'Message'
        },
    ];

    return (
        <Content Page_title="Signals">
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Content>
        )
}


export default HelpCenter;
