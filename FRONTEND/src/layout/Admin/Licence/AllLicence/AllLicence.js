// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content";
import Loader from "../../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../Components/ExtraComponents/Modal";
import { Transcation_Licence } from "../../../../ReduxStore/Slice/Admin/LicenceSlice";
import { fDate, get_year_and_month_only, fDateTimeSuffix } from "../../../../Utils/Date_formet";

const AllLicence = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  var dashboard_filter = location.search.split("=")[1];

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

  const [CountLicence, setCountLicence] = useState(get_year_and_month_only(new Date()));
  const [usedLicence, setUsedLicence] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [SelectUserFIlter, setSelectUserFIlter] = useState("");
  const [ForPanelStartDate, setForPanelStartDate] = useState("");
  const [ForShowTotalLicence, setForShowTotalLicence] = useState("");






  const data = async () => {
    await dispatch(Transcation_Licence({ token: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setOriginalData(response.data);
          setForShowTotalLicence(response.total_licence)
          setForPanelStartDate(fDateTimeSuffix(response.data[response.data.length - 1].createdAt))

          if (dashboard_filter !== undefined) {
            let filteredData
            filteredData = response.data.filter(item => {
              let getMonthAndYear = get_year_and_month_only(item.createdAt)
              if (dashboard_filter === "0" || dashboard_filter === 0) {
                return (item.admin_license) && (!CountLicence || getMonthAndYear === CountLicence);
              } else if (dashboard_filter === "1" || dashboard_filter === 1) {
                return (!item.admin_license) && (!CountLicence || getMonthAndYear === CountLicence);
              }
            });

            setAllClients({
              loading: false,
              data: { data: filteredData },
            });
            return;
          }
          setAllClients({
            loading: false,
            data: response,
          });

          if (CountLicence) {
            const filteredData =
              response.data &&
              response.data.filter((item) => {

                let getMonthAndYear = get_year_and_month_only(item.createdAt)
                return getMonthAndYear === CountLicence
              });

            setAllClients({
              loading: false,
              data: {
                data: filteredData,
                total_licence: response.total_licence,
              },
            });
            return;
          }
          // setOriginalData(response.data);
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

  const UsedLicence = () => {
    if (getAllClients.data.data.length !== 0) {
      const filteredData = getAllClients.data.data.filter(
        (item) => !item.admin_license
      );
      const count = filteredData.length;
      return count;
    } else {
      const count = 0;
      return count;
    }
  };

  const ThisMonthUsedLicence = () => {
    if (dashboard_filter === undefined) {
      if (getAllClients.data.data !== undefined) {
        const filteredData = getAllClients.data.data.filter((item) => {
          return item.admin_license;
        });
        const totalLicenses = filteredData.reduce((accumulator, currentValue) => {
          return parseInt(accumulator) + parseInt(currentValue.admin_license)
        }, 0);
        setUsedLicence(totalLicenses);
      }
    }
  };


  useEffect(() => {
    ThisMonthUsedLicence();
  }, [getAllClients, CountLicence]);

  const resetFilter = (e) => {
    e.preventDefault();
    setCountLicence(get_year_and_month_only(new Date()))
    setUsedLicence("");
    setSearchInput("")
    setSelectUserFIlter("")
    if (dashboard_filter === undefined) {
      setAllClients({
        loading: false,
        data: getAllClients.data,
      });
    }
  };


  useEffect(() => {
    const filteredData = originalData && originalData.filter((item) => {
      const userNameMatch = item.user.UserName.toLowerCase().includes(searchInput && searchInput.toLowerCase());
      let getMonthAndYear = get_year_and_month_only(item.createdAt)

      if (SelectUserFIlter === "") {
        return userNameMatch && (item.admin_license || item.license) && getMonthAndYear === CountLicence;
      } else if (SelectUserFIlter === "0") {
        return userNameMatch;
      } else if (SelectUserFIlter === "1") {
        return item.admin_license && userNameMatch && getMonthAndYear === CountLicence;
      } else if (SelectUserFIlter === "2") {
        return item.license && userNameMatch && getMonthAndYear === CountLicence
      } else {
        return true;
      }
    });

   // console.log("filteredData", filteredData);


    setAllClients({
      loading: false,
      data: {
        data: filteredData,
      },
    });

  }, [searchInput, SelectUserFIlter, CountLicence, originalData]);





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
            <div className="row flex">

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
              <div className="col-lg-3 ">
                <label class="form-label"
                >Licence Type</label>
                <select
                  name="symbols_filter"
                  className="default-select wide form-control spacing"
                  onChange={(e) => {
                    setSelectUserFIlter(e.target.value)
                  }}
                  value={SelectUserFIlter}
                >
                  <option value="" selected>Select Licence Type</option>
                  <option value="0" >All</option>
                  <option value="1" >Admin</option>
                  <option value="2" >Users</option>

                </select>
              </div>

              <div className="col-lg-3 mb-4 ">
                <div className="mb-3 row  d-flex flex-column">
                  <label
                    for="validationCustom05" class="form-label"
                  >
                    Please Select Month
                  </label>
                  <div className="col-lg-12 align-items-center d-flex ">
                    <input
                      type="month"
                      className="default-select wide  me-3 form-control"
                      id="validationCustom05"
                      max={get_year_and_month_only(new Date())}
                      onChange={(e) => setCountLicence(e.target.value)}
                      value={CountLicence}
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

              {dashboard_filter !== undefined ? "" : <>

                <div className="row mb-5">
                  <div className="col-2 mx-auto border border-dark text-center rounded-3">
                    <h6 >Start Date</h6>
                    <span >{ForPanelStartDate && ForPanelStartDate}</span>
                  </div>
                  <div className="col-2 mx-auto border border-dark text-center rounded-3">
                    <h6 >Total Licence</h6>
                    <h6 >
                      {ForShowTotalLicence && ForShowTotalLicence}
                    </h6>
                  </div>
                  <div className="col-2 mx-auto border border-dark text-center rounded-3">
                    <h6 >Total Used Licence</h6>
                    <h6 >{UsedLicence(getAllClients1)}</h6>
                  </div>
                  <div className="col-2 mx-auto  border border-dark text-center rounded-3">
                    <h6 >Remaining Licence</h6>
                    <h6 >
                      {ForShowTotalLicence && ForShowTotalLicence -
                        UsedLicence(getAllClients1)}
                    </h6>
                  </div>
                  <div className="col-2 mx-auto border border-dark text-center rounded-3">
                    <h6 >Current Month Licence</h6>
                    <span >
                      {usedLicence ? usedLicence : "Please Select Month"}
                    </span>
                  </div>
                </div>
              </>}

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
      )
      }
    </>
  );
};

export default AllLicence;
