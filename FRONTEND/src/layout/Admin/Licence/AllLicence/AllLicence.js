
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
  const [getAllClients, setAllClients] = useState({ loading: true, data: [] });
  const [getAllClients1, setAllClients1] = useState({ loading: true, data: [] });
  const [CountLicence, setCountLicence] = useState("");
  const [usedLicence, setUsedLicence] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [ForPanelStartDate, setForPanelStartDate] = useState("");
  const [ForShowTotalLicence, setForShowTotalLicence] = useState("");
  const [ForShowUsedLicence, setForShowUsedLicence] = useState(0);

  var headerName = "Transaction Licence"

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




  const data = async () => {
    try {
      const response = await dispatch(Transcation_Licence({ token })).unwrap();

      if (response.status) {
        const { data: responseData, used_licence, total_licence } = response;

        setForShowUsedLicence(used_licence);
        setForShowTotalLicence(total_licence);
        setForPanelStartDate(fDateTimeSuffix(responseData[responseData.length - 1].createdAt));

        let filteredData = responseData;

        if (dashboard_filter !== undefined) {
          filteredData = responseData.filter(item => {
            const getMonthAndYear = get_year_and_month_only(item.createdAt);
            if (dashboard_filter === "0" || dashboard_filter === 0) {
              return item.admin_license && (!CountLicence || getMonthAndYear === CountLicence);
            } else if (dashboard_filter === "1" || dashboard_filter === 1) {
              return !item.admin_license && (!CountLicence || getMonthAndYear === CountLicence);
            }
          });
        }

        if (searchInput) {
          filteredData = filteredData.filter(item =>
            item.user.UserName.toLowerCase().includes(searchInput.toLowerCase())
          );
        }

        setAllClients1({
          loading: false,
          data: filteredData,
        });

        setAllClients({
          loading: false,
          data: filteredData,
        });

      } else {
        setAllClients({
          loading: false,
          data: [],
        });
      }
    } catch (error) {
  
      setAllClients({ loading: false, data: null });
    }
  };

  useEffect(() => {
    data();
  }, [searchInput]);




  const ThisMonthUsedLicence = (val) => {


    // if (dashboard_filter === undefined) {
    if (getAllClients1.data !== undefined) {
      let filteredData = getAllClients1.data

      if (val) {
        filteredData = filteredData.filter(item => {
          const getMonthAndYear = get_year_and_month_only(item.createdAt);
          return getMonthAndYear == val;
        });


      } else {
        filteredData = getAllClients1.data
      }

      setAllClients({ loading: false, data: filteredData });



      const totalLicenses = filteredData.reduce((accumulator, currentValue) => {
        return accumulator + (parseInt(currentValue.license) || 0);
      }, 0);


      setUsedLicence(totalLicenses);
    }
    // }
  };







  const resetFilter = (e) => {
    e.preventDefault();
    setCountLicence(get_year_and_month_only(new Date()))
    setUsedLicence("");
    setSearchInput("")
    // if (dashboard_filter === undefined) {
    setAllClients({
      loading: false,
      data: getAllClients1.data,
    });
    // }
  };





  if (dashboard_filter === "1") {
    headerName = "Used License"
  } else if (dashboard_filter === "0") {
    headerName = "Total License"
  }



  return (
    <>
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title={headerName}
            Filter_tab={true}
            button_status={false}
          >
            <div className="row flex">

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



              <div className="col-lg-3 mb-4 ">
                <div className="mb-3 row  d-flex flex-column">
                  <label
                    for="validationCustom05" className="form-label"
                  >
                    Please Select Month
                  </label>
                  <div className="col-lg-12 align-items-center d-flex ">
                    <input
                      type="month"
                      className="default-select wide  me-3 form-control"
                      id="validationCustom05"
                      max={get_year_and_month_only(new Date())}
                      onChange={(e) => { setCountLicence(e.target.value); ThisMonthUsedLicence(e.target.value); }}
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
                    <h6 >{ForShowUsedLicence && ForShowUsedLicence}</h6>
                  </div>
                  <div className="col-2 mx-auto  border border-dark text-center rounded-3">
                    <h6 >Remaining Licence</h6>
                    <h6>
                      {Number.isFinite(ForShowTotalLicence) && Number.isFinite(ForShowUsedLicence) ? ForShowTotalLicence - ForShowUsedLicence : 0}
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
      )
      }
    </>
  );
};

export default AllLicence;
