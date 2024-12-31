/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import Logo from "./Logo";
import DropDown from "./DropDown";
import Notification from "../../ExtraComponents/Notification";
import { useDispatch } from "react-redux";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import Modal1 from "../../../Components/ExtraComponents/Modal";
import UpdateBrokerKey from "./Update_Broker_Key";
import { loginWithApi } from "./log_with_api";
import {
  User_Profile,
  GET_MESSAGE_BRODS,
} from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { Get_Pmermission } from "../../../ReduxStore/Slice/Users/DashboardSlice";

import { check_Device } from "../../../Utils/find_device";
import { GET_HELPS } from "../../../ReduxStore/Slice/Admin/AdminHelpSlice";
import { Log_Out_User } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import { TRADING_OFF_USER } from "../../../ReduxStore/Slice/Users/DashboardSlice";
import { Get_Company_Logo } from "../../../ReduxStore/Slice/Admin/AdminSlice";
import jwt_decode from "jwt-decode";
import { GET_IP } from "../../../Service/common.service";
import { Update_Broker_Keys } from "../../../ReduxStore/Slice/Users/BrokerUpdateSlice";
import Swal from "sweetalert2";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";

import * as Config from "../../../Utils/Config";

import { Modal, Button } from "react-bootstrap";
const Header = ({ ChatBox }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setshowModal] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [UserDetails, setUserDetails] = useState([]);
  const [CheckUser, setCheckUser] = useState(check_Device());
  const [getAllClients, setAllClients] = useState({ loading: true, data: [] });
  const [messageData, SetMessageData] = useState({ loading: true, data: [] });
  const [formValues, setFormValues] = useState({
    userId: "",
    password: "",
    otp: "",
  });

  const [formValuesErr, setFormValuesErr] = useState({
    userId: "",
    password: "",
    otp: "",
  });

  const [activeTab, setActiveTab] = useState("mobile");
  const [getLogo, setLogo] = useState("");
  const [ip, setIp] = useState("");
  const [getPlanName, setPlanName] = useState("");
  const [shoonyaStatus, setShoonyaStatus] = useState(false);
  const [kotakStatus, setKotakStatus] = useState(false);
  const [kotakStatus1, setKotakStatus1] = useState(false);
  const [admin_permission, setAdmin_permission] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const user_details = JSON.parse(localStorage.getItem("user_details"));
  let theme_id = localStorage.getItem("theme");
  const page = localStorage.getItem("page");
  const routePath = localStorage.getItem("route");
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));
  const user_role = JSON.parse(localStorage.getItem("user_role"));
  const UserNamego_localstg = JSON.parse(
    localStorage.getItem("user_details_goTo")
  );

  const AdminToken = JSON.parse(localStorage.getItem("user_details"))?.token;

  useEffect(() => {
    CompanyName();
  }, []);
  useEffect(() => {
    GET_IP().then((response) => {
      setIp(response.data.ip);
    });
  }, []);

  useEffect(() => {
    if (user_role == "ADMIN") {
      Notfication();
    }
  }, []);

  useEffect(() => {
    AdminPermissions();
    ClearSession();
  }, []);

  useEffect(() => {
    fetchUserProfile();
    message_brod();
  }, [refresh]);

  const AdminPermissions = async () => {
    await dispatch(
      Get_Pmermission({
        domain: Config.react_domain,
        token: user_details.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAdmin_permission({
            loading: false,
            data: response.data,
          });
        } else {
          setAdmin_permission({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  if (theme_id != null) {
    let themedata = JSON.parse(theme_id);
    $("body").removeClass(
      "theme-1 theme-2 theme-3 theme-4 theme-5 theme-6 theme-7 theme-8 theme-9  theme-10"
    );
    $("body").addClass(themedata.dashboard);

    $("body").attr("data-dashboard", `${themedata.dashboard}-dashboard`);
    $("body").attr("data-theme-version", themedata.theme_version);
    $("body").attr("data-primary", themedata.primary_col);
    $("body").attr("data-nav-headerbg", themedata.nav_head_col);
    $("body").attr("data-headerbg", themedata.header_col);
    $("body").attr("data-sibebarbg", themedata.sidebar_col);

    if ($("body").attr("data-sidebar-style") === "overlay") {
      $("body").attr("data-sidebar-style", "full");
      $("body").attr("data-layout", themedata.layout);
      return;
    }
    $("body").attr("data-layout", themedata.layout);
    if ($("body").attr("data-layout") === "horizontal") {
      if (themedata.sidebar === "overlay") {
        alert("Sorry! Overlay is not possible in Horizontal layout.");
        return;
      }
    }
    if ($("body").attr("data-layout") === "vertical") {
      if (
        $("body").attr("data-container") === "boxed" &&
        themedata.sidebar === "full"
      ) {
        alert("Sorry! Full menu is not available in Vertical Boxed layout.");
        return;
      }
      if (
        themedata.sidebar === "modern" &&
        $("body").attr("data-sidebar-position") === "fixed"
      ) {
        alert(
          "Sorry! Modern sidebar layout is not available in the fixed position. Please change the sidebar position into Static."
        );
        return;
      }
    }
    $("body").attr("data-sidebar-style", themedata.sidebar);
    if ($("body").attr("data-sidebar-style") === "icon-hover") {
      $(".deznav").on(
        "hover",
        function () {
          $("#main-wrapper").addClass("iconhover-toggle");
        },
        function () {
          $("#main-wrapper").removeClass("iconhover-toggle");
        }
      );
    }

    $("body").attr("data-header-position", themedata.header_position);
    $("body").attr("data-sidebar-position", themedata.sidebar_position);
    $("body").attr("data-typography", themedata.body_font);
    if (themedata.container === "boxed") {
      if (
        $("body").attr("data-layout") === "vertical" &&
        $("body").attr("data-sidebar-style") === "full"
      ) {
        $("body").attr("data-sidebar-style", "overlay");
        $("body").attr("data-container", themedata.container);
        setTimeout(function () {
          $(window).trigger("resize");
        }, 200);
        return;
      }
    }
    $("body").attr("data-container", themedata.container);

    $(window).on("resize", function () {
      var windowWidth = $(this).width();
      if (windowWidth > 1024) {
        $("body").attr("data-sidebar-style", "full");
      } else if (windowWidth > 769 && windowWidth <= 1024) {
        $("body").attr("data-sidebar-style", "mini");
      } else if (windowWidth <= 767) {
        $("body").attr("data-sidebar-style", "overlay");
      }
    });
  }

  const handleTabChange = (tab) => {
    if (tab === "mobile") {
      setActiveTab(tab);
      setUsername("");
      setPassword("");
      setErrors({ username: "", password: "" });
    } else {
      Swal.fire({
        title: "Coming Soon!",
        text: "This feature is under development.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const handleBackClick = () => {
    setUsername("");
    setPassword("");
    setErrors({ username: "", password: "" });
    setKotakStatus(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input if backspace is pressed
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleNextClick = () => {
    let newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios({
        url: `${Config.base_url}kotakGetToken`,
        method: "post",
        data: {
          Email: UserDetails.Email,
          username: username,
          password: password,
        },
      }).then((res) => {
        if (res.data.status) {
          setKotakStatus1(true);
        } else {
          toast.error(res.data.msg);
        }
      });
    }
  };

  const handleSubmit = () => {
    if (otp.join("").length < 4) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid OTP.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    axios({
      url: `${Config.base_url}kotakGetSession`,
      method: "post",
      data: {
        Email: UserDetails.Email,
        otp: otp.join(""),
      },
    }).then((res) => {
      if (res.data.status == true) {
        toast.success(res.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (res.data.status == false) {
        toast.error(res.data.msg);
      }
    });
  };

  const handleBack = () => {
    setUsername("");
    setPassword("");
    setErrors({ username: "", password: "" });
    setKotakStatus(false);
    setKotakStatus1(false);
    setOtp(["", "", "", ""]);
  };

  // Redirect to Admin Page
  const redirectToAdmin = () => {
    if (page != null) {
      navigate("/admin/" + page);
      localStorage.removeItem("page");
      window.location.reload();
      localStorage.removeItem("gotodashboard");
      localStorage.removeItem("user_details_goTo");
      localStorage.removeItem("user_role_goTo");
      localStorage.removeItem("route");
      setTimeout(() => {
        localStorage.removeItem("user_details_goTo");
        localStorage.removeItem("user_role_goTo");
      }, 1000);
    } else {
      navigate(routePath);

      window.location.reload();
      localStorage.removeItem("gotodashboard");
      localStorage.removeItem("user_details_goTo");
      localStorage.removeItem("user_role_goTo");
      localStorage.removeItem("route");
      setTimeout(() => {
        localStorage.removeItem("user_details_goTo");
        localStorage.removeItem("user_role_goTo");
      }, 1000);
    }
  };

  //  BROKER LOGIN
  const LogIn_WIth_Api = (check, brokerid, tradingstatus, UserDetails) => {
    if (check) {
      if (
        UserDetails.WebLoginStatus == "0" &&
        UserDetails.AppLoginStatus == "0"
      ) {
        Swal.fire({
          title: "Error!",
          text: "You Are Login is Compleceted Please Re-Login Again",
          icon: "error",
          confirmButtonText: "OK",
        });
        // clear localstorage
        localStorage.clear();
        window.location.reload();

        return;
      }

      if (brokerid == 27) {
        setShoonyaStatus(!shoonyaStatus);
      } else if (brokerid == 7) {
        setKotakStatus(!kotakStatus);
      } else {
        loginWithApi(brokerid, UserDetails, check);
      }
    } else {
      dispatch(
        TRADING_OFF_USER({
          user_id: user_details.user_id,
          device: CheckUser,
          network_ip: ip,
          token: user_details.token,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            setrefresh(!refresh);
          }
        });
    }
  };

  //  GET_USER_DETAILS
  const fetchUserProfile = async () => {
    try {
      const userId = gotodashboard
        ? UserNamego_localstg.user_id
        : user_details.user_id;
      const token = gotodashboard
        ? UserNamego_localstg.token
        : user_details.token;

      const response = await dispatch(
        User_Profile({
          id: userId,
          token: token,
        })
      ).unwrap();

      if (response.status) {
        if (response.PlanName) {
          setPlanName(response.PlanName);
        }

        if (response.data.ActiveStatus == "0") {
          localStorage.clear();
          window.location.reload();
        }
        localStorage.setItem(
          "servicegivenmonth",
          response.data.service_given_month
            ? response.data.service_given_month
            : "0"
        );

        localStorage.setItem(
          "broker",
          response.data.broker ? response.data.broker : "0"
        );

        setUserDetails(response.data);
      } else {
        if (
          (response.msg === "Unauthorized!" ||
            response.msg === "No token provided!!") &&
          !gotodashboard
        ) {
          localStorage.clear();
          window.location.reload();
        } else {
          console.warn("Unexpected response:", response);
        }
      }
    } catch (error) { }
  };

  //  GET_USER_DETAILS
  const message_brod = async () => {
    if (user_details.Role == "USER") {
      await dispatch(GET_MESSAGE_BRODS({ id: user_details.user_id }))
        .unwrap()
        .then((response) => {
          if (response.status) {
            SetMessageData({ loading: false, data: response.data });
          }
        });
    }
  };

  //  For Show Notfication
  const Notfication = async () => {
    if (user_role == "ADMIN") {
      await dispatch(
        GET_HELPS({ user_id: user_details.user_id, token: user_details.token })
      )
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
    }
  };

  const ClearSession = async () => {
    var decoded = jwt_decode(user_details.token);

    if (decoded.exp * 1000 < new Date().getTime()) {
      const request = {
        userId: user_details.user_id,
        Device: CheckUser,
      };

      await dispatch(Log_Out_User(request))
        .then((res) => {
          if (res.payload.status) {
            localStorage.removeItem("user_role");
            localStorage.removeItem("user_details");
            localStorage.clear();
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            localStorage.removeItem("user_role");
            localStorage.removeItem("user_details");
            localStorage.clear();
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        })
        .catch((error) => {
          return;
        });
    }
  };

  const CompanyName = async () => {
    await dispatch(Get_Company_Logo())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setLogo(response.data[0].logo);
          $(".Company_logo").html(response.data && response.data[0].panel_name);

          localStorage.setItem('Watermark', response.data?.[0]?.watermark);

          $(".watermarkId").css({
            "background-image": `url(${response?.data?.[0]?.watermark})`,

          });


          $(".set_Favicon");
        }

      });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Clear the error message when the user types something valid
    setFormValuesErr((prevState) => ({
      ...prevState,
      [id]: "",
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let hasError = false;

    // Check if User ID is empty
    if (formValues.userId === "") {
      setFormValuesErr((prevState) => ({
        ...prevState,
        userId: "Please enter User ID",
      }));
      hasError = true;
    }

    // Check if Password is empty
    if (formValues.password === "") {
      setFormValuesErr((prevState) => ({
        ...prevState,
        password: "Please enter Password",
      }));
      hasError = true;
    }

    // Check if OTP is empty
    if (formValues.otp === "") {
      setFormValuesErr((prevState) => ({
        ...prevState,
        otp: "Please enter OTP",
      }));
      hasError = true;
    }

    // If any errors exist, prevent submission
    if (hasError) return;

    // Prepare the request payload
    const req = {
      id: user_details.user_id,
      data: {
        demat_userid: formValues.userId,
        app_id: formValues.password,
        app_key: formValues.otp,
      },
    };

    // Dispatch the Update_Broker_Keys action
    await dispatch(Update_Broker_Keys({ req: req, token: AdminToken }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setShoonyaStatus(false);
          setFormValues({
            userId: "",
            password: "",
            otp: "",
          });

          // Trigger additional login logic
          loginWithApi(27, UserDetails, true);
        }
      })
      .catch((error) => {
      });
  };

  return (
    <div className="header-container">
      <Logo data={getLogo && getLogo} />
      <div className="header" style={{ position: "fixed" }}>
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                {user_role === "USER" && UserDetails.license_type != 1 ? (
                  <>
                    <div className="headaer-title">
                      <h3
                        className="font-w400 mb-0 pe-1"
                        style={{ marginLeft: "15px" }}
                      >
                        Api Login{" "}
                      </h3>
                    </div>

                    <div className="Api Login">
                      <label className="switch mb-0">
                        <input
                          type="checkbox"
                          className="bg-primary"
                          checked={
                            UserDetails.TradingStatus === "on" ? true : false
                          }
                          onClick={(e) =>
                            LogIn_WIth_Api(
                              e.target.checked,
                              UserDetails.broker,
                              UserDetails.TradingStatus,
                              UserDetails
                            )
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>

              <ul className="navbar-nav header-right">
                {gotodashboard != null ? (
                  <li className="nav-item dropdown header-profile">
                    <>
                      <li className="nav-item dropdown gotodashboard">
                        <button
                          onClick={() => redirectToAdmin()}
                          type="button"
                          className="btn btn-primary text-white"
                        >
                          Go to Admin
                        </button>
                      </li>
                    </>
                  </li>
                ) : null}

                {admin_permission.data?.length > 0 &&
                  admin_permission.data[0]?.Plans &&
                  user_role === "USER" &&
                  getPlanName ? (
                  <li className="nav-item dropdown header-profile me-2">
                    <button
                      className=" btn btn-primary px-2"
                      onClick={() => navigate("/client/plan")}
                    >
                      {getPlanName}
                    </button>
                  </li>
                ) : null}

                <>
                  {user_role === "ADMIN" ||
                    (gotodashboard && user_role_goTo == "USER") ? (
                    <li className="nav-item dropdown header-profile me-2">
                      <button
                        className="btn btn-primary px-2"
                        onClick={() => setshowModal(true)}
                      >
                        Set API Key
                      </button>
                    </li>
                  ) : null}

                  {user_role === "USER" &&
                    (UserDetails.license_type == "2" ||
                      UserDetails.license_type == "0") ? (
                    <li className="nav-item dropdown header-profile me-2">
                      <button
                        className="btn btn-primary px-2"
                        onClick={() => setshowModal(true)}
                      >
                        Set API Key
                      </button>
                    </li>
                  ) : null}

                  <li className="nav-item dropdown header-profile user-name me-2">
                    {UserNamego_localstg != null ? (

                      <button className=" btn btn-primary px-2">
                        {UserNamego_localstg?.FullName}
                      </button>
                    ) : (
                      <button className=" btn btn-primary px-2">
                        {user_details?.FullName}
                      </button>
                    )}
                  </li>
                </>

                {user_role === "ADMIN" ? (
                  <>
                    <Notification status="1" NotificationData={getAllClients} />
                  </>
                ) : user_role === "USER" ? (
                  <>
                    <Notification status="2" NotificationData={messageData} />
                  </>
                ) : (
                  ""
                )}

                <li className="nav-item dropdown header-profile ">
                  <DropDown />
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <Modal1
          isOpen={showModal}
          backdrop="static"
          size="ms-5"
          title="Update Broker Key"
          hideBtn={true}
          handleClose={() => setshowModal(false)}
        >
          <UpdateBrokerKey closeModal={() => setshowModal(false)} />
        </Modal1>
      </div>

      {/* SHOONYA LOGIN PAGE */}
      {shoonyaStatus && (
        <div>
          <Modal
            show={shoonyaStatus}
            centered
            size={"xl"}
            backdrop={"static"}
            onHide={() => setShoonyaStatus(false)}
            fullscreen={true} // Fullscreen modal
          >
            <Modal.Body>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: 20,
                  borderRadius: 10,
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  maxWidth: "80%", // Increase width
                  maxHeight: "80%", // Increase height
                  textAlign: "center",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  {/* Logo */}
                  <div className="logo">
                    <img
                      src="https://trade.shoonya.com/NorenLogoLS.png"
                      alt="Shoonya Logo"
                      style={{ width: 50, marginBottom: 20 }}
                    />
                  </div>

                  {/* Title */}
                  <h2 style={{ marginBottom: 20, color: "#333" }}>
                    Login to SHOONYA
                  </h2>

                  {/* Form */}
                  <form onSubmit={handleLogin}>
                    {/* User ID */}
                    <div style={{ marginBottom: 15, textAlign: "left" }}>
                      <label
                        htmlFor="user-id"
                        style={{
                          display: "block",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        User ID
                      </label>
                      <input
                        type="text"
                        id="userId"
                        placeholder="Enter User ID"
                        value={formValues.userId}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: 10,
                          marginTop: 5,
                          border: "1px solid #ccc",
                          borderRadius: 5,
                          fontSize: 16,
                        }}
                      />

                      {formValuesErr.userId && (
                        <span style={{ color: "red", fontSize: 12 }}>
                          {formValuesErr.userId}
                        </span>
                      )}
                    </div>

                    {/* Password */}
                    <div
                      style={{
                        marginBottom: 15,
                        textAlign: "left",
                        position: "relative",
                      }}
                    >
                      <label
                        htmlFor="password"
                        style={{
                          display: "block",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter Password"
                        value={formValues.password}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: 10,
                          marginTop: 5,
                          border: "1px solid #ccc",
                          borderRadius: 5,
                          fontSize: 16,
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          right: 20,
                          top: 49,
                          cursor: "pointer",
                        }}
                      >
                        👁️
                      </span>
                      {formValuesErr.password && (
                        <span style={{ color: "red", fontSize: 12 }}>
                          {formValuesErr.password}
                        </span>
                      )}
                    </div>

                    {/* OTP */}
                    <div style={{ marginBottom: 15, textAlign: "left" }}>
                      <label
                        htmlFor="otp"
                        style={{
                          display: "block",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        OTP/TOTP
                      </label>
                      <input
                        type="text"
                        id="otp"
                        placeholder="Enter OTP"
                        value={formValues.otp}
                        onChange={handleInputChange}
                        style={{
                          width: "100%",
                          padding: 10,
                          marginTop: 5,
                          border: "1px solid #ccc",
                          borderRadius: 5,
                          fontSize: 16,
                        }}
                      />

                      {formValuesErr.otp && (
                        <span style={{ color: "red", fontSize: 12 }}>
                          {formValuesErr.otp}
                        </span>
                      )}
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: 10,
                        backgroundColor: "#d4a023",
                        border: "none",
                        borderRadius: 5,
                        color: "white",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      Login
                    </button>
                  </form>

                  {/* Back Button */}
                  <button
                    onClick={() => setShoonyaStatus(false)} // Close modal on click
                    style={{
                      marginTop: 20,
                      padding: 10,
                      backgroundColor: "#ccc",
                      border: "none",
                      borderRadius: 5,
                      color: "#333",
                      fontSize: 16,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Back
                  </button>

                  {/* Footer */}
                  <div style={{ marginTop: 20, fontSize: 12, color: "#999" }}>
                    <img
                      src="https://algosworld.com/assets/images/partners/broker-finvasia.png"
                      alt="Finvasia Logo"
                      style={{ width: 141, marginBottom: 10 }}
                    />
                    <p>NSE | BSE | MCX | NCDEX</p>
                    <p>SEBI | SEBI Registration</p>
                    <p>
                      Version: 1.2.0 | Privacy Policy | All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}

      {/* KOTAL LOGIN PAGE */}
      {kotakStatus && (
        <div>
          <Modal
            show={kotakStatus}
            centered
            size={"xl"}
            backdrop={"static"}
            onHide={() => setKotakStatus(false)}
            fullscreen={true}
          >
            <Modal.Body
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#d8ecff",
              }}
            >
              <div className="col-12 col-md-8 mx-auto">
                <div className="row">
                  <div className="col-md-6">
                    <div>
                      <img
                        src="./assets/images/kotakneo.png"
                        alt="Kotak Neo"
                        style={{ width: "66px" }}
                      />

                      <h1
                        style={{
                          color: "#1b3e81",
                          fontSize: "2rem",
                          marginBottom: "20px",
                        }}
                      >
                        Welcome to the new <br /> age of investing
                      </h1>
                      <ul
                        style={{
                          listStyle: "none",
                          color: "#1b3e81",
                          marginBottom: "30px",
                        }}
                      >
                        <li style={{ marginBottom: "10px" }}>
                          Great product experience
                        </li>
                        <li style={{ marginBottom: "10px" }}>
                          Amazing customer support
                        </li>
                        <li style={{ marginBottom: "10px" }}>Years of trust</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "50px",
                        borderRadius: "10px",
                        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {kotakStatus1 ? (
                        // OTP Section
                        <div>
                          <h2 style={{ marginBottom: "20px", color: "#333" }}>
                            Enter OTP
                          </h2>
                          <p style={{ marginBottom: "30px", color: "#666" }}>
                            Please enter the 4-digit OTP sent to your mobile
                            number.
                          </p>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginBottom: "30px",
                            }}
                          >
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                style={{
                                  width: "60px",
                                  padding: "15px",
                                  fontSize: "1.5rem",
                                  textAlign: "center",
                                  border: "2px solid #007bff",
                                  borderRadius: "8px",
                                  margin: "0 5px",
                                  outline: "none",
                                }}
                              />
                            ))}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <button
                              onClick={handleSubmit}
                              style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                padding: "15px",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "1rem",
                                cursor: "pointer",
                                marginBottom: "15px",
                                transition: "background-color 0.3s",
                              }}
                              onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#0056b3")
                              }
                              onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#007bff")
                              }
                            >
                              Submit
                            </button>
                            <button
                              onClick={handleBack}
                              style={{
                                backgroundColor: "#d8ecff",
                                color: "#1b3e81",
                                padding: "15px",
                                border: "1px solid #1b3e81",
                                borderRadius: "8px",
                                fontSize: "1rem",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                              }}
                              onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#a8d6ff")
                              }
                              onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#d8ecff")
                              }
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Login Page
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {/* <div style={{ display: "flex", marginBottom: "10px" }}> */}
                          {/* <button
                          style={{
                            backgroundColor:
                              activeTab === "mobile" ? "#d8ecff" : "white",
                            border: "1px solid #ccc",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={() => handleTabChange("mobile")}
                        >
                          Login with User ID
                        </button> */}

                          {/* </div> */}

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <input
                              type="text"
                              placeholder={
                                activeTab === "mobile"
                                  ? "Trading User ID"
                                  : activeTab === "pan"
                                    ? "PAN number"
                                    : "Enter QR code"
                              }
                              value={username}
                              onChange={handleUsernameChange}
                              style={{
                                width: "100%",
                                padding: "15px",
                                marginBottom: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                fontSize: "1rem",
                              }}
                            />
                            {errors.username && (
                              <p style={{ color: "red", fontSize: "0.9rem" }}>
                                {errors.username}
                              </p>
                            )}

                            <input
                              type="password"
                              placeholder="Demat Password"
                              value={password}
                              onChange={handlePasswordChange}
                              style={{
                                width: "100%",
                                padding: "15px",
                                marginBottom: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                fontSize: "1rem",
                              }}
                            />
                            {errors.password && (
                              <p style={{ color: "red", fontSize: "0.9rem" }}>
                                {errors.password}
                              </p>
                            )}

                            <button
                              onClick={handleNextClick}
                              style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                padding: "15px",
                                border: "none",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                cursor: "pointer",
                                marginBottom: "10px",
                              }}
                            >
                              Next
                            </button>
                            <button
                              style={{
                                backgroundColor: "#d8ecff",
                                color: "#1b3e81",
                                padding: "10px",
                                border: "1px solid #1b3e81",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                cursor: "pointer",
                              }}
                              onClick={handleBackClick}
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      )}{" "}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
      <ToastButton />
    </div>
  );
};

export default Header;
