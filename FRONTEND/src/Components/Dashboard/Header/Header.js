/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import Logo from "./Logo"
import DropDown from "./DropDown"
import Notification from '../../ExtraComponents/Notification'
import { useDispatch, useSelector } from "react-redux";

import $ from "jquery";
import { useNavigate } from "react-router-dom";
import Modal from '../../../Components/ExtraComponents/Modal';
import UpdateBrokerKey from './Update_Broker_Key';
import { loginWithApi } from './log_with_api';
import { User_Profile } from "../../../ReduxStore/Slice/Common/commoSlice.js";




const Header = ({ ChatBox }) => {

  // HOOKS
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [showModal, setshowModal] = useState(false)
  const [UserDetails, setUserDetails] = useState([]);

  //  lOCAL STORAGE VALUE
  let theme_id = localStorage.getItem("theme")
  const gotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))
  const user_role = JSON.parse(localStorage.getItem('user_role'))
  const user_role_goTo = JSON.parse(localStorage.getItem('user_role_goTo'))
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;






  if (theme_id != null) {
    let themedata = JSON.parse(theme_id)
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
    user_role_goTo === "USER" ?
      navigate("/admin/allclients")
      :
      navigate("/admin/allsubadmins")

    localStorage.removeItem("gotodashboard");

    setTimeout(() => {

      localStorage.removeItem("user_details_goTo");
      localStorage.removeItem("user_role_goTo");
    }, 1000);


  };


  //  BROKER LOGIN
  const LogIn_WIth_Api = (check, brokerid, tradingstatus, app_id) => {
    if (check) {
      loginWithApi(brokerid, app_id)
    } else {
      alert("trading is off")
    }
  }


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
  useEffect(() => {
    data();
  }, []);





  return (
    <div>
      <Logo />
      <div className="header">
        <div className="header-content">
          <nav className="navbar navbar-expand">
            <div className="collapse navbar-collapse justify-content-between">
              <div className="header-left">
                {user_role === "USER" ?
                  <>
                    <div className="headaer-title">
                      <h3 className="font-w400 mb-0">Api Login </h3>
                    </div>

                    <div className="Api Login m-2"><label class="switch" >
                      <input type="checkbox" className="bg-primary"
                        checked={UserDetails.TradingStatus === "on" ? true : false}
                        onClick={(e) => LogIn_WIth_Api(e.target.checked, UserDetails.broker, UserDetails.TradingStatus)}
                      />
                      <span class="slider round"></span>
                    </label>
                    </div>
                  </>
                  : ""}
              </div>
              <ul className="navbar-nav header-right">

                {/* GO TO DASHBOARD */}
                {gotodashboard != null ?
                  <>
                    <li className="nav-item dropdown gotodashboard" >
                      <button
                        onClick={redirectToAdmin}
                        type="button"
                        className="btn btn-color"
                      >
                        Go to Admin
                      </button>
                    </li>
                  </>
                  : ""
                }

                {user_role === "USER" ? <>
                  <li className="nav-item dropdown header-profile">
                    <button
                      className=" btn btn-secondary"
                      onClick={() => setshowModal(true)}
                    >
                      Set ApiKey
                    </button>
                  </li>
                </> : ""}





                {/*  For Show Notification Box */}
                {/* <Notification /> */}
                {/*  For Show Chat Box */}
                {/* <li className="nav-item dropdown notification_dropdown" onClick={() => ChatBox()}>
                  <a className="nav-link bell-link nav-action" >
                    <svg
                      width={28}
                      height={28}
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.8257 17.5282C14.563 17.6783 14.2627 17.7534 14 17.7534C13.7373 17.7534 13.437 17.6783 13.1743 17.5282L0 9.49598V20.193C0 22.4826 1.83914 24.3217 4.12869 24.3217H23.8713C26.1609 24.3217 28 22.4826 28 20.193V9.49598L14.8257 17.5282Z"
                        fill="#737B8B"
                      />
                      <path
                        d="M23.8713 3.67829H4.12863C2.17689 3.67829 0.525417 5.06703 0.112549 6.90617L13.9999 15.3887L27.8873 6.90617C27.4745 5.06703 25.823 3.67829 23.8713 3.67829Z"
                        fill="#737B8B"
                      />
                    </svg>
                    <span className="badge light text-white bg-primary rounded-circle" />
                  </a>
                </li> */}
                <li className="nav-item dropdown header-profile">
                  <DropDown />
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <Modal isOpen={showModal} backdrop="static" size="ms-5" title="Update Broker Key" hideBtn={true}
          handleClose={() => setshowModal(false)}
        >
          <UpdateBrokerKey />
        </Modal >
      </div>
    </div>
  )
}

export default Header