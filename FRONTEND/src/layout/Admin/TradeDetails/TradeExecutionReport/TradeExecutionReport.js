import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';


const TradeExecutionReport = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'panel_name',
            text: 'Time'
        },
        {
            dataField: 'panel_name',
            text: 'Symbol'
        },
        {
            dataField: 'prefix',
            text: 'Type'
        },
        {
            dataField: 'prefix',
            text: 'Strategy'
        },
        {
            dataField: 'prefix',
            text: 'Price'
        },
        {
            dataField: 'prefix',
            text: 'Order status'
        },
        {
            dataField: 'prefix',
            text: 'View'
        },
    ];

    return (
        <Content Page_title="Signals">
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Content>
        )
}


export default TradeExecutionReport;
