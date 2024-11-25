/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Spinner from "react-bootstrap/Spinner";

const FullDataTable = ({
  tableData,
  TableColumns,
  tableoptions,
  selectRow,
  keyField = "_id", // Default keyField to "id" if not provided
  pagination1,
  rowStyle,
  isLoading,
}) => {
  // State to handle the currently expanded row
  const [expandedRow, setExpandedRow] = useState(null);

  // No Data Image
  const NoDataIndication = () => (
    <>
      <img
        src="../../../../assets/images/norecordfound.png"
        alt="No Record Found"
        className="mx-auto d-flex"
      />
    </>
  );

  // Table options
  const options = {
    sizePerPage: 10,
    hidePageListOnlyOnePage: true,
    ...tableoptions,
  };

  // Expand row logic
  const expandRow = {
    renderer: (row) => (
<div
  style={{
    padding: "20px",
    background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
  }}
>
  <div className="row justify-content-center">
    {/* Target */}
    <div className="col-sm-6 col-md-3 mb-3">
      <div
        className="card shadow-lg border-primary"
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        <div
          className="card-body text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h5
            className="card-title text-primary"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            🎯 Target
          </h5>
          <p
            className="card-text"
            style={{ fontSize: "1rem", color: "#6c757d" }}
          >
            {row.target || "N/A"}
          </p>
        </div>
      </div>
    </div>

    {/* Stop Loss */}
    <div className="col-sm-6 col-md-3 mb-3">
      <div
        className="card shadow-lg border-danger"
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        <div
          className="card-body text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h5
            className="card-title text-danger"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            📉 Stop Loss
          </h5>
          <p
            className="card-text"
            style={{ fontSize: "1rem", color: "#6c757d" }}
          >
            {row.stop_loss || "N/A"}
          </p>
        </div>
      </div>
    </div>

    {/* Exit Time */}
    <div className="col-sm-6 col-md-3 mb-3">
      <div
        className="card shadow-lg border-success"
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        <div
          className="card-body text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h5
            className="card-title text-success"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            ⏱ Exit Time
          </h5>
          <p
            className="card-text"
            style={{ fontSize: "1rem", color: "#6c757d" }}
          >
            {row.exit_time || "N/A"}
          </p>
        </div>
      </div>
    </div>

    {/* SL Status */}
    <div className="col-sm-6 col-md-3 mb-3">
      <div
        className="card shadow-lg border-warning"
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease",
          overflow: "hidden",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.05)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1)")
        }
      >
        <div
          className="card-body text-center"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h5
            className="card-title text-warning"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            🔒 SL Status
          </h5>
          <p
            className="card-text"
            style={{ fontSize: "1rem", color: "#6c757d" }}
          >
            {row.sl_status || "N/A"}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    
    
    ),
    expanded: expandedRow ? [expandedRow] : [], // Ensure only one row is expanded
    onExpand: (row, isExpand) => {
      setExpandedRow(isExpand ? row[keyField] : null); // Expand/collapse the row
    },
    showExpandColumn: true,
    expandByColumnOnly: true,
    expandColumnPosition: "right",
    expandHeaderColumnRenderer: ({ isAnyExpands }) =>
      isAnyExpands ? "-" : "+",
    expandColumnRenderer: ({ expanded }) => (expanded ? "-" : "+"),
  };

  return (
    <div>
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <BootstrapTable
          keyField={keyField}
          data={tableData}
          columns={TableColumns}
          pagination={!pagination1 ? paginationFactory(options) : ""}
          selectRow={selectRow}
          noDataIndication={() => <NoDataIndication />}
          headerClasses="bg-primary text-primary text-center header-class"
          rowClasses="text-center"
          rowStyle={rowStyle}
          expandRow={expandRow}
        />
      )}
    </div>
  );
};

export default FullDataTable;
