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

const AllLicence = () => {
  const dispatch = useDispatch();




  const [first, setfirst] = useState("all");
  const [showModal, setshowModal] = useState(false);

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });

  console.log("getAllClients", getAllClients.data);

  const data = async () => {
    await dispatch(Transcation_Licence({ token: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
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
      });
  };
  useEffect(() => {
    data();
  }, []);
  const columns = [
    {
      dataField: "index",
      text: "S.No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      sort: true,
    },
    {
      dataField: "user",
      text: "Full Name",
      formatter: (cell, row, rowIndex) => <>{row.user.FullName}</>,
      sort: true,
    },

    {
      dataField: "",
      text: "license",
      formatter: (cell, row, rowIndex) => <>{row.license}</>,
      sort: true,
    },
    {
      dataField: "",
      text: "Create At",
      formatter: (cell, row, rowIndex) => <>{fDateTimeSuffix(row.createdAt)}</>,
      sort: true,
    },
  ];





  // --------------    For Hide Next Months ------------


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed

  // Calculate the minimum and maximum values to restrict the selection to the current month
  // const minDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;
  const maxDate = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;

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
            <div className="col-lg-5 ">
              <div className="mb-3 row">
                <div className="col-lg-7">
                  <input type="month"
                    className="default-select wide form-control"
                    id="validationCustom05"
                    // min={minDate}
                    max={maxDate}
                  />


                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-2 mx-auto border border-dark">
                <h6 className="text-center">startDate</h6>
                <span className="text-center">2023-09-24 21:57:30</span>
              </div>
              <div className="col-2 mx-auto border border-dark">
              <h6 className="text-center">startDate</h6>
                <h6 className="text-center">300</h6>
              </div>
              <div className="col-2 mx-auto border border-dark">
              <h6 className="text-center">startDate</h6>
                <h6 className="text-center">300</h6>
              </div>
              <div className="col-2 mx-auto  border border-dark">
              <h6 className="text-center">startDate</h6>
                <h6 className="text-center">300</h6>
              </div>
              <div className="col-2 mx-auto border border-dark">
              <h6 className="text-center">Current Month Licence</h6>
                <span className="text-center">Please Select Month</span>
              </div>

            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data}
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
