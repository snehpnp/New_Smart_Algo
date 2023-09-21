import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable"
import { fa_time, fDateTimeSuffix } from '../../../Utils/Date_formet'


const DetailsView = ({ showModal, setshowModal, tradeHistoryData }) => {


    const columns1 = [
        {
            dataField: 'index',
            text: 'S.No.',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },

        {
            dataField: 'trade_symbol',
            text: 'Symbol'
        },
        {
            dataField: 'exchange',
            text: 'Exchange'
        },
        {
            dataField: 'segment',
            text: 'Segment'
        },
        {
            dataField: 'entry_type',
            text: 'Entry Type',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell !== "" ? cell : "-"}

                </span>
        },
        {
            dataField: 'exit_type',
            text: 'Exit Type',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell !== "" ? cell : "-"}
                </span>

        },
        {
            dataField: 'entry_qty_percent',
            text: 'Entry',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
                </span>
        },
        {
            dataField: 'exit_qty_percent',
            text: 'Exit Qty',
            formatter: (cell, row, rowIndex) => <span className='text'>
                {cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
            </span>
        },
        {
            dataField: 'entry_price',
            text: 'Entry Price',
            formatter: (cell, row, rowIndex) => <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>

        },
        {
            dataField: 'exit_price',
            text: 'Exit Price',
            formatter: (cell, row, rowIndex) => <div>{cell !== "" ? parseFloat(cell).toFixed(2) : "-"}</div>
        },
        {
            dataField: 'Action',
            text: 'R/P&L',
        },
        {
            dataField: 'Action',
            text: 'U/P&l',
        },

        {
            dataField: 'Action',
            text: 'T/P&L',
        },
        {
            dataField: 'strategy',
            text: 'Strategy',
        },
        {
            dataField: 'createdAt',
            text: 'Signals time',
            formatter: (cell, row, rowIndex) => <div>{fDateTimeSuffix(cell)}</div>
        },
    ];


    return (
        <div>   <Modal isOpen={showModal} size="xl" title="Licence Details" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <BasicDataTable TableColumns={columns1} tableData={tradeHistoryData.data} />
        </Modal ></div>
    )
}

export default DetailsView