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
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { GET_ALL_CLIENTS } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../Components/ExtraComponents/Modal";
import { Transcation_Licence } from "../../../../ReduxStore/Slice/Admin/LicenceSlice";
import { fDate, fDateTimeSuffix } from "../../../../Utils/Date_formet";
import cellEditFactory from "react-bootstrap-table2-editor";

const AllLicence = () => {
  const dispatch = useDispatch();

  const [first, setfirst] = useState("all");
  const [showModal, setshowModal] = useState(false);

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });

  const [getAllClients1, setAllClients1] = useState({
    loading: true,
    data: [],
  });
  const [CountLicence, setCountLicence] = useState("");
  const [usedLicence, setUsedLicence] = useState("");

  const data = async () => {
    await dispatch(Transcation_Licence({ token: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (CountLicence) {
            const filteredData =
              response.data &&
              response.data.filter((item) => {
                const itemDate = new Date(item.createdAt);
                const itemMonth = itemDate.getMonth() + 1; // Month is 0-indexed
                const itemYear = itemDate.getFullYear();
                return (
                  `${itemYear}-${itemMonth.toString().padStart(2, "0")}` ===
                  CountLicence
                );
              });

            setAllClients({
              loading: false,
              data: {
                data: filteredData,
                total_licence: response.total_licence,
              },
            });
            // setUsedLicence(filteredData.length);

            return;
          }
          setAllClients({
            loading: false,
            data: response,
          });

          setAllClients1({
            loading: false,
            data: response,
          });
        } else {
          setAllClients({
            loading: false,
            data: response,
          });
        }
      });
  };




  useEffect(() => {
    data();
  }, [CountLicence]);
  const columns = [
    {
      dataField: "index",
      text: "S.No.",
      formatter: (cell, row, rowIndex) => (
        <div
          style={{
            color: row.admin_license ? "#198754" : "black",
            fontWeight: row.admin_license ? "700" : "200",
          }}
        >
          {rowIndex + 1}
        </div>
      ),

      sort: true,
    },
    {
      dataField: "UserName",
      text: "User Name",
      formatter: (cell, row, rowIndex) => (
        <div
          style={{
            color: row.admin_license ? "#198754" : "black",
            fontWeight: row.admin_license ? "700" : "200",
          }}
        >
          {row.user.UserName}
        </div>
      ),
      sort: true,
    },

    {
      dataField: "admin_license", // Use the correct field name
      text: "License",
      formatter: (cell, row, rowIndex) => (
        <div
          style={{
            color: row.admin_license ? "#198754" : "black",
            fontWeight: row.admin_license ? "700" : "200",
          }}
        >
          {row.license ? row.license : row.admin_license}
        </div>
      ),
      sort: true,
    },
    {
      dataField: "createdAt",
      text: "Create At",
      formatter: (cell, row, rowIndex) => (
        <div
          style={{
            color: row.admin_license ? "#198754" : "black",
            fontWeight: row.admin_license ? "700" : "200",
          }}
        >
          {fDateTimeSuffix(row.createdAt)}
        </div>
      ),
      sort: true,
    },
  ];

  const UsedLicence = (alllicence) => {

    if (getAllClients1.data.length != 0) {

      const filteredData = getAllClients1.data.data.filter(
        (item) => !item.admin_license
      );
      const count = filteredData.length;
      return count;

    } else {

      const count = 0;
      return count;
    }
  };

  const ThisMonthUsedLicence = (alllicence) => {
    if (CountLicence) {
      if (getAllClients1.data !== undefined) {
        const filteredData = getAllClients1.data.data.filter((item) => {
          if (!item.admin_license) {
            const itemDate = new Date(item.createdAt);
            const itemMonth = itemDate.getMonth() + 1; // Month is 0-indexed
            const itemYear = itemDate.getFullYear();
            return (
              `${itemYear}-${itemMonth.toString().padStart(2, "0")}` ===
              CountLicence
            );
          }
        });

        console.log("filteredData", filteredData);
        const count = filteredData.length;

        setUsedLicence(count);
      }
    }
  };

  useEffect(() => {
    ThisMonthUsedLicence();
  }, [CountLicence]);

  const resetFilter = (e) => {
    e.preventDefault();
    setAllClients({
      loading: false,
      data: getAllClients1.data,
    });
  };

  // --------------    For Hide Next Months ------------

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed

  // Calculate the minimum and maximum values to restrict the selection to the current month
  // const minDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;
  const maxDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;


  console.log((getAllClients1.data && getAllClients1.data.total_licence));

  return (
    <>
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="Transaction Licence"
            Filter_tab={true}
            button_status={false}
          >
            <div className="col-lg-5 mb-4 ">
              <div className="mb-3 row  d-flex flex-column">
                <label
                  htmlFor="validationCustom05"
                  className="col-lg-5 col-form-label"
                >
                  Please Select Month
                </label>
                <div className="col-lg-12 align-items-center d-flex ">
                  <input
                    type="month"
                    className="default-select wide  me-3 form-control"
                    id="validationCustom05"
                    max={maxDate}
                    onChange={(e) => setCountLicence(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      resetFilter(e);
                    }}
                  >
                    reset
                  </button>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-2 mx-auto border border-dark">
                <h6 className="text-center">Start Date</h6>
                <span className="text-center">2023-09-24 21:57:30</span>
              </div>
              <div className="col-2 mx-auto border border-dark">
                <h6 className="text-center">Total Licence</h6>
                <h6 className="text-center">
                  {getAllClients1.data && getAllClients1.data.total_licence == undefined ? 0 : getAllClients1.data.total_licence}
                </h6>
              </div>
              <div className="col-2 mx-auto border border-dark">
                <h6 className="text-center">Used Licence</h6>
                <h6 className="text-center">{UsedLicence(getAllClients1)}</h6>
              </div>
              <div className="col-2 mx-auto  border border-dark">
                <h6 className="text-center">Remaining Licence</h6>
                <h6 className="text-center">
                  {(getAllClients1.data && getAllClients1.data.total_licence) == undefined ? 0 : getAllClients1.data.total_licence -
                    UsedLicence(
                      getAllClients.data.total_licence,
                      getAllClients.data
                    )}
                </h6>
              </div>
              <div className="col-2 mx-auto border border-dark">
                <h6 className="text-center">This Month Licence</h6>
                <span className="text-center">
                  {usedLicence ? usedLicence : "Please Select Month"}
                </span>
              </div>
            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data.data}
            // cellEdit={cellEditFactory({ mode: 'click' })}
            />

            {showModal ? (
              <>
                <Modal
                  isOpen={showModal}
                  backdrop="static"
                  size="sm"
                  title="Verify OTP"
                  btn_name="Verify"
                //  handleClose={setshowModal(false)}
                ></Modal>
              </>
            ) : (
              ""
            )}
          </Content>
        </>
      )}
    </>
  );
};

export default AllLicence;
