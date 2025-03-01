// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import Theme_Content from "../../../Components/Dashboard/Content/Theme_Content";
import Loader from "../../../Utils/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
  GET_ALL_CLIENTS,
  GO_TO_DASHBOARDS,
  UPDATE_USER_ACTIVE_STATUS,
} from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch } from "react-redux";
import Modal from "../../../Components/ExtraComponents/Modal";

const AllClients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const [showModal, setshowModal] = useState(false);
  const [getAllClients, setAllClients] = useState({ loading: true, data: [] });

  const data = async () => {
    var req1 = {
      Find_Role: user_details.Role,
      user_ID: user_details.user_id,
    };
    await dispatch(GET_ALL_CLIENTS(req1))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllClients({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {
    data();
  }, []);

  // GO TO DASHBOARD
  const goToDashboard = async (asyncid, email) => {
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
  };

  // ACTIVE USER TO API
  const activeUser = async (e, data) => {
    let req = {
      id: data._id,
      user_active_status: e.target.checked == true ? "1" : "0",
    };
    await dispatch(UPDATE_USER_ACTIVE_STATUS(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
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
      dataField: "UserName",
      text: "User Name",
    },
    {
      dataField: "Email",
      text: "Email",
    },
    {
      dataField: "PhoneNo",
      text: "Phone Number",
    },

    {
      dataField: "ActiveStatus",
      text: "Status",
      formatter: (cell, row) => (
        <>
          <label className="switch">
            <input
              type="checkbox"
              className="bg-primary"
              defaultChecked={row.ActiveStatus == "1" ? true : false}
              onChange={(e) => activeUser(e, row)}
            />
            <span className="slider round"></span>
          </label>
        </>
      ),
    },
    {
      dataField: "ActiveStatus",
      text: "Go To Dashboard",
      formatter: (cell, row) => <>Broker</>,
    },
    {
      dataField: "ActiveStatus",
      text: "Dashboard",
      formatter: (cell, row) => (
        <>
          <button
            className="btn btn-new-block"
            style={
              row.AppLoginStatus === "0" && row.WebLoginStatus === "0"
                ? { color: "#FF0000" }
                : { color: "#008000" }
            }
            onClick={() => goToDashboard(row._id, row.Email)}
            disabled={row.AppLoginStatus === "0" && row.WebLoginStatus === "0"}
          >
            Dashboard
          </button>
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
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div style={{ width: "120px" }}>
          <div>
            <Link to={`/admin/client/edit/${row._id}`}>
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
                />
              </span>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Content
      Page_title="All Clients"
      button_title="Add Client"
      route="/admin/client/add"
    >
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <FullDataTable TableColumns={columns} tableData={getAllClients.data} />
      )}
      {showModal && (
        <>
          <Modal
            isOpen={showModal}
            backdrop="static"
            size="sm"
            title="Verify OTP"
            btn_name="Verify"
          ></Modal>
        </>
      )}
    </Content>
  );
};

export default AllClients;
