import React from 'react'
import Modal from '../../../../Components/ExtraComponents/Modal';
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable"
import { fa_time, fDateTimeSuffix } from '../../../../Utils/Date_formet'


const DetailsView = ({ showModal, setshowModal, tradeHistoryData }) => {

    const mergedArray = [];
    
    if (tradeHistoryData && tradeHistoryData.result) {

        var data = tradeHistoryData && tradeHistoryData.result

        const leArray = [];
        const lxArray = [];
        const SeArray = [];
        const SxArray = [];

        data.forEach(record => {
            if (record.type === "LE") {
                leArray.push(record);
            } else if (record.type === "LX") {
                lxArray.push(record);
            } else if (record.type === "SE") {
                SeArray.push(record);
            } else if (record.type === "SX") {
                SxArray.push(record);
            }
        });



        if (data[0].type == "LE" || data[0].type == "LX") {
            while (leArray.length > 0 || lxArray.length > 0) {
                if (leArray.length > 0) {
                    mergedArray.push(leArray.shift());
                }

                if (lxArray.length > 0) {
                    mergedArray.push(lxArray.shift());
                }
            }
        } else if (data[0].type == "SE" || data[0].type == "SX") {

            while (SeArray.length > 0 || SxArray.length > 0) {
                if (SeArray.length > 0) {
                    mergedArray.push(SeArray.shift());
                }

                if (SxArray.length > 0) {
                    mergedArray.push(SxArray.shift());
                }
            }
        }



        console.log(mergedArray);



    }







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
            text: 'Qty Percentage',
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
            <BasicDataTable TableColumns={columns1} tableData={mergedArray} />
        </Modal ></div>
    )
}

export default DetailsView