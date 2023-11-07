// import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content";
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content";
import Loader from "../../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Users } from "lucide-react";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { Get_All_SUBADMIN } from "../../../../ReduxStore/Slice/Subadmin/Subadminslice";
import { DELETE_USER_SERVICES } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import {
  GO_TO_DASHBOARDS,
  UPDATE_USER_ACTIVE_STATUS,
} from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable";
import Modal from "../../../../Components/ExtraComponents/Modal";
import { Get_Client_By_Subadmin_Id } from "../../../../ReduxStore/Slice/Admin/CreateSubadminSlice";
import { maskEmail, maskNumber, maskPassword } from "../../../../Utils/HideWIthStart";



import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

const AllSubadmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const [first, setfirst] = useState("all");

  const [showModal, setshowModal] = useState(false);

  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [PanelStatus, setPanelStatus] = useState("2");

  const [refresh, setrefresh] = useState(false);

  const [Addsubadmin, setAddsubadmin] = useState({
    loading: true,
    data: [],
  });

  const [SubAdminClients, setSubAdminClients] = useState({
    loading: true,
    data: [],
  });

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
            // console.log("response", response)
            toast.success(response.msg);
            window.location.reload()

            setTimeout(() => {
              setrefresh(!refresh)
            }, 1000);
          } else {
            toast.error(response.msg);
          }
        });
    }
  };



  const data = async () => {
    await dispatch(Get_All_SUBADMIN())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAddsubadmin({
            loading: false,
            data: response.data,
          });
        } else {
          setAddsubadmin({
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

  // DELETE USET FUNCTION TO DELETE ALL SERVICES
  const Delete_user = async (id) => {
    var req1 = {
      id: id,
    };
    if (window.confirm("Do you want to delete this User ?")) {
      await dispatch(DELETE_USER_SERVICES(req1))
        .unwrap()
        .then((response) => {
          // console.log("response", response);
          if (response.status) {
            setrefresh(!refresh);
          }
        });
    }
  };

  // VIEW SUBADMIN CLIENTS BY SUBADMIN ID
  const ViewSubadminClients = async (id) => {
    setshowModal(true);

    await dispatch(Get_Client_By_Subadmin_Id({ id: id, token: token }))
      .unwrap()
      .then((response) => {
        // console.log("response", response);
        if (response.status) {
          setSubAdminClients({
            loading: false,
            data: response.data,
          });
        } else {
          setSubAdminClients({
            loading: false,
            data: response.data,
          });
        }
      });
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
      dataField: "Email",
      text: "Email",
      formatter: (cell, row) => (
        <span>{maskEmail(cell)}</span>
      )

    },
    {
      dataField: "PhoneNo",
      text: "Phone Number",
      formatter: (cell, row) => (
        <span>{maskNumber(cell)}</span>
      )
    },
    {
      dataField: "Otp",
      text: "Password",
      formatter: (cell, row) => (
        <span>{maskPassword(cell)}</span>
      )
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
              checked={row.ActiveStatus == "1" ? true : false}
              onChange={(e) => {
                activeUser(e, row);
              }}
            />
            <div class={`toggle-switch ${row.ActiveStatus === "1" ? 'bg-success' : 'bg-danger'}`}></div>
          </label>
        </>
      ),
    },
    {
      dataField: "",
      text: "Clients",
      formatter: (cell, row) => (
        <>
          <span data-toggle="tooltip" data-placement="top" title="Edit">
            <Users
              size={20}
              color="#198754"
              strokeWidth={2}
              className="mx-1"
              onClick={() => {
                ViewSubadminClients(row._id);
              }}
            />
          </span>
        </>
      ),
    },
    {
      dataField: "ActiveStatus",
      text: "Dashboard",
      formatter: (cell, row) => (
        <>
          <span
            className={`${row.AppLoginStatus === "0" && row.WebLoginStatus === "0"
              ? "btn-danger"
              : "btn-success "
              }  btn btn-new-block`}
            onClick={() => goToDashboard(row._id, row.Email)}
          // disabled={row.AppLoginStatus === "0" && row.WebLoginStatus === "0"}
          >
            Dashboard
          </span>
        </>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div className="d-flex">
          <Link to={`/admin/editsubadmin/${row._id}`}>
            <span data-toggle="tooltip" data-placement="top" title="Edit">
              <Pencil
                size={20}
                color="#198754"
                strokeWidth={2}
                className="mx-1"
              />
            </span>
          </Link>
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
        </div>
      ),
    },
  ];

  const goToDashboard = async (asyncid, email) => {
    let req = {
      Email: email,
    };
    await dispatch(GO_TO_DASHBOARDS(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
          // console.log(response);

          localStorage.setItem("gotodashboard", "true");
          localStorage.setItem(
            "user_details_goTo",
            JSON.stringify(response.data)
          );
          localStorage.setItem(
            "user_role_goTo",
            JSON.stringify(response.data.Role)
          );
          navigate("/subadmin/signals");
        }
      });
  };

  //  MANAGE MULTIFILTER
  useEffect(() => {
    const filteredData = originalData.filter((item) => {
      return (
        (PanelStatus === "2" || item.WebLoginStatus.includes(PanelStatus)) &&
        (searchInput === "" ||
          item.UserName.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.PhoneNo.includes(searchInput))
      );
    });
    setAddsubadmin({
      loading: false,
      data: searchInput || PanelStatus !== "2" ? filteredData : originalData,
    });
  }, [searchInput, originalData, PanelStatus]);

  // const ResetDate = (e) => {
  //   e.preventDefault();

  //   setSearchInput("");
  //   setPanelStatus("2");
  //   setAddsubadmin({
  //     loading: false,
  //     data: originalData,
  //   });
  // };

  return (
    <>
      {Addsubadmin.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="All Subadmins"
            button_title="Add SubAdmin"
            route="/admin/allsubadmins/add"
          >
            <div className="row">
              <div className="col-lg-4">
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
              {/* <div className="col-lg-4 ">
                <div class="mb-3">
                  <label for="select" class="form-label">
                    Panel Status
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
              <div className="col-lg-2 ">
                <button
                  className="btn btn-primary mt-2"
                  onClick={(e) => ResetDate(e)}
                >
                  Reset
                </button>
              </div> */}
            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={Addsubadmin.data}
            />







            {/*  ---- FOR SHOW SUBADMIN CLIENTLIST ---- */}


            {showModal ? (
              <>
                <Modal
                  isOpen={showModal}
                  size="ms-5"
                  title="Services"
                  hideBtn={true}
                  handleClose={() => setshowModal(false)}
                >
                  <BasicDataTable
                    TableColumns={[
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
                        dataField: "FullName",
                        text: "Full Name",
                      },
                      {
                        dataField: "Email",
                        text: "Email",
                      },
                      {
                        dataField: "License Type",
                        text: "license_type",
                        formatter: (cell, row, rowIndex) =>
                          cell === "0"
                            ? "2 Days Only"
                            : cell === "1"
                              ? "Demo"
                              : "Live",
                      },
                    ]}
                    tableData={SubAdminClients.data && SubAdminClients.data}
                  />
                </Modal>
              </>
            ) : (
              ""
            )}
            <ToastButton />
          </Content>
        </>
      )}
    </>
  );
};

export default AllSubadmin;
