import Main_Router from './Routes/Route'
import NotFound from './layout/Auth/Deactivate_Company'
import React, { useState, useEffect, useRef } from 'react'
import * as Config from "./Utils/Config";
import axios from "axios";
import Loader from "./Utils/Loader";
import { set } from 'date-fns';

const App = () => {
  const pageRef = useRef(null);

  const [admin_permission, setAdmin_permission] = useState("");
  const [getLoader, setLoader] = useState(true);


  const data2 = async () => {
    try {
      const data = {
        "domain": Config.react_domain,
      }

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



  var LoadData = () => {
    setTimeout(() => {
      setLoader(false)

    }, 1500);
  }
  useEffect(() => {
    LoadData()
    data2()
  }, [])


  return (
    <div id="App">
      {/* {getLoader ? <Loader /> : */}
        <div ref={pageRef} >
          {admin_permission && admin_permission.is_active == 1 ? <NotFound /> : <Main_Router />}
        </div>
      {/* } */}
    </div>
  )
}

export default App





