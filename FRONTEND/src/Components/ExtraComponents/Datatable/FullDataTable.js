/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import TableWithButtons from "../../../Components/ExtraComponents/Tables/TableWithIconButtons"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


const FullDataTable = ({ tableData, TableColumns, tableoptions , }) => {




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
        hidePageListOnlyOnePage: false,
        ...tableoptions
    };



    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".csv";
    // console.log("apiData", apiData);
    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };


    return <>
        <div className='table-responsive'>

            <BootstrapTable
                keyField="id"

                data={tableData}
                columns={TableColumns}
                pagination={paginationFactory(options)}
                noDataIndication={() => <NoDataIndication />}
                headerClasses="bg-primary text-primary text-center header-class"
                rowClasses='text-center'
            />

        </div>
    </>
}


export default FullDataTable
