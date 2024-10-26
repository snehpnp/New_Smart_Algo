import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Content from "../../Dashboard/Content/Content";
import Formikform from "../Form/Formik_form1";
import { useFormik } from "formik";
import * as valid_err from "../../../Utils/Common_Messages";
import { fDate } from "../../../Utils/Date_formet";
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { Reset_Password } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import toast from "react-hot-toast";
import ToastButton from "../Alert_Toast";
import Modify_update from "./Modify_update";
import { Modal, Button, Table } from "react-bootstrap";
import {
  USER_FUND_UPDATE_API,
  USER_FUND_GETALL_API,
} from "../../../ReduxStore/Slice/Users/DashboardSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const user_role = JSON.parse(localStorage.getItem("user_role"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));

  const gotodashboard = JSON.parse(localStorage.getItem("user_details_goTo"));
  const isgotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));

  const [UserDetails, setUserDetails] = useState([]);
  const [selectedOption, setSelectedOption] = useState("stock");
  const [fundValue, setFundValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  const [UserLogs, setUserLogs] = useState([]);

  useEffect(() => {
    data();
  }, []);

  const data = async () => {
    const userId = isgotodashboard
      ? gotodashboard.user_id
      : user_details.user_id;
    const token = isgotodashboard ? gotodashboard.token : user_details.token;

    await dispatch(
      User_Profile({
        id: userId,
        token: token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserDetails(response.data || []);
          if (response.data && response.data.fund_type) {
            setSelectedOption(response.data.fund_type);
          }
          if (response.data && response.data.fund_value) {
            if (response.data.fund_type === "fund") {
              setFundValue(response.data.fund_value);
            } else if (response.data.fund_type === "percentage") {
              setPercentageValue(response.data.fund_value);
            }
          }
        } else {
          setUserDetails([]);
        }
      });

    await dispatch(USER_FUND_GETALL_API({ user_id: userId, token: token }))
      .unwrap()
      .then((response) => {

        if (response.status) {
      
          setUserLogs(response.data || []);
        } else {
          setUserLogs([]);
         
        }
      });
  };

  const fields = [
    {
      name: "oldpassword",
      label: "Old Password",
      type: "password",
      label_size: 12,
      col_size: 8,
    },
    {
      name: "newpassword",
      label: "New Password",
      type: "password",
      label_size: 12,
      col_size: 8,
    },
    {
      name: "confirmpassword",
      label: "Confirm Password",
      type: "password",
      label_size: 12,
      col_size: 8,
    },
  ];

  const formik = useFormik({
    initialValues: {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.oldpassword) {
        errors.oldpassword = valid_err.OLD_PASSWORD_ERROR;
      }
      if (!values.newpassword) {
        errors.newpassword = valid_err.NEW_PASSWORD_ERROR;
      }
      if (!values.confirmpassword) {
        errors.confirmpassword = valid_err.CONFIRM_PASSWORD_ERROR;
      } else if (values.newpassword !== values.confirmpassword) {
        errors.confirmpassword = valid_err.CONFIRM_AND_NEW_PASSWORD_ERROR;
      }

      return errors;
    },
    onSubmit: async (values) => {
      let req = {
        oldpassword: values.oldpassword,
        newpassword: values.newpassword,
        userid: user_details.user_id,
      };
      await dispatch(Reset_Password(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.message);
          }
          if (response.response.status === 409) {
            toast.error(response.response.data.message);
          }
        })
        .catch((error) => {
          return;
        });
    },
  });

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setErrorMessage("");
    if (e.target.value === "stock") {
      setFundValue("");
      setPercentageValue("");
    }
  };

  const handleSubmit = () => {
    if (selectedOption === "fund" && !fundValue) {
      setErrorMessage("Please enter a valid fund amount.");
      return;
    }

    if (
      selectedOption === "percentage" &&
      (!percentageValue || percentageValue < 1 || percentageValue > 100)
    ) {
      setErrorMessage("Please enter a percentage between 1 and 100.");
      return;
    }

    setErrorMessage("");

    let requestData = {
      user_id: UserDetails._id,
      fund_type: selectedOption,
      fund_value: selectedOption === "fund" ? fundValue : percentageValue,
    };

    dispatch(USER_FUND_UPDATE_API(requestData))
      .unwrap()
      .then((response) => {
   
        if (response.status) {
          toast.success(response.msg);
        } else {
          toast.error(response.msg);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while updating the fund.");
      });
  };

  const handleClose = () => setShow(false);
  const handleShowModal = () => setShow(true);


  return (
    <>
      <Content Page_title="UserProfile" button_status={false}>
        <div className="row">
          <div className="col-xl-4">
            <div className="row">
              <div className="col-xl-12">
                <div className="card form-card">
                  <div className="card-body">
                    <div className="profile-blog">
                      <h5 className="text-primary d-block">User Profile</h5>

                      <img
                        src="../assets/avatar.jpg"
                        className="profile-img"
                        alt="Profile Photo"
                      ></img>

                      <div className="profile-info">
                        <div className="profile-photo">
                          <img
                            src="images/profile/profile.png"
                            className="img-fluid rounded-circle"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card form-card">
              <div className="card-body">
                <div className="profile-tab">
                  <div className="custom-tab-1">
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a
                          href="#about-me"
                          data-bs-toggle="tab"
                          className="nav-link"
                        >
                          About Me
                        </a>
                      </li>
                      {user_role === "SUBADMIN" ||
                      (gotodashboard && gotodashboard.Role === "SUBADMIN") ? (
                        ""
                      ) : (
                        <li className="nav-item">
                          <a
                            href="#profile-settings"
                            data-bs-toggle="tab"
                            className="nav-link"
                          >
                            Change Password
                          </a>
                        </li>
                      )}
                      {user_role === "USER" ? (
                        <li className="nav-item">
                          <a
                            href="#modify"
                            data-bs-toggle="tab"
                            className="nav-link"
                          >
                            Modify Updates
                          </a>
                        </li>
                      ) : user_role_goTo === "USER" && gotodashboard ? (
                        <li className="nav-item">
                          <a
                            href="#modify"
                            data-bs-toggle="tab"
                            className="nav-link"
                          >
                            Modify Updates
                          </a>
                        </li>
                      ) : (
                        ""
                      )}

                      {(UserDetails.license_type == "2" && UserDetails.broker == "19")  && (
                        <li className="nav-item">
                          <a
                            href="#fund-management"
                            data-bs-toggle="tab"
                            className="nav-link"
                          >
                            Stock Fund
                          </a>
                        </li>
                      )} 
                    </ul>

                    <div className="tab-content">
                      <div id="about-me" className="tab-pane fade active show">
                        <div className="profile-personal-info pt-3">
                          <h4 className="text-primary mb-4">
                            Personal Information
                          </h4>
                          <div className="row mb-2">
                            <div className="col-sm-3 col-5">
                              <h5 className="f-w-500">
                                Name <span className="pull-end">:</span>
                              </h5>
                            </div>
                            <div className="col-sm-9 col-7">
                              <span>{UserDetails && UserDetails.FullName}</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-sm-3 col-5">
                              <h5 className="f-w-500">
                                Email <span className="pull-end">:</span>
                              </h5>
                            </div>
                            <div className="col-sm-9 col-7">
                              <span>{UserDetails && UserDetails.Email}</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-sm-3 col-5">
                              <h5 className="f-w-500">
                                Contact <span className="pull-end">:</span>
                              </h5>
                            </div>
                            <div className="col-sm-9 col-7">
                              <span>
                                {UserDetails &&
                                  UserDetails.PhoneNo &&
                                  `${"*".repeat(
                                    UserDetails.PhoneNo.length - 4
                                  )}${UserDetails.PhoneNo.slice(-4)}`}
                              </span>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="col-sm-3 col-5">
                              <h5 className="f-w-500">
                                PANEL_CLIENT_KEY{" "}
                                <span className="pull-end">:</span>
                              </h5>
                            </div>
                            <div className="col-sm-9 col-7">
                              <span>
                                {UserDetails && UserDetails.client_key}
                              </span>
                            </div>
                          </div>

                          { user_role === "USER" ||( isgotodashboard == true && gotodashboard.Role=="USER" )? (
                            <>
                              <div className="row mb-2">
                                <div className="col-sm-3 col-5">
                                  <h5 className="f-w-500">
                                    Start-Date
                                    <span className="pull-end">:</span>
                                  </h5>
                                </div>
                                <div className="col-sm-9 col-7">
                                  <span>
                                    {UserDetails.StartDate &&
                                      fDate(UserDetails.StartDate)}
                                  </span>
                                </div>
                              </div>
                              <div className="row mb-2">
                                <div className="col-sm-3 col-5">
                                  <h5 className="f-w-500">
                                    End Date <span className="pull-end">:</span>
                                  </h5>
                                </div>
                                <div className="col-sm-9 col-7">
                                  <span>
                                    {UserDetails.EndDate &&
                                      fDate(UserDetails.EndDate)}
                                  </span>
                                </div>
                              </div>

                              <div className="row mb-2">
                                <div className="col-sm-3 col-5">
                                  <h5 className="f-w-500">
                                    Client Type
                                    <span className="pull-end">:</span>
                                  </h5>
                                </div>
                                <div className="col-sm-9 col-7">
                                  <span>
                                    {UserDetails &&
                                    UserDetails.license_type == "2"
                                      ? "Live"
                                      : UserDetails &&
                                        UserDetails.license_type == "1"
                                      ? "Free Demo"
                                      : "Free 2 Days"}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div id="modify" className="tab-pane fade mt-3">
                        <h4 className="text-primary mb-4">Modify Updates</h4>
                        <Modify_update
                          UserDetails={UserDetails && UserDetails}
                        />
                      </div>
                      {user_role === "USER" ||
                      user_role === "ADMIN" ||
                      !gotodashboard ? (
                        <>
                          <div
                            id="profile-settings"
                            className="tab-pane fade mt-3"
                          >
                            <h4 className="text-primary mb-4">
                              Change Password
                            </h4>
                            {gotodashboard ? (
                              ""
                            ) : (
                              <Formikform
                                fieldtype={fields.filter(
                                  (field) =>
                                    !field.showWhen ||
                                    field.showWhen(formik.values)
                                )}
                                formik={formik}
                                btn_name="Update"
                                title="forlogin"
                              />
                            )}
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <div id="fund-management" className="tab-pane fade">
                        <div className="profile-personal-info pt-3">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-primary">Fund Management</h4>
                            <button
                              type="button"
                              className="btn btn-link p-0"
                              onClick={handleShowModal}
                            >
                              <i
                                className="bi bi-info-circle"
                                style={{ fontSize: "1.5rem", color: "#0d6efd" }}
                              ></i>
                            </button>
                          </div>

                          <div className="row mb-2">
                            <div className="row align-items-center">
                              <div className="col-sm-9 col-7">
                                {/* Radio Buttons */}
                                <div className="form-check form-check-inline">
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id="stockWise"
                                    name="option"
                                    value="stock"
                                    checked={selectedOption === "stock"}
                                    onChange={handleOptionChange}
                                    disabled={isgotodashboard}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="stockWise"
                                  >
                                    Stock Wise
                                  </label>
                                </div>

                                <div className="form-check form-check-inline">
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id="fundWise"
                                    name="option"
                                    value="fund"
                                    checked={selectedOption === "fund"}
                                    onChange={handleOptionChange}
                                    disabled={isgotodashboard}

                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="fundWise"
                                  >
                                    Fund Wise
                                  </label>
                                </div>

                                <div className="form-check form-check-inline">
                                  <input
                                    type="radio"
                                    className="form-check-input"
                                    id="percentageWise"
                                    name="option"
                                    value="percentage"
                                    checked={selectedOption === "percentage"}
                                    onChange={handleOptionChange}
                                    disabled={isgotodashboard}

                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="percentageWise"
                                  >
                                    Percentage Wise
                                  </label>
                                </div>

                                {/* Conditional Inputs */}
                                {selectedOption === "fund" && (
                                  <div className="mt-3">
                                    <label htmlFor="fundInput">
                                      Enter Fund Amount:
                                    </label>
                                    <input
                                      type="number"
                                      id="fundInput"
                                      className="form-control"
                                      placeholder="Enter fund amount"
                                      value={fundValue}
                                    disabled={isgotodashboard}

                                      onChange={(e) =>
                                        setFundValue(e.target.value)
                                      }
                                    />
                                  </div>
                                )}

                                {selectedOption === "percentage" && (
                                  <div className="mt-3">
                                    <label htmlFor="percentageInput">
                                      Enter Percentage:
                                    </label>
                                    <input
                                      type="number"
                                      id="percentageInput"
                                      className="form-control"
                                      placeholder="Enter percentage (1 to 100)"
                                      value={percentageValue}
                                    disabled={isgotodashboard}

                                      min={1}
                                      max={100}
                                      onChange={(e) =>
                                        setPercentageValue(e.target.value)
                                      }
                                    />
                                  </div>
                                )}

                                {/* Error Message */}
                                {errorMessage && (
                                  <div className="text-danger mt-2">
                                    {errorMessage}
                                  </div>
                                )}

                                {/* Submit Button */}
                                {isgotodashboard  == null && <div className="mt-3">
                                 
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                  >
                                    Submit
                                  </button>

                                </div>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToastButton />
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Fund Management History</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* History Table */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Fund Status</th>
                  <th>Fund Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {UserLogs && UserLogs.length > 0 ? (
                  UserLogs.map((record, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{record.fund_status || "-"}</td>
                      <td>{record.fund_amount || "-"}</td>
                      <td>
                        {record.createdAt ? fDate(record.createdAt) : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Content>
    </>
  );
};

export default UserProfile;
