import Main_Router from './Routes/Route'
import NotFound from './layout/Auth/Deactivate_Company'

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from "react-redux";
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

      const data = { "domain": Config.react_domain }

      const res = await axios.post(`${Config.smartAlogUrl}get/panel/permission`, data, {
        data: { data },
      })

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
   
    </div>
  )
}

export default App





