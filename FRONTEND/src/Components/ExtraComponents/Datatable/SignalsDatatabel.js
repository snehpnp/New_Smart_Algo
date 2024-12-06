/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
 
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
 

const FullDataTable = ({ tableData, TableColumns, tableoptions, selectRow, keyField, pagination1, rowStyle }) => {

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





    return <>
        <div className=''>

            <BootstrapTable
                keyField={keyField ? keyField : "id"}
                data={tableData}
                columns={TableColumns}
                pagination={!pagination1 ? paginationFactory(options) : ""}
                selectRow={selectRow}
                noDataIndication={() => <NoDataIndication />}
                headerClasses="bg-primary text-primary text-center header-class"
                rowClasses={`text-center`}
                rowStyle={rowStyle}
            />
        </div>
    </>
}


export default FullDataTable