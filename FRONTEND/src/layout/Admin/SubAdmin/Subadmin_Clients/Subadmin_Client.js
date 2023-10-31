// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content";
import Loader from "../../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Pencil, Trash2 } from "lucide-react";
import { DELETE_USER_SERVICES } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { Subadmin_Update_User_Status } from "../../../../ReduxStore/Slice/Admin/CreateSubadminSlice";

import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { GET_ALL_CLIENTS } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { Get_All_SUBADMIN_CLIENT } from "../../../../ReduxStore/Slice/Subadmin/Subadminslice";
import { Get_All_SUBADMIN } from "../../../../ReduxStore/Slice/Subadmin/Subadminslice";
import { useDispatch, useSelector } from "react-redux";

import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";




const SubadminClient = () => {
  const dispatch = useDispatch();

  const [first, setfirst] = useState("all");
  const [showModal, setshowModal] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const [SwitchButton, setSwitchButton] = useState(false);


  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });
  const [getAllsubadmins, setAllsubadmins] = useState({
    loading: true,
    data: [],
  });

  const data = async () => {
    await dispatch(Get_All_SUBADMIN_CLIENT())
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (first === "all") {
            setAllClients({
              loading: false,
              data: response.data,
            });
          } else {
            var filter_data = response.data.filter((data) => {
              return data.parent_id == first;
            });

            setAllClients({
              loading: false,
              data: filter_data,
            });
          }
        } else {
          setAllClients({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  const data1 = async () => {
    await dispatch(Get_All_SUBADMIN())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllsubadmins({
            loading: false,
            data: response.data,
          });
        } else {
          setAllsubadmins({
            loading: false,
            data: response.data,
          });
        }
      });
  };
  useEffect(() => {
    data();
    data1();
  }, [first, refresh]);

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





  // ACTIVE USER TO API
  const activeUser = async (e, data) => {
    let req = {
      id: data._id,
      status: e.target.checked === true ? "1" : "0",
    };
    if (window.confirm("Do you want To Change Status For This User ?")) {
      await dispatch(Subadmin_Update_User_Status(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            // console.log("response" ,response)
            toast.success(response.msg);
            setTimeout(() => {
              setrefresh(!refresh)
            }, 500);
          } else {
            toast.error(response.msg);
          }
        });
    }else{
      setrefresh(!refresh)

    }
  };









  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      sort: true,
    },
    {
      dataField: "UserName",
      text: "User Name",
      sort: true,

    },
    {
      dataField: "Email",
      text: "Email",
      sort: true,

    },
    {
      dataField: "PhoneNo",
      text: "Phone Number",
      sort: true,

    },
    {
      dataField: "Otp",
      text: "Password",
      sort: true,

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
              checked={row.Is_Active === "1" ? true : false}
              onChange={(e) => {
                activeUser(e, row);
                setSwitchButton(e.target.checked)
              }}
            />
            <div class={`toggle-switch  ${SwitchButton ? 'bg-primary' : 'bg-secondary'}`}></div>
          </label>
          {/* <label class="switch" >
                        <input type="checkbox" className="bg-primary" defaultChecked={row.ActiveStatus == "1" ? true : false} onChange={(e) => activeUser(e, row)} />
                        <span class="slider round"></span>
                    </label> */}
        </>
      ),
    },
    // {
    //   dataField: "ActiveStatus",
    //   text: "Status",
    //   formatter: (cell, row) => (
    //     <>
    //       <label class="switch">
    //         <input
    //           type="checkbox"
    //           className="bg-primary"
    //           defaultChecked={row.Is_Active === "1" ? true : false}
    //         />
    //         <span class="slider round"></span>
    //       </label>
    //     </>
    //   ),
    // },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div>
          {/* <Link to="/admin/allsubadmins/edit">
                    <span data-toggle="tooltip" data-placement="top" title="Edit">
                        <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
                    </span>
                    </Link> */}
          <Link>
            <span
              data-toggle="tooltip"
              data-placement="top"
              title="Delete"
              onClick={(e) => Delete_user(row._id)}
            >
              <Trash2
                size={20}
                color="#d83131"
                strokeWidth={2}
                className="mx-1"
              />
            </span>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <>
          <Content Page_title="All Subadmin Clients" button_status={false}>
            <div className="col-lg-6">
              <div className="mb-3 row">
                <div className="col-lg-7">
                  <select
                    className="default-select wide form-control"
                    id="validationCustom05"
                    onChange={(e) => setfirst(e.target.value)}
                  >

                    <option selected value="all">
                      All
                    </option>
                    {getAllsubadmins.data &&
                      getAllsubadmins.data.map((item) => {
                        return (
                          <>
                            <option value={item._id}>{item.FullName}</option>
                          </>
                        );
                      })}
                  </select>
                </div>
              </div>
            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data}
            />


          <ToastButton/>
          </Content>
        </>
      )}
    </>
  );
};

export default SubadminClient;
