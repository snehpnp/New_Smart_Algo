/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  SignIn,
  Verify_User_Device,
  Get_Panel_Informtion,
  OTP_SEND_USEHERES,
  Logout_From_Other_Device,
} from "../../ReduxStore/Slice/Auth/AuthSlice";
import Modal from "../../Components/ExtraComponents/Modal";
import OtpInput from "react-otp-input";
import { check_Device } from "../../Utils/find_device";
import { getLastFourDigits } from "../../Utils/common_Functions";
import toast, { Toaster } from "react-hot-toast";
import $ from "jquery";
import ToastButton from "../../Components/ExtraComponents/Alert_Toast";
import * as Config from "../../Utils/Config";
import Formikform from "../../Components/ExtraComponents/Form/Formik_form";
import { useFormik } from "formik";
import * as valid_err from "../../Utils/Common_Messages";
import { Email_regex, Mobile_regex } from "../../Utils/Common_regex";
import { Get_Company_Logo } from '../../ReduxStore/Slice/Admin/AdminSlice'


const Login = () => {
  const navigate = useNavigate();
  const data = useRef();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);

  const [CheckUser, setCheckUser] = useState(check_Device());

  const [showModal, setshowModal] = useState(false);
  const [showModal1, setshowModal1] = useState(false);
  const [showModal2, setshowModal2] = useState(false);

  const [CheckDesclaimer, setCheckDesclaimer] = useState(false);
  const [desclaimerModal, setDesclaimerModal] = useState(false);
  const [getCompanyName, setGetCompanyName] = useState("");


  const [getOtpStatus, setgetOtpStatus] = useState(false);

  const [getOtp, setgetOtp] = useState("");

  const [typeOtp, setTypeOtp] = useState("");

  const [typeOtp1, setTypeOtp1] = useState("");

  const [UserData, setUserData] = useState("");

  

  const isValidEmail = (email) => {
    return Email_regex(email);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validate: (values) => {
      const errors = {};
     
      if (!values.password) {
        errors.password = valid_err.PASSWORD_ERROR;
      }

      if (!values.email) {
        errors.email = valid_err.EMPTY_EMAIL_ERROR;
      } else if (!isValidEmail(values.email)) {
        errors.email = valid_err.INVALID_EMAIL_ERROR;
      }

      return errors;
    },
    onSubmit: async (values) => {
      let req = {
        Email: values.email,
        Password: values.password,
        device: CheckUser,
      };

      await dispatch(SignIn(req))
        .unwrap()
        .then((response) => {
          

          if (response.status) {
            if (response.data.Role !== "SUPERADMIN") {
              setshowModal(true);
              setUserData(response.data);
            } else if (response.data.Role === "SUPERADMIN") {
              toast.success(response.msg);
              localStorage.setItem(
                "user_details",
                JSON.stringify(response.data)
              );
              localStorage.setItem(
                "user_role",
                JSON.stringify(response.data.Role)
              );
              setTimeout(() => {
                navigate("/super/dashboard");
              }, 1000);
            }
          } else {
            
            toast.error(response.msg);
          }
        })
        .catch((error) => {
          console.log("Error", error);
        });
    },
  });

  const fields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },

  ];

  // ------------------ For Otp Varify --------------------------

  const [test, settest] = useState([]);

  const verifyOTP = async () => {
    if (typeOtp === "") {
      alert("enter otp");
      return;
    }
    if (typeOtp.length < 4) {
      alert("please enter valid otp");
      return;
    }

    let req = {
      Email: UserData.Email,
      Device: CheckUser,
      Otp: typeOtp,
    };

    await dispatch(Verify_User_Device(req))
      .then((res) => {
  
        if (res.payload.firstlogin === "0") {
          setDesclaimerModal(true)
        } else {
          if (res.payload.status) {
            const roles = ["ADMIN", "USER", "SUBADMIN", "SUPERADMIN"];
            const userData = UserData;

            const role = userData && userData.Role;
            const mobileNo = getLastFourDigits(
              userData && userData.mobile,
              typeOtp
            );

            if (roles.includes(role) && mobileNo === true) {
              settest(userData);
              localStorage.setItem("user_details", JSON.stringify(userData));
              localStorage.setItem("user_role", JSON.stringify(role));
              toast.success(res.payload.msg);
              let redirectPath = `/${role === "USER"
                ? "client/dashboard"
                : role === "SUBADMIN"
                  ? "subadmin/signals"
                  : role === "ADMIN"
                    ? "admin/dashboard"
                    : role === "SUPERADMIN"
                      ? "/super/dashboard"
                      : ""
                }
           `;

              setTimeout(() => {
                setshowModal(false);
                navigate(redirectPath);
                window.location.reload();
              }, 1000);
            } else {
              toast.error(mobileNo);
            }
          } else {
            if (res.payload.msg === "You are already logged in on the Web.") {
              toast.error(res.payload.msg);
              setshowModal(false);
              setshowModal1(true);
            } else {
              toast.error(res.payload.msg);
              setTimeout(() => {
                // setshowModal(false);
              }, 1000);
            }
          }
        }

      })
      .catch((error) => console.log("error on Otp Verify", error));
  };

  // CLOSE THE MODAL
  const verifyOTP_2 = async () => {
    setshowModal1(false);
    setgetOtpStatus(false);
  };

  // CLOSE THE MODAL
  const verifyOTP_3 = () => {
    setshowModal1(false);
    setshowModal2(false);
    setshowModal(false);

    setgetOtpStatus(false);
  };
  // CLOSE THE MODAL
  const verifyOTP_login = async () => {
     
    if (getOtp && getOtp == typeOtp1) {
      // const socket = socketIOClient(`${Config.base_url}`);
      // socket.emit("logout_user_from_other_device_req", {
      //   CheckUser: CheckUser,
      //   usedata: UserData,
      // });
    }

    setTimeout(async () => {
      let req = {
        Email: UserData.Email,
        device: CheckUser,
        otp: typeOtp1,
      };

      await dispatch(Logout_From_Other_Device(req))
        .unwrap()
        .then((res) => {
          if (res.status) {
            const roles = ["ADMIN", "USER", "SUBADMIN"];

            const userData = UserData;

            const role = userData && userData.Role;

            if (roles.includes(role)) {
              localStorage.setItem("user_details", JSON.stringify(userData));
              localStorage.setItem("user_role", JSON.stringify(role));
              toast.success(res.msg);
              // let redirectPath = `/${
              //   role === "USER" ? "client" : role.toLowerCase()
              // }/dashboard`;

              let redirectPath = `/${role === "USER"
                ? "client/dashboard"
                : role === "SUBADMIN"
                  ? "subadmin/signals"
                  : role === "ADMIN"
                    ? "admin/dashboard"
                    : role === "SUPERADMIN"
                      ? "/super/dashboard"
                      : ""
                }`

              setTimeout(() => {
                // setshowModal(false);
                navigate(redirectPath);
                window.location.reload();
              }, 1000);
            }
          } else {
            toast.error(res.msg);
          }
        })
        .catch((error) => {
          console.log("Error", error);
        });
    }, 1000);
  };

  // USE HERE THE TH OTP GET
  const USEHERE = async () => {
    let req = {
      Email: UserData.Email,
      device: CheckUser,
    };

    await dispatch(OTP_SEND_USEHERES(req))
      .unwrap()
      .then((response) => {
         
        setgetOtp(response.data);
        if (response.status) {
          setshowModal1(false);
          setshowModal2(true);
          setgetOtpStatus(true);
        } else {
          toast.error(response.response.data.msg);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  //  for set theme

  const getPanelDetails = async () => {
    let domain = window.location.host
    const req = {
      domain: Config.react_domain
      // domain: "sneh.com",
    };

    await dispatch(Get_Panel_Informtion(req))
      .unwrap()
      .then((response) => {
        let res = response.data[0].theme_data[0];
        localStorage.setItem("theme", JSON.stringify(res));
      });
  };


  useEffect(() => {
    getPanelDetails();
    CompanyName()
  }, []);

  let theme_id = localStorage.getItem("theme");

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



  //  FOR SET COMPANY LOGO
  const CompanyName = async () => {
    await dispatch(Get_Company_Logo()).unwrap()
      .then((response) => {
        if (response.status) {
          setGetCompanyName(response.data && response.data[0].panel_name)

          $(".logo-abbr").attr('src', response.data && response.data[0].logo);
          
          $(".Company_logo").html(response.data && response.data[0].panel_name);


          $(".set_Favicon")

          let favicon = $("link[rel='icon']").length
            ? $("link[rel='icon']")
            : $("<link rel='icon' type='image/x-icon' />");
          favicon.attr('href', response.data && response.data[0].favicon);
          $('head').append(favicon);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  // FOR DESCILMER

  const SubmitDesclimer = () => {
   
    if (!CheckDesclaimer) {
      alert("Agree & I accept Term And Condition")
    } else {
      setshowModal(false);

      const roles = ["ADMIN", "USER", "SUBADMIN", "SUPERADMIN"];
      const userData = UserData;

      const role = userData && userData.Role;
      const mobileNo = getLastFourDigits(
        userData && userData.mobile,
        typeOtp
      );

      if (roles.includes(role) && mobileNo === true) {

        localStorage.setItem("user_details", JSON.stringify(userData));
        localStorage.setItem("user_role", JSON.stringify(role));
        let redirectPath = `/${role === "USER"
          ? "client/dashboard"
          : role === "SUBADMIN"
            ? "subadmin/signals"
            : role === "ADMIN"
              ? "admin/dashboard"
              : role === "SUPERADMIN"
                ? "/super/dashboard"
                : ""
          }
     `;

        setTimeout(() => {
          navigate(redirectPath);
          // window.location.reload();
        }, 1000);
      }
    }
  }


  return (
    <div class="vh-100">

      {1 == 0 ?
        <div className="authincation h-100">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-md-6">
                <div className="authincation-content">
                  <div className="row no-gutters">
                    <div className="col-xl-12">
                      <div className="auth-form">
                        <div className="text-center mb-3">
                          {/* <a href="#a"> logo </a> */}
                          <span className="brand-logo">
                            <img className="logo-abbr w-50" src="assets/icons/logo.png" alt="logo" />
                          </span>
                        </div>
                        <h4 className="text-center mb-4">Sign in your account</h4>
                        <Formikform
                          fieldtype={fields.filter(
                            (field) =>
                              !field.showWhen || field.showWhen(formik.values)
                          )}
                          formik={formik}
                          btn_name="Sign In"
                          btn_name_signUp="Sign Up"
                          title="forlogin"
                        />
                        <div class="form-row d-flex justify-content-end mt-4 mb-2">
                          <div class="mb-3 mt-1">
                            <Link to="/forget">Forgot Password?</Link>
                          </div>
                        </div>
                      </div>
                      <ToastButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="authincation h-100">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-md-6">
                <div className="authincation-content">
                  <div className="row no-gutters">
                    <div className="col-xl-12">
                      <div className="auth-form">
                        <div className="text-center mb-3">
                          {/* <a href="#a"> logo </a> */}
                          <span className="brand-logo">
                            <img className="logo-abbr w-50" src="assets/icons/logo.png" alt="logo" />
                          </span>
                        </div>
                        <h4 className="text-center mb-4">Sign in your account</h4>
                        <Formikform
                          fieldtype={fields.filter(
                            (field) =>
                              !field.showWhen || field.showWhen(formik.values)
                          )}
                          formik={formik}
                          btn_name="Sign In"
                          //  btn_name_signUp="Sign Up"
                          title="forlogin1"
                        />
                        <div class="form-row mt-4 mb-2">
                          <div class="mb-3 mt-1  d-flex justify-content-between ">
                            <div><Link to="/forget">Forgot Password?</Link></div>
                            <div><Link to="/newsignup">Sign Up</Link></div>
                          </div>
                        </div>
                      </div>
                      <ToastButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }


      {/* For Varify OTP Modal */}
      {showModal ? (
        <>
          <Modal
            isOpen={showModal}
            handleClose={() => setshowModal(false)}
            backdrop="static"
            size="sm"
            title="Verify OTP"
            btn_name="Verify"
            btn_name1="Verify1"
            Submit_Function={verifyOTP}
          >
            <form onSubmit={verifyOTP}>
              <OtpInput
                containerStyle="otp-div"
                value={typeOtp}
                onChange={setTypeOtp}
                numInputs={4}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
              />
            </form>
          </Modal>
        </>
      ) : (
        ""
      )}

      {/*  For Set Allredy Login */}
      {showModal1 ? (
        <>
          <Modal
            isOpen={showModal1}
            handleClose={() => setshowModal1(false)}
            backdrop="static"
            size="sm"
            title="Login or Close the Page"
            btn_2={true}
            btn_name="CLOSE"
            btn_name_2="USE HERE"
            Submit_Function={verifyOTP_2}
            Submit_Function_2={USEHERE}
          >
            {!getOtpStatus ? (
              <p>
                <b>If you want to login only then do so, otherwise close it.</b>
              </p>
            ) : (
              ""
            )}
          </Modal>
        </>
      ) : (
        ""
      )}

      {/*  For Multi Login */}
      {showModal2 ? (
        <>
          <Modal
            isOpen={showModal2}
            // handleClose={!showModal2}
            handleClose={() => setshowModal2(false)}
            backdrop="static"
            size="sm"
            title="Login or Close the Page"
            btn_2={true}
            btn_name="CLOSE"
            btn_name_2="Verify Otp"
            Submit_Function={verifyOTP_3}
            Submit_Function_2={verifyOTP_login}
          >
            {getOtpStatus ? (
              <form onSubmit={verifyOTP}>
                <h4>
                  <b>Please Enter a otp to send you regersterd Email </b>
                </h4>
                <h6>
                  <b>Email :-</b> {UserData.Email}
                </h6>

                <OtpInput
                  containerStyle="otp-div"
                  value={typeOtp1}
                  onChange={setTypeOtp1}
                  numInputs={4}
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input {...props} />}
                />
              </form>
            ) : (
              ""
            )}
          </Modal>
        </>
      ) : (
        ""
      )}



      {/*  for Desclaimer    */}
      {desclaimerModal ? (
        <>
          <Modal
            isOpen={desclaimerModal}
            // handleClose={!showModal2}
            handleClose={() => setDesclaimerModal(false)}
            backdrop="static"
            size="lg"
            title="Login or Close the Page"
            btn_name="Submit"
            Submit_Function={SubmitDesclimer}

          >

            <h6>
              All subscription fees paid to {getCompanyName && getCompanyName} is Non refundable. We
              do not provide trading tips nor we are investment adviser. Our
              service is solely restricted to automated trading application
              development, deployment and maintenance. All algorithms are
              based on backtested data but we do not provide any guarantee for
              their performance in future. The algorithm running in an
              automated system is agreed with the user prior deployment and we
              do not take any liability for any loss generated by the same.
              Past performance of advise/strategy/model does not indicate the
              future performance of any current or future strategy/model or
              advise by {getCompanyName && getCompanyName} Trades and actual returns may differ
              significantly from that depicted herein due to various factors
              including but not limited to impact costs, expense charged,
              timing of entry/exit, timing of additional flows/redemptions,
              individual client mandates, specific portfolio construction
              characteristics etc. There is no assurance or guarantee that the
              objectives of any strategy/model or advice provided by {getCompanyName && getCompanyName} Trades will be achieved. {getCompanyName && getCompanyName}  Trades or any of its
              partner/s or principal officer/employees do not assure/give
              guarantee for any return on the investment in
              strategies/models/advice given to the Investor. The value of
              investment can go up/down depending on factors & forces
              affecting securities markets. {getCompanyName && getCompanyName} Trades or its
              associates are not liable or responsible for any loss or
              shortfall arising from operations and affected by the market
              condition.
              <br />

            </h6>
            <div className="d-flex">

              <input
                type="checkbox"
                // checked={termCheck}
                id="term_check"
                className="mx-2"
                onChange={(e) => {
                  setCheckDesclaimer(e.target.checked);
                }}
              />
              <label for="term_check" className="mt-2 h6 text-info">
                Agree & I accept Term And Condition
              </label>
            </div>

            <br />

          </Modal>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Login;
