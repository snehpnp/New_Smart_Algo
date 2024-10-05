import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content";
import { fDateTimeSuffix, dateFormate } from "../../../Utils/Date_formet";
import { Get_Panel_History } from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from "../../../Utils/Loader";
import { Form } from "react-bootstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import axios from "axios";
import * as Config from "../../../Utils/Config";
import Swal from "sweetalert2";

const History = () => {
  const dispatch = useDispatch();
  const monthRef = useRef("");
  const dayRef = useRef("");
  const user_details = JSON.parse(localStorage.getItem("user_details"));

  const [getFilterValue, setFilterValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [allData, setAllData] = useState({ loading: true, data: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [licAdd, setLicAdd] = useState(false);

  let columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "panal_name",
      text: "Panel Name",
    },
    {
      dataField: "superadmin_name",
      text: "Super Admin Name",
    },
    {
      dataField: "client_id",
      text: "Client Id",
      formatter: (cell) => <div>{cell == null ? "-" : cell}</div>,
    },
    {
      dataField: "msg",
      text: "Message",
    },
    {
      dataField: "createdAt",
      text: "Date & Time",
      formatter: (cell) => <div>{fDateTimeSuffix(cell)}</div>,
      sort: true,
    },
  ];

  if (user_details.Email === "superadmin@gmail.com") {
    columns.push({
      dataField: "Delete",
      text: "Delete",
      formatter: (cell, row, rowIndex) => (
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(row, rowIndex)}
        >
          <i className="fa fa-trash" /> Delete
        </button>
      ),
      sort: false, // No need to sort on delete column
    });
  }

  const handleDelete = (row, rowIndex) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this history",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${Config.base_url}delete/history`, { id: row._id })
          .then((res) => {
       
            if (res.data.status) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "History deleted successfully",
                showConfirmButton: false,
                timer: 1500,
              });

              fetchData();
            } else {
              Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Failed to delete history",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: "Failed to delete history",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const fetchData = async () => {
    const response = await dispatch(Get_Panel_History()).unwrap();
    if (response.status) {
      setAllData({ loading: false, data: response.data });
      setFilteredData(response.data);
    } else {
      setAllData({ loading: false, data: [] });
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchInput, monthFilter, licAdd, getFilterValue]);

  const filterData = () => {
    let filtered = allData.data;

    if (licAdd) {
      filtered = filtered.filter((obj) => obj.msg.includes("License Add"));
    }

    if (searchInput) {
      const lowerCaseSearchInput = searchInput.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.panal_name?.toLowerCase().includes(lowerCaseSearchInput) ||
          item.superadmin_name?.toLowerCase().includes(lowerCaseSearchInput) ||
          item.msg?.toLowerCase().includes(lowerCaseSearchInput)
      );
    }

    if (monthFilter) {
      filtered = filtered.filter(
        (obj) =>
          dateFormate(obj.createdAt).split(" ")[0].substring(0, 7) ===
          monthFilter
      );
    }

    if (getFilterValue) {
      filtered = filtered.filter(
        (obj) =>
          dateFormate(obj.createdAt).split(" ")[0].substring(0, 10) ===
          getFilterValue
      );
    }

    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const dataToExport = filteredData.map((item, index) => ({
      "SR. No.": index + 1,
      "Panel Name": item.panal_name,
      "Super Admin Name": item.superadmin_name,
      "Client Id": item.client_id == null ? "-" : item.client_id,
      Message: item.msg,
      "Date & Time": fDateTimeSuffix(item.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "History" + fileExtension);
  };


let LicenseData =0
if(licAdd){
  filteredData && filteredData.map((item) => {
    if(item.msg.includes("License Add")){
      LicenseData = Number(item.msg.split(" ")[2]) +LicenseData
    }
  }
  )
}

  return (
    <Theme_Content Page_title="History" button_status={false}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
          gap: "15px",
          alignItems: "center",
          padding: "1.5rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label
            style={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
          >
            Search
          </label>
          <input
            type="text"
            placeholder="Search..."
            style={{
              height: "2.5rem",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "16px",
              outline: "none",
              boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.05)",
            }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>

        {/* Date and Month Filters */}
        <div style={{ flex: "1 1 300px", display: "flex", gap: "15px" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label
              style={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
            >
              Day
            </label>
            <input
              ref={dayRef}
              type="date"
              style={{
                height: "2.5rem",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
                outline: "none",
                boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.05)",
              }}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setMonthFilter("");
                monthRef.current.value = "";
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label
              style={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
            >
              Month
            </label>
            <input
              ref={monthRef}
              type="month"
              style={{
                height: "2.5rem",
                padding: "0.6rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "16px",
                outline: "none",
                boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.05)",
              }}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setFilterValue("");
                dayRef.current.value = "";
              }}
            />
          </div>
        </div>

        {/* Filter and Export Buttons */}
        <div style={{ flex: "1 1 300px", display: "flex", gap: "15px" }}>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label
              style={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
            >
              Export
            </label>
            <button
              onClick={exportToCSV}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "background-color 0.3s, transform 0.3s",
                boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <i
                className="fas fa-file-export"
                style={{ fontSize: "18px" }}
              ></i>
              Export Data
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label
              style={{ marginBottom: "8px", fontWeight: "bold", color: "#333" }}
            >
              Filter
            </label>
            <label className="switch">
              <input
                type="checkbox"
                checked={licAdd}
                onChange={() => setLicAdd(!licAdd)}
              />
              <span className="slider round"></span>
            </label>
          </div>

         
        </div>
      </div>

      {/* Data Table or Loader */}
      {allData.loading ? (
        <Loader />
      ) : (
        <>
      {licAdd &&  <h3><b>Total License :-</b> {LicenseData && LicenseData}</h3>}
        <FullDataTable TableColumns={columns} tableData={filteredData} />
        </>
      )}
    </Theme_Content>
  );
};

export default History;
