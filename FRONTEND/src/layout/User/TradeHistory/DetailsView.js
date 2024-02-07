import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable"
import { fa_time, fDateTimeSuffix } from '../../../Utils/Date_formet'


const DetailsView = ({ showModal, setshowModal, tradeHistoryData }) => {


   // console.log("tradeHistoryData", tradeHistoryData)
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
            dataField: 'type',
            text: 'Entry Type',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell === "LE" || row.type === "SE" ? cell : "-"}

                </span>
        },
        {
            dataField: 'type',
            text: 'Exit Type',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell === "LX" || row.type === "SX" ? cell : "-"}
                </span>

        },
        {
            dataField: 'qty_percent',
            text: 'QTY',
            formatter: (cell, row, rowIndex) =>
                <span className='text'>
                    {cell !== "" ? parseFloat(cell).toFixed(2) : "-"}
                </span>
        },

        {
            dataField: 'price',
            text: 'Entry Price',
            formatter: (cell, row, rowIndex) => <div>{row.type === "LE" || row.type === "SE" ? parseFloat(cell).toFixed(2) : "-"}</div>

        },
        {
            dataField: 'price',
            text: 'Exit Price',
            formatter: (cell, row, rowIndex) => <div>{row.type === "LX" || row.type === "SX" ? parseFloat(cell).toFixed(2) : "-"}</div>

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

            <BasicDataTable TableColumns={columns1} tableData={tradeHistoryData.result} />
        </Modal ></div>
    )
}

export default DetailsView