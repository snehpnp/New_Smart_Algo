import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

export default function ExportToExcel({ apiData = [], fileName, headers = [] }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = (apiData, fileName, headers) => {
    if (!Array.isArray(headers) || headers.length === 0) {

      return;
    }

    // Format data based on provided headers
    const formattedData = apiData.map((row) =>
      headers.reduce((formattedRow, header) => {
        formattedRow[header.label] = row[header.key] || ""; // Map data to header labels
        return formattedRow;
      }, {})
    );

    // Create header row and data rows
    const headerRow = headers.map((header) => header.label);
    const dataRows = formattedData.map((row) =>
      headers.map((header) => row[header.label])
    );

    const dataWithHeaders = [headerRow, ...dataRows];

    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);

    // Apply styling to headers
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Header row
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } }, // White bold text
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "000000" } }, // Black background
        };
      }
    }

    // Auto-adjust column widths
    const colWidths = headers.map((header) => ({
      width: Math.max(header.label.length + 5, 15), // Minimum width 15
    }));
    ws["!cols"] = colWidths;

    // Styling for data rows
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" }, // Center-align data
          };
        }
      }
    }

    // Create workbook and export
    const wb = { Sheets: { Data: ws }, SheetNames: ["Data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  // Dynamically generate headers if not provided
  const dynamicHeaders =
    headers.length > 0
      ? headers
      : apiData.length > 0
      ? Object.keys(apiData[0]).map((key) => ({
          label: key.replace(/_/g, " "), // Replace underscores with spaces
          key: key,
        }))
      : [];

  return (
    <button
      onClick={() => exportToExcel(apiData, fileName, dynamicHeaders)}
      type="button"
      className="btn btn-primary float-end"
      title="Export To Excel"
    >
      <i className="fa fa-download" aria-hidden="true"></i> Export Excel
    </button>
  );
}
