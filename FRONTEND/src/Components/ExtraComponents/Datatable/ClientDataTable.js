import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Loader from "../../../Utils/Loader";

const FullDataTable = ({
  tableData,
  TableColumns,
  keyField,
  rowStyle,
  onPageChange,
  paginationData,
}) => {
  const NoDataIndication = () => (
    <div className="text-center">
      <img
        src="../../../../assets/images/norecordfound.png"
        alt="No Records Found"
        className="mx-auto d-flex"
      />
      <p>No records available</p>
    </div>
  );

  const options = {
    sizePerPage: paginationData?.limit || 10, // Items per page
    page: paginationData?.page || 1, // Current page
    totalSize: paginationData?.total || 0, // Total number of records
    hideSizePerPage: false, // Show dropdown for selecting page size
    showTotal: true, // Show total records
    sizePerPageList: [
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
    ],
    withFirstAndLast: true, // Show First and Last page buttons
    alwaysShowAllBtns: true, // Ensure Previous/Next are always shown
    onPageChange: (page, sizePerPage) => onPageChange(page, sizePerPage),
    onSizePerPageChange: (sizePerPage, page) => onPageChange(page, sizePerPage),
  };
  

  return (
    <>
      <div>
        {tableData.loading ? (
          <Loader />
        ) : (
          <BootstrapTable
          keyField={keyField || "id"}
          data={tableData.data || []}
          columns={TableColumns}
          pagination={paginationFactory(options)}
          noDataIndication={() => <NoDataIndication />}
          headerClasses="bg-primary text-primary text-center header-class"
          rowClasses="text-center"
          rowStyle={rowStyle}
        />
        
        )}
      </div>
    </>
  );
};

export default FullDataTable;
