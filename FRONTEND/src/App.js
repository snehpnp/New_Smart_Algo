import Main_Router from './Routes/Route'
import NotFound from './layout/Auth/Deactivate_Company'

import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';
import { Get_Pmermission } from "./ReduxStore/Slice/Users/DashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Config from "./Utils/Config";
import axios from "axios";
import {
  Get_Panel_Informtion,
} from "../src/ReduxStore/Slice/Auth/AuthSlice";
import $ from "jquery";

const App = () => {
  const pageRef = useRef(null);
  const dispatch = useDispatch()

  const [admin_permission, setAdmin_permission] = useState("");


  
  const data2 = async () => {


    try {

      const data = {
        "domain": Config.react_domain,
        // token: token,
      }

      const res = await axios.post(`${Config.smartAlogUrl}get/panel/permission`, data, {
        data: { data },
      })
      // console.log("res", res)

      if (res.data.status) {
        setAdmin_permission(
          res.data.data[0],
        );
      } else {
        setAdmin_permission(
          res.data,
        );
      }
    }
    catch (err) {
      return await err
    }


    // await dispatch(
    //   Get_Pmermission({
    //     "domain": Config.react_domain,
    //     // token: token,
    //   })
    // )
    //   .unwrap()
    //   .then((response) => {
    //     if (response.status) {
    //       setAdmin_permission(
    //         response.data[0],
    //       );
    //     } else {
    //       setAdmin_permission(
    //         response.data,
    //       );
    //     }
    //   });
  }



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
    // getPanelDetails()
    data2()
  }, [])



//   let theme_id = localStorage.getItem("theme");

//  // console.log("theme_id ",theme_id)
 
//   if (theme_id) {

//     let themedata = JSON.parse(theme_id);
    
//     console.log("themedata dashboard",themedata.dashboard)
//     console.log("themedata theme_version",themedata.theme_version)
//     console.log("themedata primary_col",themedata.primary_col)
//     console.log("themedata nav_head_col",themedata.nav_head_col)
//     console.log("themedata header_col",themedata.header_col)
//     console.log("themedata sidebar_col",themedata.sidebar_col)
//     console.log("themedata layout",themedata.layout)
//     console.log("themedata sidebar",themedata.sidebar)
//     console.log("themedata header_position",themedata.header_position)
//     console.log("themedata sidebar_position",themedata.sidebar_position)
//     console.log("themedata body_font",themedata.body_font)
//     console.log("themedata container",themedata.container)
   


//     $("body").removeClass(
//       "theme-1 theme-2 theme-3 theme-4 theme-5 theme-6 theme-7 theme-8 theme-9 theme-10"
//     );
//     $("body").addClass(themedata.dashboard);

//     $("body").attr("data-dashboard", `${themedata.dashboard}-dashboard`);
//     $("body").attr("data-theme-version", themedata.theme_version);
//     $("body").attr("data-primary", themedata.primary_col);
//     $("body").attr("data-nav-headerbg", themedata.nav_head_col);
//     $("body").attr("data-headerbg", themedata.header_col);
//     $("body").attr("data-sibebarbg", themedata.sidebar_col);

//     if ($("body").attr("data-sidebar-style") === "overlay") {
//       $("body").attr("data-sidebar-style", "full");
//       $("body").attr("data-layout", themedata.layout);
//       return;
//     }
//     $("body").attr("data-layout", themedata.layout);
//     if ($("body").attr("data-layout") === "horizontal") {
//       if (themedata.sidebar === "overlay") {
//         alert("Sorry! Overlay is not possible in Horizontal layout.");
//         return;
//       }
//     }
//     if ($("body").attr("data-layout") === "vertical") {
//       if (
//         $("body").attr("data-container") === "boxed" &&
//         themedata.sidebar === "full"
//       ) {
//         alert("Sorry! Full menu is not available in Vertical Boxed layout.");
//         return;
//       }
//       if (
//         themedata.sidebar === "modern" &&
//         $("body").attr("data-sidebar-position") === "fixed"
//       ) {
//         alert(
//           "Sorry! Modern sidebar layout is not available in the fixed position. Please change the sidebar position into Static."
//         );
//         return;
//       }
//     }
//     $("body").attr("data-sidebar-style", themedata.sidebar);
//     if ($("body").attr("data-sidebar-style") === "icon-hover") {
//       $(".deznav").on(
//         "hover",
//         function () {
//           $("#main-wrapper").addClass("iconhover-toggle");
//         },
//         function () {
//           $("#main-wrapper").removeClass("iconhover-toggle");
//         }
//       );
//     }

//     $("body").attr("data-header-position", themedata.header_position);
//     $("body").attr("data-sidebar-position", themedata.sidebar_position);
//     $("body").attr("data-typography", themedata.body_font);
//     if (themedata.container === "boxed") {
//       if (
//         $("body").attr("data-layout") === "vertical" &&
//         $("body").attr("data-sidebar-style") === "full"
//       ) {
//         $("body").attr("data-sidebar-style", "overlay");
//         $("body").attr("data-container", themedata.container);
//         setTimeout(function () {
//           $(window).trigger("resize");
//         }, 200);
//         return;
//       }
//     }
//     $("body").attr("data-container", themedata.container);

//     $(window).on("resize", function () {
//       var windowWidth = $(this).width();
//       if (windowWidth > 1024) {
//         $("body").attr("data-sidebar-style", "full");
//       } else if (windowWidth > 769 && windowWidth <= 1024) {
//         $("body").attr("data-sidebar-style", "mini");
//       } else if (windowWidth <= 767) {
//         $("body").attr("data-sidebar-style", "overlay");
//       }
//     });

 
//   }


  return (
    <div id="App">
      <div ref={pageRef} >
        {admin_permission && admin_permission.is_active == 1 ?  <NotFound /> : <Main_Router />}
      </div>
      {/* <button className='d-flex mx-auto' style={{ marginTop: '70px' }} onClick={captureScreenshot}>123Capture Screenshot</button> */}

    </div>
  )
}

export default App





