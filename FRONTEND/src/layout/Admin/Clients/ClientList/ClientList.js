import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import {
  GET_ALL_CLIENTS,
  GO_TO_DASHBOARDS,
  UPDATE_USER_ACTIVE_STATUS,
  DELETE_USER_SERVICES,
  UpdateStarClientStatus,
} from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { All_Api_Info_List } from "../../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice";
import * as Config from "../../../../Utils/Config";
import { useDispatch } from "react-redux";
import { fa_time, fDateTime } from "../../../../Utils/Date_formet";
import toast from "react-hot-toast";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import { DawnloadDataUser } from "../../../../ReduxStore/Slice/Admin/userSlice";
import { Download } from "lucide-react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { GET_IP } from "../../../../Service/common.service";
import Swal from "sweetalert2";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationTotalStandalone,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import Loader from "../../../../Utils/Loader";

const paginationOptions = {
  custom: true,
  totalSize: 0, // This will be updated dynamically
  sizePerPage: 10, // Default number of items per page
  page: 1, // Starting page
};

const AllClients = () => {
  const [ip, setIp] = useState("");

  useEffect(() => {
    GET_IP().then((response) => {
      setIp(response.data.ip);
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  var dashboard_filter = location.search.split("=")[1];
  const dispatch = useDispatch();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const [refresh, setrefresh] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [PanelStatus, setPanelStatus] = useState("2");
  const [ClientStatus, setClientStatus] = useState("null");
  const [selectBroker, setSelectBroker] = useState("null");
  const [BrokerDetails, setBrokerDetails] = useState([]);
  const [ForGetCSV, setForGetCSV] = useState([]);
  const [getAllClients, setAllClients] = useState({ loading: true, data: [] });
  const [getAllStrategyNameData, setAllStrategyName] = useState([]);
  const [StrategyClientStatus, setStrategyClientStatus] = useState("all");
  const [getPage, setPage] = useState(1);
  const [getSizePerPage, setSizePerPage] = useState(10);
  const [total1, setTotal] = useState(0);
  const [getHeaderName, setHeaderName] = useState("All Clients");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };
  useEffect(() => {
    const Brokerdata = async () => {
      await dispatch(
        All_Api_Info_List({
          token: user_details?.token,
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

    Brokerdata();
  }, [dispatch, user_details?.token]);

  useEffect(() => {
    const GetAllStrategyName = async () => {
      await dispatch(
        Get_All_Service_for_Client({
          req: {},
          token: user_details?.token,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            setAllStrategyName(response.data);
          }
        });
    };

    GetAllStrategyName();
  }, [dispatch, user_details?.token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await GetClientsApi();
      } catch (error) {
        return;
      }
    };

    fetchData();
  }, [
    StrategyClientStatus,
    getPage,
    getSizePerPage,
    ClientStatus,
    PanelStatus,
    selectBroker,
    searchQuery,
  ]);

  useEffect(() => {
    setPage(1);
    setSizePerPage(10);
  }, [
    StrategyClientStatus,

    ClientStatus,
    PanelStatus,
    selectBroker,
    searchQuery,
  ]);

  const GetClientsApi = async () => {
    var req1 = {
      Find_Role: user_details && user_details.Role,
      user_ID: user_details && user_details.user_id,
      stgId: StrategyClientStatus,
      page: getPage,
      limit: getSizePerPage,
      ClientStatus: ClientStatus,
      PanelStatus: PanelStatus,
      selectBroker: selectBroker,
      dashboard_filter: dashboard_filter,
      searchQuery: searchQuery,
      StarUsers: 0,
    };

    await dispatch(GET_ALL_CLIENTS(req1))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (dashboard_filter !== undefined) {
            let abc;

            const filterHeaderNames = {
              "000": "",
              111: "Total Active Clients",
              21: "Active Live Client",
              2: "Total Live Client",
              20: "Expired Live Client",
              1: "Total Demo Client",
              11: "Active Demo Client",
              10: "Expired Demo Client",
              0: "Total 2 Days Client",
              "01": "Active 2 Days Client",
              "00": "Expired 2 Days Client",
              ADMIN: "Admin Clients",
              SUBADMIN: "Sub Admin Clients",
            };

            setHeaderName(filterHeaderNames[dashboard_filter] || "");

            abc =
              response.data &&
              response.data.filter((item) => {
                const currentDate = new Date();

                switch (dashboard_filter) {
                  case "000":
                    return (
                      item.Role === "USER" &&
                      new Date(item.EndDate) <= currentDate
                    );

                  case "ADMIN":
                  case "SUBADMIN":
                    return item.parent_role === dashboard_filter;
                  default:
                    return true;
                }
              });

            setAllClients({
              loading: false,
              data: abc,
              pagination: response?.pagination,
            });
            setTotal(response?.pagination?.total);

            return;
          }

          setTotal(response?.pagination?.total);
          setAllClients({
            loading: false,
            data: response.data,
            pagination: response?.pagination,
          });

          forCSVdata(response.data);
        } else {
          setAllClients({
            loading: false,
            data: response.data,
            pagination: response?.pagination,
          });
        }
      });
  };

  const Delete_user = async (id) => {
    var req1 = {
      id: id,
    };
    if (window.confirm("Do you want to delete this User ?")) {
      await dispatch(DELETE_USER_SERVICES(req1))
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.msg);

            setrefresh(!refresh);
          } else {
            toast.error(response.msg);
          }
        });
    } else {
      return;
    }
  };

  const goToDashboard = async (row, asyncid, email) => {
    if (row.AppLoginStatus === "1" || row.WebLoginStatus === "1") {
      let req = {
        Email: email,
      };

      await dispatch(GO_TO_DASHBOARDS(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            localStorage.setItem("route", "/admin/allclients");
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
    }
  };

  const activeUser = async (e, data) => {
    if (
      window.confirm("Do you want To Change Status For This User ?") === true
    ) {
      let req = {
        id: data._id,
        user_active_status: e.target.checked === true ? "1" : "0",
        network_ip: ip,
      };
      await dispatch(UPDATE_USER_ACTIVE_STATUS(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.msg);
            setrefresh(!refresh);

            setTimeout(() => {}, 1000);
          } else {
            toast.error(response.msg);
          }
        });
    } else {
      return setrefresh(!refresh);
    }
  };

  const showLicenceName = (value1, licence_type) => {
    let value = parseInt(value1);

    if (licence_type === "0") {
      return "2 Days Only";
    } else if (licence_type === "1") {
      return "Demo";
    } else {
      return value;
    }
  };

  const handleToggle = async (StarStatus, data) => {
   

    const req = {
      id: data._id,
      StarStatus: StarStatus ? "1" : "0",
    };

    try {
      const response = await dispatch(UpdateStarClientStatus(req)).unwrap();
      if (response.status) {
        setrefresh(!refresh);
        GetClientsApi();
      }
    } catch (error) {
      console.error("Error updating star status", error);
    }
  };

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "UserName",
      text: "User Name",
    },
    {
      dataField: "Email",
      text: "Email",
    },
    {
      dataField: "FullName",
      text: "Full Name",
    },
    {
      dataField: "client_key",
      text: "Client Key",
    },
    {
      dataField: "PhoneNo",
      text: "Phone Number",
    },
    {
      dataField: "broker",
      text: "Broker",
      formatter: (cell, row) => showBrokerName(cell, row.license_type),
    },
    {
      dataField: "licence",
      text: "Month",
      formatter: (cell, row) => showLicenceName(cell, row.license_type),
    },
    {
      dataField: "Active Status",
      text: "Status",
      formatter: (cell, row) => (
        <>
          <label className="toggle mt-3">
            <input
              className="toggle-checkbox bg-primary"
              type="checkbox"
              checked={row?.ActiveStatus === "1" ? true : false}
              onChange={(e) => {
                activeUser(e, row);
              }}
            />
            <div
              className={`toggle-switch  ${
                row?.ActiveStatus === "1" ? "bg-success" : "bg-danger"
              }`}
            ></div>
          </label>
        </>
      ),
    },
    {
      dataField: "Active cd",
      text: "Go To Dashboard",
      formatter: (cell, row) => (
        <>
          <span
            className=" btn fw-bold "
            style={
              row.AppLoginStatus === "0" && row.WebLoginStatus === "0"
                ? { color: "#FF0000" }
                : { color: "#56c080" }
            }
            onClick={() => goToDashboard(row, row._id, row.Email)}
            disabled={row.AppLoginStatus === "0" && row.WebLoginStatus === "0"}
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
          {row.StartDate == null && row.EndDate == null ? (
            <span
              style={
                cell === "off" || cell === null
                  ? { color: "#FF0000", fontSize: "13px" }
                  : { color: "#008000", fontSize: "13px" }
              }
            >
              Activate Subadmin Clients
            </span>
          ) : (
            <span
              style={
                cell === "off" || cell === null
                  ? { color: "#FF0000", fontSize: "40px" }
                  : { color: "#008000", fontSize: "40px" }
              }
            >
              &#9679;
            </span>
          )}
        </>
      ),
    },
    {
      dataField: "CreateDate",
      text: "Create Date",
      formatter: (cell, row) => fDateTime(row.CreateDate),
    },
    {
      dataField: "StartDate",
      text: "Start Date",
      formatter: (cell, row) => (row.StartDate ? fa_time(row.StartDate) : "-"),
    },
    {
      dataField: "EndDate",
      text: "End Date",
      formatter: (cell, row) => (row.EndDate ? fa_time(row.EndDate) : "-"),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div style={{ width: "120px" }}>
          <div>
            <Link to={`/admin/client/edit/${row._id}`} state={row}>
              <span data-toggle="tooltip" data-placement="top" title="Edit">
                <Pencil
                  size={20}
                  color="#198754"
                  strokeWidth={2}
                  className="mx-1"
                />
              </span>
            </Link>
            {(row.license_type === "1" || row.license_type === 1) && (
              <Link>
                <span data-toggle="tooltip" data-placement="top" title="Delete">
                  <Trash2
                    size={20}
                    color="#d83131"
                    strokeWidth={2}
                    className="mx-1"
                    onClick={() => Delete_user(row._id)}
                  />
                </span>
              </Link>
            )}
          </div>
        </div>
      ),
    },
    {
      dataField: "Downloads",
      text: "Downloads",
      formatter: (cell, row) => (
        <div style={{ width: "120px" }}>
          <div>
            <span
              data-toggle="tooltip"
              data-placement="top"
              title="Trading Status"
            >
              <Download
                size={20}
                color="#198754"
                strokeWidth={2}
                className="mx-1"
                onClick={(e) => DownloadsData(row._id, 1)}
              />
            </span>

            {(row.license_type !== "1" || row.license_type !== 1) && (
              <span
                data-toggle="tooltip"
                data-placement="top"
                title="Broker Response"
              >
                <Download
                  size={20}
                  color="#d83131"
                  strokeWidth={2}
                  className="mx-1"
                  onClick={(e) => DownloadsData(row._id, 2)}
                />
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      dataField: "starClient",
      text: "Favorite",
      formatter: (cell, row) => (
        <div style={{ cursor: "pointer" }}>
          <div>
            {cell === 1 || cell === "1" ? (
              <i
                className="bi bi-star-fill"
                onClick={() => handleToggle(false, row)}
              ></i>
            ) : (
              <i
                className="bi bi-star"
                onClick={() => handleToggle(true, row)}
              ></i>
            )}
          </div>
        </div>
      ),
    },
  ];

  const showBrokerName = (value1, licence_type) => {
    if (licence_type === "1") {
      return "Demo";
    }

    const foundBroker = BrokerDetails?.find(
      (value) => parseInt(value.broker_id) === parseInt(value1)
    );

    return foundBroker?.title ?? "";
  };

  const forCSVdata = (data) => {
    let csvArr = [];
    if (data.length > 0) {
      data.map((item) => {
        return csvArr.push({
          FullName: item.FullName,
          UserName: item.UserName,
          Email: item.Email,
          PhoneNo: item.PhoneNo,
          StartDate: fa_time(item.StartDate),
          EndDate: fa_time(item.EndDate),
          "license type": showLicenceName(item.licence, item.license_type),
          broker: showBrokerName(item.broker, item.license_type),
          TradingStatus: item.TradingStatus,
        });
      });

      setForGetCSV(csvArr);
    }
  };

  const DownloadsData = async (id, key) => {
    await dispatch(
      DawnloadDataUser({
        req: { id: id, key: key },
        token: user_details && user_details.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.data.length > 0) {
            let FileName = key === 1 ? "Trading Status" : "Broker Response";

            const fileType =
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";

            const ws = XLSX.utils.json_to_sheet(response.data);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, FileName + fileExtension);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No Data Found",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No Data Found",
          });
        }
      });
  };

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
      <div className="export">
        <Content
          Page_title={getHeaderName}
          button_title="Add Client"
          route="/admin/client/add"
          show_csv_button={true}
          csv_data={ForGetCSV}
          csv_title="Client-List"
        >
          <div className="row">
            <div className="col-lg-2 ">
              <div className="mb-3">
                <label htmlFor="select" className="form-label">
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
                <label htmlFor="select" className="form-label">
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

            <div className="col-lg-2">
              <div className="mb-3">
                <label htmlFor="select" className="form-label">
                  Broker Type
                </label>
                <select
                  className="default-select wide form-control"
                  aria-label="Default select example"
                  id="select"
                  onChange={(e) => setSelectBroker(e.target.value)}
                  value={selectBroker}
                >
                  <option value="null">All</option>

                  {BrokerDetails &&
                    BrokerDetails.map((element) => (
                      <option key={element.broker_id} value={element.broker_id}>
                        {element.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="mb-3">
                <label htmlFor="select" className="form-label">
                  Strategies
                </label>
                <select
                  className="default-select wide form-control"
                  aria-label="Default select example"
                  id="select"
                  onChange={(e) => setStrategyClientStatus(e.target.value)}
                  value={StrategyClientStatus}
                >
                  <option value="all">All</option>

                  {getAllStrategyNameData &&
                    getAllStrategyNameData.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.strategy_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
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
                {/* <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Search 
                </label> */}
                <button onClick={handleSearch} className="btn btn-primary mt-2">
                  Search
                </button>
              </div>
            </div>
          </div>
          {getAllClients?.loading ? (
            <Loader />
          ) : (
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
                      className="watermarkId"
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
                    ></div>{" "}
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
          )}
          <ToastButton />
        </Content>
      </div>
    </>
  );
};

export default AllClients;
