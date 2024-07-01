

import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportToExport({ apiData, fileName }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button onClick={(e) => exportToCSV(apiData, fileName)} type="button" className="btn btn-primary float-end " data-toggle="tooltip" data-placement="top" title="Export To Excel" delay={{ show: "0", hide: "100" }}>
      <i className="fa fa-download" aria-hidden="true"></i> Export-Excel
    </button>
  );
};