import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

const BasicDataTable = ({
  tableData,
  TableColumns,
  tableoptions,
  rowStyle,
  sizePerPage,
}) => {
  //  No Data Image
  const NoDataIndication = () => (
    <>
      <img
        src="../../../../assets/images/norecordfound.png"
        alt="sss"
        className="mx-auto d-flex"
      />
    </>
  );

  const options = {
    sizePerPage: sizePerPage ? sizePerPage : 10,
    hidePageListOnlyOnePage: false,
    ...tableoptions,
  };

  return (
    <>
      <div className="table-container">
        <div className="table-responsive">
          <BootstrapTable
            keyField="id"
            data={tableData}
            columns={TableColumns}
            pagination={paginationFactory(options)}
            noDataIndication={() => <NoDataIndication />}
            headerClasses="bg-primary text-primary text-center header-class "
            rowClasses={`text-center ${rowStyle}`}
          />
        </div>
      </div>
    </>
  );
};

export default BasicDataTable;
