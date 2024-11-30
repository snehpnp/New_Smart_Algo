import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const FullDataTable = ({
  styles,
  label,
  columns,
  rows,
  keyField,
  rowStyle,
  checkboxSelection,
  pginationSize,

}) => {
  const themeMode = localStorage.getItem("theme_mode") || "light";

  const rowsWithIds = rows.map((row, index) => ({ ...row, id: index }));

  const backgroundColor = themeMode === "light" ? "white" : "#16191c";
  const color = themeMode === "light" ? "black" : "white";

  return (
    <>
      <div style={{ height: pginationSize ? "400px" : "100%", width: "100%", position: "relative" }}>
        <DataGrid
          rows={rowsWithIds}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 50, 100]}
          pagination={true}
          disableSelectionOnClick
          checkboxSelection={checkboxSelection}
          disableColumnFilter={true}
          disableColumnMenu={true}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: pginationSize ? pginationSize : 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
          className="custom-data-grid"
          style={{
            border: "none",
            fontFamily: "none",
            fontWeight: "400",
            fontSize: "14px",
            backgroundColor: backgroundColor,
            color: color,
          }}
          headerClassName="custom-header" // Apply custom header class
        />
      </div>
    </>
  );
};

export default FullDataTable;
