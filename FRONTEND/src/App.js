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
  
    };

    await dispatch(Get_Panel_Informtion(req))
      .unwrap()
      .then((response) => {
        let res = response.data[0].theme_data[0];
        localStorage.setItem("theme", JSON.stringify(res));
      });
  };






  useEffect(() => {
    data2()
  }, [])






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





