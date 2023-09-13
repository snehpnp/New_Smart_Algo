// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'


const TradeHistory = () => {
    const columns = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },

        {
            dataField: 'prefix',
            text: 'Symbol'
        },
        {
            dataField: 'Action',
            text: 'Lot',
        },
        {
            dataField: 'prefix',
            text: 'Lot Size'
        },
        {
            dataField: 'prefix',
            text: 'Type'
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



