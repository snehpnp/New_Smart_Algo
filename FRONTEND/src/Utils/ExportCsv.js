import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export default function ExportToExport({ apiData, fileName }) {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';


  
  const flattenObject = (obj, parentKey = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(acc, flattenObject(obj[key], newKey));
      } else {
        acc[newKey] = obj[key];
      }
      return acc;
    }, {});
  };

  const getNestedHeaders = (obj, parentKey = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const nestedHeaders = getNestedHeaders(obj[key], newKey);
        if (nestedHeaders.length > 0) {
          acc.push({ label: key, headers: nestedHeaders });
        }
      }
      return acc;
    }, []);
  };

 const exportToCSV = (apiData, fileName) => {
  const flattenedData = apiData.map((item) => flattenObject(item));

  // Create a mapping of header labels with nested object paths
  const headerMap = {};
  for (const item of flattenedData) {
    for (const key in item) {
      headerMap[key] = key.split('.').pop(); // Use only the last part of the path
    }
  }

  

  // Prepare the data with updated headers and indexed rows, excluding 'Id' or '_id'
  const updatedHeaders = Object.keys(flattenedData[0]).map((key) =>
    key === 'Id' || key === '_id' ? undefined : headerMap[key]
  );
  const updatedData = flattenedData.map((item, index) => {
    const newItem = { Index: index + 1 }; // Use indexing for rows
    for (const key in item) {
      if (key !== 'Id' && key !== '_id') {
        newItem[headerMap[key]] = item[key];
      }
    }
    return newItem;
  });

  const filteredHeaders = updatedHeaders.filter((header) => header !== undefined);

  const ws = XLSX.utils.json_to_sheet(updatedData, { header: filteredHeaders });
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};


  return (
    <button
      onClick={(e) => exportToCSV(apiData, fileName)}
      type="button"
      className="btn btn-primary float-end"
      data-toggle="tooltip"
      data-placement="top"
      title="Export To Excel"
      delay={{ show: '0', hide: '100' }}
    >
      <i className="fa fa-download" aria-hidden="true"></i> Export-Excel
    </button>
  );
}
