/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import TableWithButtons from "../../../Components/ExtraComponents/Tables/TableWithIconButtons"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


const FullDataTable = ({ tableData, TableColumns, tableoptions, pagination1 }) => {

    //  No Data Image
    const NoDataIndication = () => (
        <>
            <img src='../../../../assets/images/norecordfound.png' alt="sss"
                className='mx-auto d-flex'
            />
        </>
    );


    const options = {
        sizePerPage: 10,
        hidePageListOnlyOnePage: true,
        ...tableoptions
    };



// console.log("pagination1" ,pagination1)

    return <>
        <div className=''>

            <BootstrapTable
                keyField="id"

                data={tableData}
                columns={TableColumns}
                pagination={!pagination1 ? paginationFactory(options) : ""}

                noDataIndication={() => <NoDataIndication />}
                headerClasses="bg-primary text-primary text-center header-class"
                rowClasses='text-center'
            />

        </div>
    </>
}


export default FullDataTable
