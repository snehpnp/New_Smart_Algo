/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import TableWithButtons from "../../../Components/ExtraComponents/Tables/TableWithIconButtons"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


const FullDataTable = ({ tableData, TableColumns, tableoptions }) => {



    //  No Data Image
    const NoDataIndication = () => (
        <>
            <img src='../../../../assets/images/norecordfound.png' alt="sss"
                className='mx-auto d-flex'
            />
        </>
    );


    const options = {
        sizePerPage: 5,
        hidePageListOnlyOnePage: false,
        ...tableoptions
    };


    return <>
        <BootstrapTable
            keyField="id"
            data={tableData}
            columns={TableColumns}
            pagination={paginationFactory(options)}
            noDataIndication={() => <NoDataIndication />}
            headerClasses="bg-primary text-primary text-center header-class"
            rowClasses='text-center'


        />

    </>
}


export default FullDataTable


