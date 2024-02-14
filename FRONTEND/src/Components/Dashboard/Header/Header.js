/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import DropDown from "./DropDown";
import Notification from "../../ExtraComponents/Notification";
import { useDispatch, useSelector } from "react-redux";
import Holidays from "date-holidays"
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import Modal from "../../../Components/ExtraComponents/Modal";
import UpdateBrokerKey from "./Update_Broker_Key";
import { loginWithApi } from "./log_with_api";
import { User_Profile, GET_MESSAGE_BRODS } from "../../../ReduxStore/Slice/Common/commoSlice.js";
import { check_Device } from "../../../Utils/find_device";
import { GET_HELPS } from "../../../ReduxStore/Slice/Admin/AdminHelpSlice";
import { Log_Out_User } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import { TRADING_OFF_USER } from "../../../ReduxStore/Slice/Users/DashboardSlice";
import { Get_Company_Logo } from '../../../ReduxStore/Slice/Admin/AdminSlice'
import { isForeignUserAllowedToLogin } from "../../../Utils/Date_formet";

import jwt_decode from "jwt-decode";

const Header = ({ ChatBox }) => {
  // HOOKS
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setshowModal] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const [UserDetails, setUserDetails] = useState([]);

  const [CheckUser, setCheckUser] = useState(check_Device());

  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });




  //  lOCAL STORAGE VALUE
  let theme_id = localStorage.getItem("theme");
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));
  const user_role = JSON.parse(localStorage.getItem("user_role"));
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const page = localStorage.getItem("page")
  const Role = JSON.parse(localStorage.getItem("user_details")).Role
  const routePath = localStorage.getItem("route");

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const UserName_localstg = JSON.parse(localStorage.getItem("user_details"))

  const UserNamego_localstg = JSON.parse(localStorage.getItem("user_details_goTo"))


  // console.log("UserName_localstg", UserName_localstg);
  // console.log("UserNamego_localstg", UserNamego_localstg);


  // console.log("gotodashboard-", user_role);

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

  const redirectToAdmin = () => {
    // console.log("page", page);
    // console.log("user_role_goTo", user_role_goTo);
    // console.log("routePath", routePath);



    if (page != null) {
      navigate("/admin/groupservices")
      localStorage.removeItem("page")
    } else {

      navigate(routePath)

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
    const currentDate = new Date();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[currentDate.getDay()];
    const holidays = new Holidays();

    const userCountry = 'US' || "UK" || "SA";
    const userLocalTime = currentDate

    let isAllowed = isForeignUserAllowedToLogin(userCountry, userLocalTime)

    if (!holidays.isHoliday(currentDate) && weekday !== 'Sunday' && weekday !== 'Saturday') {
      if (check) {
        if (isAllowed) {
          loginWithApi(brokerid, UserDetails);
        } else {
          alert('Market Time Is Close');
        }
      } else {
        dispatch(TRADING_OFF_USER({ user_id: user_id, device: CheckUser, token: token }))
          .unwrap()
          .then((response) => {
            if (response.status) {
              // setUserDetails(response.data);
              setrefresh(!refresh)
            }
          });

      }
    }
    else {
      alert('Market Is Closed Today');
    }



    return
    if (check) {
      loginWithApi(brokerid, UserDetails);
    } else {
      dispatch(TRADING_OFF_USER({ user_id: user_id, device: CheckUser, token: token }))
        .unwrap()
        .then((response) => {
          if (response.status) {
            // setUserDetails(response.data);
            setrefresh(!refresh)
          }
        });

    }

  };

  //  GET_USER_DETAILS
  const data = async () => {
    await dispatch(User_Profile({ id: user_id }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setUserDetails(response.data);
        }
      });
  };


  //  GET_USER_DETAILS
  const message_brod = async () => {
    if (Role == "USER") {
      await dispatch(GET_MESSAGE_BRODS({ id: user_id }))
        .unwrap()
        .then((response) => {
          if (response.status) {
            // setUserDetails(response.data);
          }
        });
    }

  };

  useEffect(() => {
    data();
    message_brod()
  }, [refresh]);

  //  For Show Notfication
  const Notfication = async () => {
    if (user_role == "ADMIN") {
      await dispatch(GET_HELPS({ user_id: user_id, token: token }))
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

  useEffect(() => {
    if (user_role == "ADMIN") {
      Notfication();
    }
  }, []);

  //  Clear Session  After 24 Hours

  const ClearSession = async () => {
    var decoded = jwt_decode(token);


    if (decoded.exp * 1000 < new Date().getTime()) {
      const request = {
        userId: user_id,
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
          }
        })
        .catch((error) => {
          console.log("Error logout error", error);
        });
    }
  };

  useEffect(() => {
    ClearSession();
  }, []);






  const CompanyName = async () => {
    await dispatch(Get_Company_Logo()).unwrap()
      .then((response) => {
        if (response.status) {
          $(".Company_logo").html(response.data && response.data[0].panel_name);

          $(".set_Favicon")
        }
      })
  }









  const test = async () => {
    // const socket = socketIOClient(`${Config.base_url}`);

    // socket.on("logout_user_from_other_device_res", async (data) => {
    //   console.log("logout_user_from_other_device_res", data);
    // });






    // if (user_role === "USER") {
    //   const socket = socketIOClient(`${Config.base_url}`);

    //   // console.log("Config.base_url", Config.base_url)
    //   socket.on("logout_user_from_other_device_res", async (data) => {
    //     console.log("logout_user_from_other_device_res", data);

    //     await dispatch(
    //       Log_Out_User({
    //         userId: data.usedata.user_id,
    //         Device: data.CheckUser,
    //       })
    //     )
    //       .then((res) => {
    //         if (res.payload.status) {
    //           // toast.success(res.payload.msg)
    //           localStorage.removeItem("user_role");
    //           localStorage.removeItem("user_details");
    //           setTimeout(() => {
    //             navigate("/");
    //           }, 1500);
    //         }
    //       })
    //       .catch((error) => {
    //         console.log("logout error", error);
    //       });
    //   });

    //   return () => {
    //     socket.disconnect();
    //   };

    // }

  }



  useEffect(() => {
    test()
    CompanyName()
  }, []);

  return (
    <div className="header-container">
    <Logo />
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item dropdown header-profile ms-2 ">
              {user_role === "USER" && UserDetails.license_type != 1 ? (
                <>
                  <div className="headaer-title">
                    <h3 className="font-w400 mb-0 pe-1">Api Login </h3>
                  </div>

                  <div className="Api Login">
                    <label class="switch mb-0">
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
                      <span class="slider round"></span>
                    </label>
                  </div>
                </>
              ) : (
                ""
              )}
              {gotodashboard != null ? (
                <>
                  <li className="nav-item dropdown gotodashboard">
                    <button
                      onClick={redirectToAdmin}
                      type="button"
                      className="btn btn-primary text-white"
                    >
                      Go to Admin
                    </button>
                  </li>
                </>
              ) : ("")}
              </li>
              {/* GO TO DASHBOARD */}

              <>
                {user_role === "SUPERADMIN" || gotodashboard != null ? "" :

                  <li className="nav-item dropdown header-profile me-2">
                    <button
                      className=" btn btn-primary px-2"
                      onClick={() => setshowModal(true)}
                    >
                      Set API Key
                    </button>
                  </li>
                }



                <li className="nav-item dropdown header-profile user-name me-2">
                  {UserNamego_localstg != null ?
                    <h4 className="text-white border-1 mb-0">{UserNamego_localstg.UserName}</h4>
                    :
                    <h4 className="text-white border-1 mb-0">{UserName_localstg.UserName}</h4>
                  }
                </li>


              </>

              {/*  For Show Notification Box */}
              {user_role === "ADMIN" ? (
                <>
                  <Notification data={getAllClients} />
                </>
              ) : (
                user_role === "USER" ? (
                  <>
                    <Notification data={[]} />

                  </>
                ) : (
                  ""
                )
              )}

              <li className="nav-item dropdown header-profile ">
                <DropDown />
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <Modal
        isOpen={showModal}
        backdrop="static"
        size="ms-5"
        title="Update Broker Key"
        hideBtn={true}
        handleClose={() => setshowModal(false)}
      >
        <UpdateBrokerKey closeModal={() => setshowModal(false)} />
      </Modal>
    </div>
  </div>
  );
};

export default Header;
