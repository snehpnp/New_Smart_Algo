import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import * as valid_err from "../../../Utils/Common_Messages";
import axios from "axios";
import ExportToExcel from "../../../Utils/ExportCsv";

import Loader from "../../../Utils/Loader";
import { Pencil, Pointer, RefreshCcw, BadgePlus } from "lucide-react";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
  All_Panel_List,
  Update_Panel_Theme,
  Close_Admin_Panel,
} from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";
import { useDispatch } from "react-redux";
import { Get_All_Theme } from "../../../ReduxStore/Slice/ThemeSlice";
import Modal from "../../../Components/ExtraComponents/Modal";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form";
import Swal from "sweetalert2";

const AdminsList = () => {
  const dispatch = useDispatch();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const [showModal, setShowModal] = useState(false);
  const [Panelid, setPanelid] = useState("");
  const [themeList, setThemeList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [themeData, setThemeData] = useState({ loading: true, data: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [ statusData , setStatusData ] = useState("");

  useEffect(() => {
    fetchAllPanels();
  }, []);

  useEffect(() => {
    if (themeData.data.length > 0) {


      console.log("statusData",statusData)
    
      const filteredData = themeData.data.filter((item) => {
        const matchSearch =
          searchInput === "" ||
          item.panel_name.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.domain.toLowerCase().includes(searchInput.toLowerCase());
      
        const matchStatus =
          statusData === undefined || item.is_active === Number(statusData);
      
        return matchSearch && matchStatus;
      });
      
      let ExportData = filteredData && filteredData.map((item) => {
        return {
          "Panel Name": item.panel_name,
          "Theme Name": item.theme_name,
          "Is Active": item.is_active === 0 ? "Active" : "Inactive",
        };
      });



      setExcelData(ExportData);
      setFilteredData(filteredData);
    }
  }, [searchInput, themeData.data,statusData]);

  const GetAllThemes = async () => {
    try {
      const response = await dispatch(Get_All_Theme()).unwrap();
      if (response.status) {
        setThemeList(response.data);
      }
    } catch (error) {
      return;
    }
  };

  const fetchAllPanels = async () => {
    try {
      const response = await dispatch(All_Panel_List()).unwrap();
      if (response.status) {
        let ExportData = response.data && response.data.map((item) => {
          return {
            "Panel Name": item.panel_name,
            "Theme Name": item.theme_name,
            "Is Active": item.is_active === 0 ? "Active" : "Inactive",
          };
        });

        setExcelData(ExportData);

        setThemeData({
          loading: false,
          data: response.data,
        });
        setFilteredData(response.data); // Initialize filteredData with fetched data
      } else {
        setThemeData({
          loading: false,
          data: [],
        });
        setFilteredData([]); // Initialize filteredData with empty array
      }
    } catch (error) {
      setThemeData({
        loading: false,
        data: [],
      });
      setFilteredData([]);
    }
  };

  const panelDetails = (panel_id) => {
    GetAllThemes();
    setPanelid(panel_id);
    setShowModal(true);
  };

  const fetchBrokerView = async (row) => {
    try {
      const { value: password } = await Swal.fire({
        title: "Enter your password",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off",
        },
      });

      if (password !== "7700") {
        Swal.fire("Incorrect password");
        window.location.reload();
        return;
      }
      const response = await axios.get(row.domain + "/backend/all/brokerview");
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const fetchBrokerView1 = async (row) => {
    try {
      const { value: password } = await Swal.fire({
        title: "Enter your password",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off",
        },
      });

      if (password !== "7700") {
        Swal.fire("Incorrect password");
        window.location.reload();
        return;
      }
      let data = JSON.stringify({
        panelname: row.panel_name,
        client_key: row.key,
        backend_rul: row.domain + "/backend/",
        domain: row.domain,
        db_url: row.db_url,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: row.domain + "/backend/all/tabel",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios.request(config);
    } catch (error) {
      throw error;
    }
  };

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },

    {
      dataField: "panel_name",
      text: "Panel Name",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Panel Views">
          <Link to={`${row.domain}`} target="_blank" rel="noopener noreferrer">
            {row.domain}
          </Link>
        </span>
      ),
    },

    {
      dataField: "theme_name",
      text: "Set theme",
      formatter: (cell, row) => <span>{cell} </span>,
    },
    {
      dataField: "is_active",
      text: "Close Panel",
      formatter: (cell, row) => (
        <label className="toggle mt-3 ">
          <input
            className="toggle-checkbox bg-primary"
            type="checkbox"
            defaultChecked={Number(row.is_active) === 0}
            onChange={(e) => CloseCompany(row.domain, e.target.checked)}
          />
          <div
            className={`toggle-switch ${
              Number(row.is_active) === 0 ? "bg-green" : "bg-danger"
            }`}
          ></div>
        </label>
      ),
    },
    {
      dataField: "a",
      text: "Update Theme",
      formatter: (cell, row) => (
        <span data-toggle="tooltip" data-placement="top" title="Edit">
          <Pointer
            size={20}
            color="#198754"
            strokeWidth={2}
            className="mx-1"
            onClick={() => panelDetails(row._id)}
          />
        </span>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div style={{ width: "60px" }}>
          <div>
            <Link to={`/super/panel/edit/${row._id}`} state={row}>
              <span data-toggle="tooltip" data-placement="top" title="Edit">
                <Pencil
                  size={20}
                  color="#198754"
                  strokeWidth={2}
                  className="mx-1"
                />
              </span>
            </Link>
          </div>
        </div>
      ),
    },
    {
      dataField: "a",
      text: "Tabels",
      formatter: (cell, row) => (
        <span style={{ display: "flex" }}>
          <div className="tooltip-wrapper" title="All Tables Update">
            <Pointer
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1 pointer-icon"
              onClick={() => fetchBrokerView1(row)}
            />
          </div>
        </span>
      ),
    },
    {
      dataField: "a",
      text: "Brokers",
      formatter: (cell, row) => (
        <span style={{ display: "flex" }}>
          <div className="tooltip-wrapper" title="All Brokers View Create">
            <BadgePlus
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-2 pointer-icon"
              onClick={() => fetchBrokerView(row)}
            />
          </div>
        </span>
      ),
    },
    {
      dataField: "a",
      text: "Live price",
      formatter: (cell, row) => (
        <span style={{ display: "flex" }}>
          <div className="tooltip-wrapper" title="All Tables Update">
            <RefreshCcw
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1 pointer-icon"
              onClick={() => UpdateLivePrive(row)}
            />
          </div>
        </span>
      ),
    },
    {
      dataField: "a",
      text: "Reload Panel",
      formatter: (cell, row) => (
        <span style={{ display: "flex" }}>
          <div className="tooltip-wrapper" title="All Tables Update">
            <RefreshCcw
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1 pointer-icon"
              onClick={() => PanelReload(row)}
            />
          </div>
        </span>
      ),
    },
  ];

  const PanelReload = async (row) => {
    try {
      const { value: password } = await Swal.fire({
        title: "Enter your Server password",
        input: "text",
        inputLabel: "Server Password",
        inputPlaceholder: "Enter your Server password",
        inputAttributes: {
          autocomplete: "off",
        },
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Password is required!";
          }
          return null;
        },
      });

      if (!password) {
        return;
      }

      if (!row.ip_address) {
        Swal.fire({
          icon: "Error",
          title: "Error",
          text: "Server IP address not found.",
        });
        return;
      }

      let req = {
        password: password,
        host: row.ip_address,
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://newpenal.pandpinfotech.com/backend/pm2/update",
        headers: {
          "Content-Type": "application/json",
        },
        data: req,
      };

      const response = await axios.request(config);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Server update was successful.",
      });
    } catch (error) {
      Swal.fire({
        icon: "info",
        title: "Information",
        text: "An issue occurred during the server update. The UI will remain unaffected.",
      });

      console.log("Error during server update:", error);
    }
  };

  const UpdateLivePrive = async (row) => {
    try {
      const { value: password } = await Swal.fire({
        title: "Enter your Server password",
        input: "text",
        inputLabel: "Server Password",
        inputPlaceholder: "Enter your Server password",
        inputAttributes: {
          autocomplete: "off",
        },
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Password is required!";
          }
          return null;
        },
      });

      if (!password) {
        return;
      }

      if (!row.ip_address) {
        Swal.fire({
          icon: "Error",
          title: "Error",
          text: "Server IP address not found.",
        });
        return;
      }

      let req = {
        password: password,
        host: row.ip_address,
      };

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: row.domain + "/backend/update/tradehistory/token",
        headers: {
          "Content-Type": "application/json",
        },
        data: req,
      };

      const response = await axios.request(config);

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Live Price update successful.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Live Price update failed.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "info",
        title: "Information",
        text: "An issue occurred during the server update. The UI will remain unaffected.",
      });

      console.log("Error during server update:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      theme_update: null,
    },
    validate: (values) => {
      const errors = {};
      if (!values.theme_update) {
        errors.theme_update = valid_err.THEMESELECT_ERROR;
      }
      return errors;
    },
    onSubmit: async (values) => {
      const req = {
        userid: Panelid,
        theme_id: values.theme_update,
        token: user_details.token,
        UserName: user_details.UserName,
      };
      try {
        const response = await dispatch(Update_Panel_Theme(req)).unwrap();
        if (response.status) {
          toast.success(response.msg);
          setShowModal(false);
          fetchAllPanels();
        }
      } catch (error) {
        toast.error("An error occurred while updating the theme");
      }
    },
  });

  const CloseCompany = async (domain, status) => {
    try {
      const { value: password } = await Swal.fire({
        title: "Enter your password",
        input: "password",
        inputLabel: "Password",
        inputPlaceholder: "Enter your password",
        inputAttributes: {
          maxlength: "10",
          autocapitalize: "off",
          autocorrect: "off",
        },
      });

      if (password !== "7700") {
        Swal.fire("Incorrect password");
        window.location.reload();
        return;
      }

      const req = {
        domain: domain,
        status: status ? 0 : 1,
        Name: user_details.UserName,
      };

      const response = await dispatch(Close_Admin_Panel(req)).unwrap();
      if (response.status) {
        toast.success(response.msg);
        window.location.reload();
      } else {
        toast.error(response.msg);
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while closing the panel");
    }
  };

  const changeView = (e) => {
    const value = e.target.value;
    if (value === "") {
      setFilteredData(themeData.data);
    } else {
      const filteredData = themeData.data.filter((item) => {
        return item.is_active === Number(value);
      });


      let ExportData = filteredData && filteredData.map((item) => {
        return {
          "Panel Name": item.panel_name,
          "Theme Name": item.theme_name,
          "Is Active": item.is_active === 0 ? "Active" : "Inactive",
        };
      });

      setExcelData(ExportData);

      setFilteredData(filteredData);
    }
  };

  const fields = [
    {
      name: "theme_update",
      label: "Theme",
      type: "select",
      options: themeList.map((item) => ({
        label: item.theme_name,
        value: item._id,
      })),
    },
  ];

  return (
    <>
      <Content
        Page_title="Company Names"
        button_title={user_details.UserName !== "superadmin" ? "" : "Add Panel"}
        route="/super/panel/add"
        button_status={user_details.UserName === "superadmin"}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
            alignItems: "center",
          }}
        >
          <div
            className="mb-4"
            style={{
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h6 style={{ marginBottom: "10px", fontWeight: "bold" }}>Search</h6>
            <input
              type="text"
              placeholder="Search..."
              className="form-control p-2 rounded"
              style={{
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              value={searchInput}
            />
          </div>

          <div
            className="mb-4"
            style={{
              flex: "1 1 200px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h6 style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Panel Status
            </h6>
            <select
              className="form-control p-2 rounded"
              style={{
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
              onChange={(e) => setStatusData(e.target.value)}
            >
              <option value="">All</option>
              <option value="0">Active</option>
              <option value="1">Inactive</option>
            </select>
          </div>

          <div
            className="mb-4"
            style={{
              flex: "1 1 200px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h6 style={{ marginBottom: "10px", fontWeight: "bold" }}>
              Export Data
            </h6>

            <ExportToExcel
              className="btn btn-primary export-btn "
              apiData={excelData}
              fileName={"Export"}
            />
          </div>
        </div>

        {/* Data Table and Modal */}
        {themeData.loading ? (
          <Loader />
        ) : (
          <>
            <FullDataTable TableColumns={columns} tableData={filteredData} />

            {/* Update Theme Modal */}
            <Modal
              isOpen={showModal}
              backdrop="static"
              size="sm"
              title="Update Company Theme"
              hideBtn={true}
              handleClose={() => setShowModal(false)}
            >
              <Formikform
                fieldtype={fields.filter(
                  (field) => !field.showWhen || field.showWhen(formik.values)
                )}
                formik={formik}
                btn_name="Update Theme"
                title="update_theme"
              />
            </Modal>

            {/* Toast Notification Button */}
            <ToastButton />
          </>
        )}
      </Content>
    </>
  );
};

export default AdminsList;
