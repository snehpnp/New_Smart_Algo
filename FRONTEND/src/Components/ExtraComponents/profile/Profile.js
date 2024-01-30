
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Content from "../../Dashboard/Content/Content";
import Formikform from "../Form/Formik_form1";
import { useFormik } from "formik";
import * as valid_err from "../../../Utils/Common_Messages";
import { fDate, fDateTime } from "../../../Utils/Date_formet";
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { Reset_Password } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import toast from "react-hot-toast";
import ToastButton from "../Alert_Toast";
import { Users } from 'lucide-react';
import Modify_update from "./Modify_update";

const UserProfile = () => {
  const dispatch = useDispatch();
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const user_role = JSON.parse(localStorage.getItem("user_role"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));

  const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))
  const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))


  const [UserDetails, setUserDetails] = useState({
    loading: true,
    data: [],
  });

  // User_Profile

  const data = async () => {
    await dispatch(User_Profile({ id: isgotodashboard ? gotodashboard.user_id : user_id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserDetails({
            loading: false,
            data: response.data,
          });
        }
      });
  };
  useEffect(() => {
    data();
  }, []);

  const fields = [
    {
      name: "oldpassword", label: "Old Password", type: "password", label_size: 12,
      col_size: 8,
    },
    {
      name: "newpassword", label: "New Password", type: "password", label_size: 12,
      col_size: 8,
    },
    {
      name: "confirmpassword", label: "Confirm Password", type: "password", label_size: 12,
      col_size: 8,
    },
  ]



  //  FOR RESET PASSWORD
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
        userid: user_id,
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
          console.log("Error", error);
        });
    },
  });




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
                      {/* <Users className="profile-img"/> */}
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
                        {/* <div className="profile-details d-block">
                          <div className="profile-name px-3 pb-3 ">
                            <p className="m-0"> User Name</p>
                            <h4>{UserDetails && UserDetails.data.FullName} </h4>
                          </div>
                          <div className="profile-email px-2 ">
                            <p className="m-0">Email</p>
                            <h4 className="text-muted mb-0">
                              {UserDetails && UserDetails.data.Email}
                            </h4>
                          </div>
                        </div> */}
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
                      {user_role === "SUBADMIN" || gotodashboard && gotodashboard.Role === "SUBADMIN" ? (
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
                      {user_role === "USER" ?

                        < li className="nav-item">
                          <a
                            href="#modify"
                            data-bs-toggle="tab"
                            className="nav-link"
                          >
                            Modify Updates
                          </a>
                        </li>
                        : user_role_goTo === "USER" && gotodashboard ?

                          < li className="nav-item">
                            <a
                              href="#modify"
                              data-bs-toggle="tab"
                              className="nav-link"
                            >
                              Modify Updates
                            </a>
                          </li>
                          : ""}
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
                              <span>
                                {UserDetails && UserDetails.data.FullName}
                              </span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-sm-3 col-5">
                              <h5 className="f-w-500">
                                Email <span className="pull-end">:</span>
                              </h5>
                            </div>
                            <div className="col-sm-9 col-7">
                              <span>
                                {UserDetails && UserDetails.data.Email}
                              </span>
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
                                {UserDetails && UserDetails.data.PhoneNo}
                              </span>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="col-sm-3 col-5">
                              <h5 className="f-w-500">
                              PANEL_CLIENT_KEY <span className="pull-end">:</span>
                              </h5>
                            </div>
                            <div className="col-sm-9 col-7">
                              <span>
                                {UserDetails && UserDetails.data.client_key}
                              </span>
                            </div>
                          </div>

                          {user_role === "USER" ? (
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
                                    {UserDetails.data.StartDate &&
                                      fDate(UserDetails.data.StartDate)}
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
                                    {UserDetails.data.EndDate &&
                                      fDate(UserDetails.data.EndDate)}
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
                                      UserDetails.data.license_type == "2" ? "Live" : UserDetails &&
                                        UserDetails.data.license_type == "1" ? "Demo" : "2 Days"}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      {/* {user_role === "SUBADMIN" || gotodashboard && gotodashboard.Role === "SUBADMIN" ? (
                        ""
                      ) : ( */}
                      <>
                        <div
                          id="modify"
                          className="tab-pane fade mt-3"
                        >
                          <h4 className="text-primary mb-4">
                            Modify Updates
                          </h4>
                          <Modify_update UserDetails={UserDetails && UserDetails} />

                        </div>
                      </>
                      {/* )} */}


                      {user_role === "USER" || user_role === "ADMIN" || !gotodashboard ?

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
                        : ""
                      }
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <ToastButton />
          </div>
        </div>
      </Content >
      )
    </>
  );
};

export default UserProfile;