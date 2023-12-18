import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import TableWithButtons from "../../../Components/ExtraComponents/Tables/TableWithIconButtons"
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';



const BasicDataTable = ({ tableData, TableColumns, tableoptions, rowStyle }) => {



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

    return <>
        <div className='table-responsive'>
            <BootstrapTable
                keyField="id"
                data={tableData}
                columns={TableColumns}
                // pagination={paginationFactory(options)}
                noDataIndication={() => <NoDataIndication />}
                headerClasses="bg-primary text-primary text-center header-class"
                rowClasses={`text-center ${rowStyle}`}

            />

        </div>
    </>
}

export default BasicDataTable