import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';


const TradeHistory = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,

        },
        {
            dataField: 'panel_name',
            text: 'Signals time'
        },
        {
            dataField: 'prefix',
            text: 'Symbol'
        },
        {
            dataField: 'Action',
            text: 'Strategy',
        },
        {
            dataField: 'prefix',
            text: 'Type'
        },
        {
            dataField: 'prefix',
            text: 'Quantity'
        },
        {
            dataField: 'Action',
            text: 'Entry Price',
        },
        {
            dataField: 'Action',
            text: 'Exit Price',
        },
        {
            dataField: 'Action',
            text: 'P&L',
        },
        {
            dataField: 'Action',
            text: 'Cumulative P&L',
        },
    ];

    return (
        <Content Page_title="Trade History">
            <BasicDataTable tableData={columns} TableColumns={columns} dropdown={false} />
        </Content>
        )
}


export default TradeHistory;
