import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';


const TradingStatus = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'panel_name',
            text: 'Name'
        },
        {
            dataField: 'panel_name',
            text: 'Username'
        },
        {
            dataField: 'prefix',
            text: 'Mobile Number'
        },
        {
            dataField: 'prefix',
            text: 'Trading On/Off'
        },
    ];

    return (
        <Content Page_title="Signals">
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Content>
        )
}


export default TradingStatus;
