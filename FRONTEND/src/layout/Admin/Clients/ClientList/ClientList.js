import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Loader from "../../../../Utils/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
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
  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [PanelStatus, setPanelStatus] = useState("2");
  const [ClientStatus, setClientStatus] = useState("null");
  const [selectBroker, setSelectBroker] = useState("null");
  const [BrokerDetails, setBrokerDetails] = useState([]);
  const [ForGetCSV, setForGetCSV] = useState([]);
  const [getAllClients, setAllClients] = useState({ loading: true, data: [] });

  useEffect(() => {
    const filteredData = originalData.filter((item) => {
      const filter1Match =
        ClientStatus == "null" || item.license_type.includes(ClientStatus);
      const filter3Match =
        selectBroker === "null" || item.broker === selectBroker;
      const filter2Match =
        PanelStatus == 2 ||
        item.TradingStatus.includes(PanelStatus == 1 ? "on" : "off");
      const searchTermMatch =
        searchInput === "" ||
        item.UserName.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.PhoneNo.includes(searchInput);

      return filter1Match && filter3Match && filter2Match && searchTermMatch;
    });
    setAllClients({
      loading: false,
      data:
        searchInput ||
        PanelStatus !== "2" ||
        ClientStatus !== "null" ||
        selectBroker !== "null"
          ? filteredData
          : originalData,
    });
  }, [searchInput, originalData, PanelStatus, ClientStatus, selectBroker]);

  const Brokerdata = async () => {
    await dispatch(
      All_Api_Info_List({
        token: user_details && user_details.token,
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

  var headerName = "All Clients";

  if (dashboard_filter !== undefined) {
    if (dashboard_filter === "000") {
      headerName = "";
    } else if (dashboard_filter === "111") {
      headerName = "Total Active Clients";
    } else if (dashboard_filter == "21") {
      headerName = "Active Live Client";
    } else if (dashboard_filter == "2") {
      headerName = "Total Live Client";
    } else if (dashboard_filter == "20") {
      headerName = "Expired Live Client";
    } else if (dashboard_filter == "1") {
      headerName = "Total Demo Client";
    } else if (dashboard_filter == "11") {
      headerName = "Active Demo Client";
    } else if (dashboard_filter == "10") {
      headerName = "Expired Demo Client";
    } else if (dashboard_filter == "0") {
      headerName = "Total 2 Days Client";
    } else if (dashboard_filter == "01") {
      headerName = "Active 2 Days Client";
    } else if (dashboard_filter == "00") {
      headerName = "Expired 2 Days Client";
    }
  }

  const data = async () => {
    var req1 = {
      Find_Role: user_details && user_details.Role,
      user_ID: user_details && user_details.user_id,
    };
    await dispatch(GET_ALL_CLIENTS(req1))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (dashboard_filter !== undefined) {
            let abc =
              response.data &&
              response.data.filter((item) => {
                if (dashboard_filter === "000") {
                  headerName = "";
                  return (
                    item.Role === "USER" && new Date(item.EndDate) <= new Date()
                  );
                }
                if (dashboard_filter === "111") {
                  headerName = "Total Active Clients";

                  return (
                    item.Role === "USER" && new Date(item.EndDate) >= new Date()
                  );
                }

                if (dashboard_filter === "2" || dashboard_filter === 2) {
                  return (
                    item.license_type == dashboard_filter && 
                    item.Is_Active == "1" 
                  );
                }
                if (dashboard_filter === "21" || dashboard_filter === 21) {
                  return (
                    new Date(item.EndDate) >= new Date() &&
                    (item.license_type === "2" || item.license_type === 2)
                  );
                }
                if (dashboard_filter === "20" || dashboard_filter === 20) {
                  return (
                    new Date(item.EndDate) < new Date() &&
                    (item.license_type === "2" || item.license_type === 2)
                  );
                }
                if (dashboard_filter === "1" || dashboard_filter === 1) {
                  return (
                    item.license_type === dashboard_filter ||
                    item.license_type === dashboard_filter
                  );
                }
                if (dashboard_filter === "11" || dashboard_filter === 11) {
                  return (
                    new Date(item.EndDate) > new Date() &&
                    (item.license_type === "1" || item.license_type === 1)
                  );
                }
                if (dashboard_filter === "10" || dashboard_filter === 10) {
                  return (
                    new Date(item.EndDate) < new Date() &&
                    (item.license_type === "1" || item.license_type === 1)
                  );
                }
                if (dashboard_filter === "0" || dashboard_filter === 0) {
                  return (
                    item.license_type === dashboard_filter ||
                    item.license_type === dashboard_filter
                  );
                }
                if (dashboard_filter === "01") {
                  return (
                    new Date(item.EndDate) > new Date() &&
                    (item.license_type === "0" || item.license_type === 0)
                  );
                }
                if (dashboard_filter === "00") {
                  return (
                    new Date(item.EndDate) <= new Date() &&
                    (item.license_type === "0" || item.license_type === 0)
                  );
                }
                if (
                  dashboard_filter === "ADMIN" ||
                  dashboard_filter === "SUBADMIN"
                ) {
                  return item.parent_role === dashboard_filter;
                }
              });
            setAllClients({
              loading: false,
              data: abc,
            });
            return;
          }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Brokerdata();
        await data();
      } catch (error) {
        return;
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    forCSVdata();
  }, [getAllClients.data]);

  const goToDashboard = async (row, asyncid, email) => {
    if (row.AppLoginStatus == "1" || row.WebLoginStatus == "1") {
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

  const StarClientFormatter = ({ cell, row }) => {
    const [isStarred, setIsStarred] = useState(cell === "1");

    const handleToggle = async (e, data) => {
      const newStarStatus = !isStarred;
      let req = {
        id: data._id,
        StarStatus: newStarStatus ? "1" : "0",
      };
      await dispatch(UpdateStarClientStatus(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            setIsStarred(newStarStatus ? "1" : "0");
            setrefresh(!refresh);
            // toast.success(response.msg);
          } else {
            // toast.error(response.msg);
          }
        });
    };

    return (
      <div style={{ width: "100px" }}>
        <div
          onClick={(e) => handleToggle(e, row)}
          style={{ cursor: "pointer" }}
        >
          <span
            data-toggle="tooltip"
            data-placement="top"
            title="Trading Status"
          >
            {isStarred ? (
              <i className="bi bi-star-fill"></i>
            ) : (
              <i className="bi bi-star"></i>
            )}
          </span>
        </div>
      </div>
    );
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
      dataField: "ActiveStatus",
      text: "Status",
      formatter: (cell, row) => (
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
              className={`toggle-switch  ${
                row.ActiveStatus === "1" ? "bg-success" : "bg-danger"
              }`}
            ></div>
          </label>

          {/* {row.StartDate == null && row.EndDate == null ?
            ''
            :
            <label className="toggle mt-3">
              <input
                className="toggle-checkbox bg-primary"
                type="checkbox"
                checked={row.ActiveStatus === "1" ? true : false}
                onChange={(e) => {
                  activeUser(e, row);
                }}
              />
              <div className={`toggle-switch  ${row.ActiveStatus === "1" ? 'bg-success' : 'bg-danger'}`}></div>
            </label>

          } */}
        </>
      ),
    },
    {
      dataField: "ActiveStatus",
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
          {row.StartDate == null && row.EndDate == null ? (
            <span
              style={
                cell == "off" || cell === null
                  ? { color: "#FF0000", fontSize: "13px" }
                  : { color: "#008000", fontSize: "13px" }
              }
            >
              Activate Subadmin Clients
            </span>
          ) : (
            <span
              style={
                cell == "off" || cell === null
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
            {row.license_type == "1" ? (
              <Link>
                <span data-toggle="tooltip" data-placement="top" title="Delete">
                  <Trash2
                    size={20}
                    color="#d83131"
                    strokeWidth={2}
                    className="mx-1"
                    onClick={(e) => Delete_user(row._id)}
                  />
                </span>
              </Link>
            ) : (
              ""
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

            {row.license_type != "1" && (
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
      formatter: (cell, row) => <StarClientFormatter cell={cell} row={row} />,
    },
  ];

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

  const ResetDate = (e) => {
    e.preventDefault();
    setSearchInput("");
    setClientStatus("null");
    setSelectBroker("null");
    setPanelStatus("2");
    setAllClients({
      loading: false,
      data: originalData,
    });
  };

  const forCSVdata = () => {
    let csvArr = [];
    if (getAllClients.data.length > 0) {
      getAllClients.data.map((item) => {
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

  return (
    <>
      <div className="export">
        <Content
          Page_title={headerName}
          button_title="Add Client"
          route="/admin/client/add"
          show_csv_button={true}
          csv_data={ForGetCSV}
          csv_title="Client-List"
        >
          <div className="row">
            <div className="col-lg-3">
              <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                  Search Something Here
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="form-control"
                  id="exampleFormControlInput1"
                />
              </div>
            </div>
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

            <div className="col-lg-2">
              <div className="mb-3">
                <label for="select" className="form-label">
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

            <div className="col-lg-2 mt-4">
              <button
                className="btn btn-primary mt-1"
                onClick={(e) => ResetDate(e)}
              >
                Reset
              </button>
            </div>
          </div>

          {!getAllClients.loading ? (
            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data}
            />
          ) : (
            <Loader />
          )}

          <ToastButton />
        </Content>
      </div>
    </>
  );
};

export default AllClients;
