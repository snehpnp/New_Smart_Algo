import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';


const Signals = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'panel_name',
            text: 'Signals ID'
        },
        {
            dataField: 'panel_name',
            text: 'Signals time'
        },
        {
            dataField: 'prefix',
            text: 'Type'
        },
        {
            dataField: 'prefix',
            text: 'Symbol'
        },
        {
            dataField: 'prefix',
            text: 'Message'
        },
        {
            dataField: 'Action',
            text: 'Price',
        },
        {
            dataField: 'Action',
            text: 'Strategy',
        },
    ];

    return (
        <Content Page_title="Signals">
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Content>
        )
}


export default Signals
