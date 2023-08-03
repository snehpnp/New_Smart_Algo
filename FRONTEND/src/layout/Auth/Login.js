import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SignIn, Verify_User_Device, device_user } from "../../ReduxStore/Slice/Auth/AuthSlice";
import Modal from "../../Components/ExtraComponents/Modal"
import OtpInput from 'react-otp-input';
import { check_Device } from "../../Utils/find_device";
import { getLastFourDigits } from "../../Utils/common_Functions"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
import $ from "jquery";
import ToastButton from "../../Components/ExtraComponents/Alert_Toast";






const Login = () => {
  const navigate = useNavigate();
  const data = useRef()
  const dispatch = useDispatch();
  const selector = useSelector((state) => state)

  console.log("selector", selector);


  const [showModal, setshowModal] = useState(false)
  const [typeOtp, setTypeOtp] = useState('');
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [UserData, setUserData] = useState('');
  const [CheckUser, setCheckUser] = useState(check_Device());



  // useEffect(() => {
  // let abc =   check_Device()
  // }, [])



  const loginUser = async (e) => {
    e.preventDefault();

    let req = {
      // Email: "superadmin@gmail.com",
      // Password: "123456",
      // Email: "admin@gmail.com",
      // Password: "123456",
      // Email: "user@gmail.com",
      // Password: "123456",

      Email: Email,
      Password: password,
      device: CheckUser,
    };

    await dispatch(SignIn(req))
      .then((res) => {
        console.log("signin", res.payload.data.Role);

        if (res.payload.status) {
          if (res.payload.data.Role !== "SUPERADMIN") {
            setshowModal(true)
            setUserData(res.payload.data)
          } else if (res.payload.data.Role === "SUPERADMIN") {
            toast.success(res.payload.msg)
            // setTimeout(() => {
            //   // navigate("/super/dashboard");
            // }, 2000);
            localStorage.setItem("user_details", JSON.stringify(res.payload.data));
            localStorage.setItem("user_role", JSON.stringify(res.payload.data.Role));

          }
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };



  const verifyOTP = async () => {

    if (typeOtp === "") {
      alert("enter otp")
      return
    }
    if (typeOtp.length < 4) {
      alert("please enter valid otp")
      return
    }



    let req = {
      Email: "user@gmail.com",
      Device: CheckUser,
      Otp: typeOtp
    };


    await dispatch(Verify_User_Device(req))
      .then((res) => {
        console.log(" Otp Verify", res.payload)

        if (res.payload.status) {
          if (UserData && UserData.Role === "ADMIN") {
            let mobile_No = getLastFourDigits(UserData && UserData.mobile, typeOtp)
            if (mobile_No === true) {
              localStorage.setItem("user_details", JSON.stringify(UserData));
              localStorage.setItem("user_role", JSON.stringify(UserData.Role));
              toast.success(res.payload.msg)
              setshowModal(false)

              setTimeout(() => {
                navigate("/admin/dashboard");
              }, 1000);
            } else {
              toast.error(mobile_No)
              // alert(mobile_No)
            }
          }
          else if (UserData && UserData.Role === "USER") {
            let mobile_No = getLastFourDigits(UserData && UserData.mobile, typeOtp)
            if (mobile_No === true) {
              localStorage.setItem("user_details", JSON.stringify(UserData));
              localStorage.setItem("user_role", JSON.stringify(UserData.Role));
              setshowModal(false)
              toast.success(res.payload.msg)

              setTimeout(() => {
                navigate("/client/dashboard");
              }, 1000);
            } else {
              toast.error(mobile_No)
              // alert(mobile_No)
            }

          }
          else if (UserData && UserData.Role === "SUBADMIN") {
            let mobile_No = getLastFourDigits(UserData && UserData.mobile, typeOtp)
            if (mobile_No === true) {
              localStorage.setItem("user_details", JSON.stringify(UserData));
              localStorage.setItem("user_role", JSON.stringify(UserData.Role));
              toast.success(res.payload.msg)
              setshowModal(false)

              setTimeout(() => {
                navigate("/subadmin/dashboard");
              }, 1000);
            } else {
              toast.error(mobile_No)
              // alert(mobile_No)
            }
          }
        }
        else {
          toast.error(res.payload.msg)
        }

      }).catch((error) =>
        console.log("error on Otp Verify", error))
  }



  const GetAllThemes = () => {
    axios.get("https://api.smartalgo.in:3001/smartalgo/get/theme").then((res) => {
      // console.log("accept res`122`12`", res.data.data);

      // $('body').attr('data-theme-version', themedata.theme_version);

      // setThemeData(res.data.data)
    }).catch((err) => {
      console.log("error", err);
    })
  }


  useEffect(() => {
    GetAllThemes()
  }, [])

  // let theme_id = localStorage.getItem("theme_id")
  let theme_id = 62


  console.log("theme_id", theme_id);

  if (theme_id != null) {
    axios.post("https://api.smartalgo.in:3001/smartalgo/getthemeById", { id: parseInt(62) }).then((res) => {
      let themedata = res.data.data[0]

      $('body').removeClass('theme-1 theme-2 theme-3 theme-4 theme-5 theme-6 theme-7 theme-8 theme-9  theme-10');
      $('body').addClass(themedata.dashboard)

      $('body').attr('data-dashboard', `${themedata.dashboard}-dashboard`);


      $('body').attr('data-theme-version', themedata.theme_version);

      $('body').attr('data-primary', themedata.primary_col);
      $('body').attr('data-nav-headerbg', themedata.nav_head_col);
      $('body').attr('data-headerbg', themedata.header_col);
      $('body').attr('data-sibebarbg', themedata.sidebar_col);

      if ($('body').attr('data-sidebar-style') === 'overlay') {
        $('body').attr('data-sidebar-style', 'full');
        $('body').attr('data-layout', themedata.layout);
        return;
      }
      $('body').attr('data-layout', themedata.layout);
      if ($('body').attr('data-layout') === "horizontal") {
        if (themedata.sidebar === "overlay") {
          alert("Sorry! Overlay is not possible in Horizontal layout.");
          return;
        }
      }
      if ($('body').attr('data-layout') === "vertical") {
        if ($('body').attr('data-container') === "boxed" && themedata.sidebar === "full") {
          alert("Sorry! Full menu is not available in Vertical Boxed layout.");
          return;
        }
        if (themedata.sidebar === "modern" && $('body').attr('data-sidebar-position') === "fixed") {
          alert("Sorry! Modern sidebar layout is not available in the fixed position. Please change the sidebar position into Static.");
          return;
        }
      }
      $('body').attr('data-sidebar-style', themedata.sidebar);
      if ($('body').attr('data-sidebar-style') === 'icon-hover') {
        $('.deznav').on('hover', function () {
          $('#main-wrapper').addClass('iconhover-toggle');
        }, function () {
          $('#main-wrapper').removeClass('iconhover-toggle');
        });
      }

      $('body').attr('data-header-position', themedata.header_position);
      $('body').attr('data-sidebar-position', themedata.sidebar_position);
      $('body').attr('data-typography', themedata.body_font);
      if (themedata.container === "boxed") {
        if ($('body').attr('data-layout') === "vertical" && $('body').attr('data-sidebar-style') === "full") {
          $('body').attr('data-sidebar-style', 'overlay');
          $('body').attr('data-container', themedata.container);
          setTimeout(function () {
            $(window).trigger('resize');
          }, 200);
          return;
        }
      }
      $('body').attr('data-container', themedata.container);

    }).catch((err) => {
      console.log("error", err);
    })

  }

  return (
    <div class="vh-100">
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <div className="text-center mb-3">
                        <a href="#a"> logo </a>
                      </div>
                      <h4 className="text-center mb-4">
                        Sign in your account
                      </h4>

                      <form >
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong> Email </strong>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Example@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong> Password </strong>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}

                          />
                        </div>

                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            onClick={(e) => {
                              loginUser(e);
                            }}
                          >
                            Sign Me In
                          </button>
                        </div>
                        <ToastButton />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* For Varify OTP Modal */}
      {showModal ?
        <>
          <Modal isOpen={showModal} handleClose={!showModal} backdrop="static" size="sm" title="Verify OTP" btn_name="Verify" Submit_Function={verifyOTP}>
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
          </Modal >
        </>
        : ""
      }
    </div>
  );
};

export default Login;
