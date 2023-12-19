/* eslint-disable no-mixed-operators */
// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Loader from "../../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { Get_All_Service_for_Client } from "../../../../ReduxStore/Slice/Common/commoSlice";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
  GET_ALL_EXPIRED_CLIENTS,
  GO_TO_DASHBOARDS,
  UPDATE_USER_ACTIVE_STATUS,
  DELETE_USER_SERVICES,
} from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch } from "react-redux";
import { fa_time } from "../../../../Utils/Date_formet";



import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";


const AllClients = () => {
  const navigate = useNavigate();
  const location = useLocation();
  var dashboard_filter = location.search.split("=")[1];


  const dispatch = useDispatch();
  const Role = JSON.parse(localStorage.getItem("user_details")).Role;
  const user_ID = JSON.parse(localStorage.getItem("user_details")).user_id;
  const token = JSON.parse(localStorage.getItem("user_details")).token;

  // For Filter

  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [PanelStatus, setPanelStatus] = useState("2");
  const [ClientStatus, setClientStatus] = useState("null");
  const [SwitchButton, setSwitchButton] = useState(true);
  const [StrategyClientStatus, setStrategyClientStatus] = useState("null");

  const [refresh, setrefresh] = useState(false);

  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });

  const [ForGetCSV, setForGetCSV] = useState([])


  const [getAllStrategyName, setAllStrategyName] = useState({
    loading: true,
    data: [],
  });

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
            toast.success(response.msg);

            setrefresh(!refresh);
          } else {
            toast.error(response.msg);

          }
        });
    } else {
      return
    }
  };

  const data = async () => {
    var req1 = {
      Find_Role: Role,
      user_ID: user_ID,
    };
    await dispatch(GET_ALL_EXPIRED_CLIENTS(req1))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (dashboard_filter !== undefined) {
            let abc =
              response.data &&
              response.data.filter((item) => {
                if (dashboard_filter === "000") {
                  return (item.Role === "USER" && item.Is_Active === '1' && new Date(item.EndDate) <= new Date())
                }
                if (dashboard_filter === "111") {
                  return (item.Role === "USER" && item.Is_Active === '1' && new Date(item.EndDate) >= new Date())

                }

                if (dashboard_filter === "2" || dashboard_filter === 2) {
                  return (
                    item.license_type === dashboard_filter ||
                    item.license_type === dashboard_filter
                  );
                }
                if (dashboard_filter === "21" || dashboard_filter === 21) {
                  return (
                    new Date(item.EndDate) > new Date() &&
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
                    new Date(item.EndDate) < new Date() &&
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
    data();
  }, [refresh]);

  // GO TO DASHBOARD
  const goToDashboard = async (row, asyncid, email) => {
    if (row.AppLoginStatus == "1" || row.WebLoginStatus == "1") {
      let req = {
        Email: email,
      };


      await dispatch(GO_TO_DASHBOARDS(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
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

  // ACTIVE USER TO API
  const activeUser = async (e, data) => {

    if (window.confirm("Do you want To Change Status For This User ?") === true) {
      let req = {
        id: data._id,
        user_active_status: e.target.checked === true ? "1" : "0",
      };
      await dispatch(UPDATE_USER_ACTIVE_STATUS(req))
        .unwrap()
        .then((response) => {
          setrefresh(!refresh)
          window.location.reload();

          if (response.status) {

            setrefresh(!refresh)
            toast.success(response.msg);

            window.location.reload()
            setTimeout(() => {
            }, 500);
          } else {
            toast.error(response.msg);
          }
        });
    }
    else {
      return setrefresh(!refresh)

    }

    // await dispatch(UPDATE_USER_ACTIVE_STATUS(req))
    //   .unwrap()
    //   .then((response) => {
    //     if (response.status) {
    //     }
    //   });
  };

  const showBrokerName = (value1, licence_type) => {
    let value = parseInt(value1);

    if (licence_type === "0") {
      return "2 Days Only";
    } else if (licence_type === "1") {
      return "Demo";
    } else {
      if (value === 1) {
        return "markethub";
      }
      if (value === 1) {
        return "markethub";
      } else if (value === 2) {
        return "alice blue";
      } else if (value === 3) {
        return "master trust";
      } else if (value === 4) {
        return "Motilal Oswal";
      } else if (value === 5) {
        return "Zebull";
      } else if (value === 6) {
        return "IIFl";
      } else if (value === 7) {
        return "Kotak";
      } else if (value === 8) {
        return "Mandot";
      } else if (value === 9) {
        return "Choice";
      } else if (value === 10) {
        return "Anand Rathi";
      } else if (value === 11) {
        return "B2C";
      } else if (value === 12) {
        return "Angel";
      } else if (value === 13) {
        return "Fyers";
      } else if (value === 14) {
        return "5-Paisa";
      } else if (value === 15) {
        return "Zerodha";
      }
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
          <label class="toggle mt-3">
            <input
              class="toggle-checkbox bg-primary"
              type="checkbox"
              checked={row.ActiveStatus === "1" ? true : false}
              onChange={(e) => {
                activeUser(e, row);
                setSwitchButton(e.target.checked)
              }}
            />
            <div class={`toggle-switch  ${row.ActiveStatus === "1" ? 'bg-success' : 'bg-danger'}`}></div>
          </label>
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
      formatter: (cell, row) => fa_time(row.StartDate),
    },
    {
      dataField: "EndDate",
      text: "End Date",
      formatter: (cell, row) => fa_time(row.EndDate),
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
            {/* {
            row.license_type == "1" ? */}
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
              {/* : ""} */}

          </div>
        </div>
      ),
    },
  ];

  //  GET ALL SERVICE NAME

  const GetAllStrategyName = async (e) => {
    await dispatch(
      Get_All_Service_for_Client({
        req: {},
        token: token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllStrategyName({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    GetAllStrategyName();
  }, []);

  //  MANAGE MULTIFILTER
  useEffect(() => {
    const filteredData = originalData.filter((item) => {
      return (
        (ClientStatus === "null" || item.license_type.includes(ClientStatus)) &&
        // (StrategyClientStatus === "null" || item.license_type.includes(ClientStatus)) &&
        (PanelStatus === "2" || item.WebLoginStatus.includes(PanelStatus)) &&
        (searchInput === "" ||
          item.UserName.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.PhoneNo.includes(searchInput))
      );
    });


    setAllClients({
      loading: false,
      data:
        searchInput || PanelStatus !== "2" || ClientStatus !== "null"
          ? filteredData
          : originalData,
    });
  }, [searchInput, originalData, PanelStatus, ClientStatus]);

  const ResetDate = (e) => {
    e.preventDefault();

    setSearchInput("");
    setClientStatus("null");
    setPanelStatus("2");
    setAllClients({
      loading: false,
      data: originalData,
    });
  };


  //  For CSV
  const forCSVdata = () => {
    let csvArr = []
    if (getAllClients.data.length > 0) {
      getAllClients.data.map((item) => {
        return csvArr.push({
          "FullName": item.FullName,
          "UserName": item.UserName,
          "Email": item.Email,
          "PhoneNo": item.PhoneNo,
          "StartDate": fa_time(item.StartDate),
          "EndDate": fa_time(item.EndDate),
          "license type": showLicenceName(item.licence, item.license_type),
          "broker": showBrokerName(item.broker, item.license_type),
          "TradingStatus": item.TradingStatus,
        })
      })

      setForGetCSV(csvArr)
    }

  }

  useEffect(() => {
    forCSVdata()
  }, [getAllClients.data])














  return (
    <>
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="Expired Clients"
       
            button_status={false}
            show_csv_button={true} csv_data={ForGetCSV} csv_title="Expired Client-List"
          >

            <div className="row">
              <div className="col-lg-3">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">
                    Search Something Here
                  </label>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    class="form-control"
                    id="exampleFormControlInput1"
                  />
                </div>
              </div>
              <div className="col-lg-2 ">
                <div class="mb-3">
                  <label for="select" class="form-label">
                    Client Type
                  </label>

                  <select
                    class="default-select wide form-control"
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
                <div class="mb-3">
                  <label for="select" class="form-label">
                    Trading Type
                  </label>

                  <select
                    class="default-select wide form-control"
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
              {/* <div className="col-lg-2 ">
                <div class="mb-3">
                  <label for="select" class="form-label">
                    Strategy Clients
                  </label>
                  <select
                    class="default-select wide form-control"
                    aria-label="Default select example"
                    id="select"
                    onChange={(e) => StrategyClientStatus(e.target.value)}
                    value={ClientStatus}
                  >
                    <option value="null">All</option>
                    {getAllStrategyName.data &&
                      getAllStrategyName.data.map((item) => {
                        return (
                          <option value={item._id}>{item.strategy_name}</option>
                        );
                      })}
                  </select>
                </div>
              </div> */}

              <div className="col-lg-2 mt-4">
                <button
                  className="btn btn-primary mt-2"
                  onClick={(e) => ResetDate(e)}
                >
                  Reset
                </button>
              </div>
            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data}
            />
            <ToastButton />

          </Content>
        </>
      )}
    </>
  );
};

export default AllClients;
