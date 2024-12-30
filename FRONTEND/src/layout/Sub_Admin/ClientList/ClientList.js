/* eslint-disable no-mixed-operators */
// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import Loader from "../../../Utils/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
  GET_ALL_CLIENTS,
  GO_TO_DASHBOARDS,
  UPDATE_USER_ACTIVE_STATUS,
} from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { All_Api_Info_List } from "../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice";
import * as Config from "../../../Utils/Config";
import { DELETE_USER_SERVICES } from "../../../ReduxStore/Slice/Subadmin/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { fDateTimeSuffix } from "../../../Utils/Date_formet";
import { maskEmail, maskNumber } from "../../../Utils/HideWIthStart";
import { Get_Sub_Admin_Permissions } from "../../../ReduxStore/Slice/Subadmin/Subadminslice";
import toast from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationTotalStandalone,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const paginationOptions = {
  custom: true,
  totalSize: 0, // This will be updated dynamically
  sizePerPage: 10, // Default number of items per page
  page: 1, // Starting page
};

const AllClients = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [ClientStatus, setClientStatus] = useState("null");
  const [PanelStatus, setPanelStatus] = useState("2");
  const dispatch = useDispatch();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const gotodashboard = JSON.parse(localStorage.getItem("user_details_goTo"));
  const isgotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const [refresh, setrefresh] = useState(false);
  const [getPermissions, setGetPermissions] = useState([]);
  const [getAllClients, setAllClients] = useState({ loading: true, data: [] });
  const [BrokerDetails, setBrokerDetails] = useState([]);
  const [getPage, setPage] = useState(1);
  const [getSizePerPage, setSizePerPage] = useState(10);
  const [total1, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };
  useEffect(() => {
    GetClientsApi();
  }, [
    ClientStatus,
    PanelStatus,
    getPage,
    getSizePerPage,
    searchQuery,
    refresh,
  ]);

  useEffect(() => {
    GetSubAdminPermisson();
    Brokerdata();
  }, []);

  const Brokerdata = async () => {
    await dispatch(
      All_Api_Info_List({
        token: user_details.token,
        url: Config.react_domain,
        brokerId: -1,
        key: 1,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setBrokerDetails(response.data);
        }
      });
  };

  // DELETE USET FUNCTION TO DELETE ALL SERVICES
  const Delete_user = async (id) => {
    var req1 = {
      id: id,
    };
    if (window.confirm("Do you want to delete this User ?")) {
      await dispatch(DELETE_USER_SERVICES(req1))
        .unwrap()
        .then((response) => {
          if (response.status) {
            setrefresh(!refresh);
          }
        });
    }
  };

  const GetClientsApi = async () => {
    var req1 = {
      Find_Role: isgotodashboard ? gotodashboard.Role : user_details.Role,
      user_ID: isgotodashboard ? gotodashboard.user_id : user_details.user_id,
      page: getPage,
      limit: getSizePerPage,
      ClientStatus: ClientStatus,
      PanelStatus: PanelStatus,
      searchQuery: searchQuery,
    };
    await dispatch(GET_ALL_CLIENTS(req1))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setTotal(response?.pagination?.total);

          setAllClients({
            loading: false,
            data: response.data,
          });
        } else {
          setAllClients({
            loading: false,
            data: response.data,
          });
        }
        setOriginalData(response.data);
      });
  };

  const GetSubAdminPermisson = async () => {
    await dispatch(Get_Sub_Admin_Permissions({ id: user_details.user_id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setGetPermissions(response.data[0]);
        }
      });
  };

  // GO TO DASHBOARD
  const goToDashboard = async (asyncid, email, row) => {
    if (row.AppLoginStatus == "0" && row.WebLoginStatus == "0") {
      return;
    }

    let req = {
      Email: email,
    };
    await dispatch(GO_TO_DASHBOARDS(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
          localStorage.setItem("route", "/subadmin/clients");
          localStorage.setItem("gotodashboard", JSON.stringify(true));
          localStorage.setItem(
            "user_details_goTo",
            JSON.stringify(response.data)
          );
          localStorage.setItem(
            "user_role_goTo",
            JSON.stringify(response.data.Role)
          );
          navigate("/client/dashboard");
        }
      });
  };

  // ACTIVE USER TO API
  const activeUser = async (e, data) => {
    let req = {
      id: data._id,
      user_active_status: e.target.checked === true ? "1" : "0",
    };

    if (window.confirm("Do you want To Change Status For This User ?")) {
      await dispatch(UPDATE_USER_ACTIVE_STATUS(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.msg);
            setTimeout(() => {
              setrefresh(!refresh);
            }, 500);
          } else {
            toast.error(response.msg);
          }
        });
    } else {
      setrefresh(!refresh);
    }
  };

  const showBrokerName = (value1, licence_type) => {
    let value = parseInt(value1);

    if (licence_type === "1") {
      return "Demo";
    } else {
      const foundNumber =
        BrokerDetails &&
        BrokerDetails.find((value) => value.broker_id == value1);

      if (foundNumber != undefined) {
        return foundNumber.title;
      } else {
        return "";
      }
    }
  };

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "FullName",
      text: "Full Name",
    },
    {
      dataField: "UserName",
      text: "User Name",
    },
    {
      dataField: "Email",
      text: "Email",
      formatter: (cell, row, rowIndex) => (
        <>
          <span>
            {getPermissions && getPermissions.detailsinfo === 1
              ? cell
              : maskEmail(cell)}
          </span>
        </>
      ),
    },
    {
      dataField: "PhoneNo",
      text: "Phone Number",
      formatter: (cell, row, rowIndex) => (
        <>
          <span>
            {getPermissions && getPermissions.detailsinfo === 1
              ? cell
              : maskNumber(cell)}
          </span>
        </>
      ),
    },
    {
      dataField: "client_key",
      text: "Client Key",
    },

    {
      dataField: "broker",
      text: "Broker",
      formatter: (cell, row) => showBrokerName(cell, row.license_type),
    },
    {
      dataField: "ActiveStatus",
      text: "Status",
      hidden: isgotodashboard ? true : false,

      formatter: (cell, row) =>
        row.Is_Active === "1" ? (
          <>
            <label className="toggle mt-3">
              <input
                className="toggle-checkbox bg-primary"
                type="checkbox"
                checked={row.ActiveStatus === "1" ? true : false}
                onChange={(e) => {
                  activeUser(e, row);
                }}
              />
              <div
                className={`toggle-switch ${
                  row.ActiveStatus === "1" ? "bg-success" : "bg-danger"
                }`}
              ></div>
            </label>
          </>
        ) : (
          ""
        ),
    },

    {
      dataField: "ActiveStatus",
      text: "Got To Dashboard",
      hidden:
        getPermissions && getPermissions.go_To_Dashboard == 1 ? false : true,
      formatter: (cell, row) => (
        <>
          <span
            className=" btn "
            style={
              row.AppLoginStatus == "0" && row.WebLoginStatus == "0"
                ? { color: "#FF0000" }
                : { color: "#008000" }
            }
            onClick={() => goToDashboard(row._id, row.Email, row)}
            disabled={row.AppLoginStatus == "0" && row.WebLoginStatus == "0"}
          >
            Dashboard
          </span>
        </>
      ),
    },
    {
      dataField: "TradingStatus",
      text: "TradingStatus",
      formatter: (cell, row) => (
        <>
          <span
            style={
              cell == "off" || cell === null
                ? { color: "#FF0000", fontSize: "40px" }
                : { color: "#008000", fontSize: "40px" }
            }
          >
            &#9679;
          </span>
        </>
      ),
    },
    {
      dataField: "StartDate",
      text: "Start Date",
      formatter: (cell, row) =>
        row.StartDate == null ? "----" : fDateTimeSuffix(row.StartDate),
    },
    {
      dataField: "EndDate",
      text: "End Date",
      formatter: (cell, row) =>
        row.EndDate == null ? "----" : fDateTimeSuffix(row.EndDate),
    },

    {
      dataField: "actions",
      text: "Actions",
      // hidden: (isgotodashboard ? true : false),

      formatter: (cell, row) => (
        <div style={{ width: "120px" }}>
          {isgotodashboard && isgotodashboard == true ? (
            <div>
              <Link to={`/subadmin/client/edit/${row._id}`} state={row}>
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
          ) : row.Is_Active == 1 ? (
            <div>
              {(getPermissions && getPermissions.client_edit === 1) ||
              (getPermissions &&
                getPermissions.Update_Api_Key === 1 &&
                row.license_type !== "1" &&
                row.Is_Active === "1") ? (
                <>
                  <Link to={`/subadmin/client/edit/${row._id}`} state={row}>
                    <span
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Edit"
                    >
                      <Pencil
                        size={20}
                        color="#198754"
                        strokeWidth={2}
                        className="mx-1"
                      />
                    </span>
                  </Link>

                  {row.license_type == "1" &&
                  getPermissions &&
                  getPermissions.Update_Api_Key === 0 ? (
                    <>
                      <Link>
                        <span
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Delete"
                        >
                          <Trash2
                            size={20}
                            color="#d83131"
                            strokeWidth={2}
                            className="mx-1"
                            onClick={(e) => Delete_user(row._id)}
                          />
                        </span>
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          ) : null}

          {}
        </div>
      ),
    },
  ];

  const handleTableChange = (type, { page, sizePerPage }) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const handleSizePerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setSizePerPage(value);
    setPage(1);
  };

  return (
    <>
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="All Clients"
            button_title="Add Client"
            route="/subadmin/client/add"
            button_status={
              getPermissions && getPermissions.client_add == 1 ? true : false
            }
          >
            <div className="row">
              <div className="col-lg-2 ">
                <div className="mb-3">
                  <label for="select" className="form-label">
                    Client Type
                  </label>

                  <select
                    className="default-select wide form-control"
                    aria-label="Default select example"
                    id="select"
                    onChange={(e) => setClientStatus(e.target.value)}
                    value={ClientStatus}
                  >
                    <option value="null">All</option>
                    <option value="2">Live</option>
                    <option value="1">Demo</option>
                    <option value="0">2 Days Only</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="mb-3">
                  <label for="select" className="form-label">
                    Trading Type
                  </label>

                  <select
                    className="default-select wide form-control"
                    aria-label="Default select example"
                    id="select"
                    onChange={(e) => setPanelStatus(e.target.value)}
                    value={PanelStatus}
                  >
                    <option value="2">All</option>
                    <option value="1">On</option>
                    <option value="0">OFf</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Search Something Here
                  </label>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)} // Update input on change
                    className="form-control"
                    id="exampleFormControlInput1"
                  />
                </div>
              </div>

              <div className="col-lg-2">
                <div className="mb-3 mt-3">
                  <button
                    onClick={handleSearch}
                    className="btn btn-primary mt-2"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <PaginationProvider
              pagination={paginationFactory({
                ...paginationOptions,
                totalSize: total1,
                page: getPage,
                sizePerPage: getSizePerPage,
              })}
            >
              {({ paginationProps, paginationTableProps }) => (
                <div>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* dynamic Watermark */}
                    <div
                      //   className="watermarkId"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0.1,
                        pointerEvents: "none",
                        zIndex: 2,
                      }}
                    ></div>

                    <BootstrapTable
                      keyField="_id"
                      data={getAllClients.data}
                      columns={columns}
                      remote
                      onTableChange={handleTableChange}
                      {...paginationTableProps}
                      headerClasses="bg-primary text-primary text-center header-class"
                      rowClasses={`text-center`}
                      // noDataIndication={() => <NoDataIndication />}
                      style={{
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  </div>

                  <div className="mb-2 d-flex justify-content-between align-items-start mt-2">
                    <div className="d-flex align-items-center">
                      <label htmlFor="sizePerPageSelect" className="mx-2">
                        Items per page:
                      </label>
                      <select
                        id="sizePerPageSelect"
                        value={getSizePerPage}
                        onChange={handleSizePerPageChange}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                      </select>
                    </div>
                    <div className="d-flex align-items-center">
                      <PaginationTotalStandalone
                        {...paginationProps}
                        className="mr-3"
                      />{" "}
                      {/* Add margin to the right for spacing */}
                    </div>
                    <div className="d-flex align-items-end">
                      <PaginationListStandalone {...paginationProps} />
                    </div>
                  </div>
                </div>
              )}
            </PaginationProvider>
          </Content>
          <ToastButton />
        </>
      )}
    </>
  );
};

export default AllClients;
