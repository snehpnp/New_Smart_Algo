import Main_Router from './Routes/Route'
import NotFound from './layout/Auth/Deactivate_Company'
import React, { useState, useEffect, useRef } from 'react'
import * as Config from "./Utils/Config";
import axios from "axios";
import Loader from './Utils/Loader'; 

const App = () => {
  const pageRef = useRef(null);
  const [admin_permission, setAdmin_permission] = useState("");
  const [loading, setLoading] = useState(true); 

  const data2 = async () => {
    const data = { "domain": Config.react_domain };

    const fetchData = axios.post(`${Config.smartAlogUrl}get/panel/permission`, data, {
      data: { data },
    });

    const delay = new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay

    try {
      const res = await Promise.all([fetchData, delay]).then(values => values[0]);

      if (res.data.status) {
        setAdmin_permission(res.data.data[0]);
      } else {
        setAdmin_permission(res.data);
      }
    }
    catch (err) {
      console.error(err);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    data2()
  }, [])

  return (
    <div id="App">
      <div ref={pageRef}>
        {loading ? (
          <Loader fullPage />
        ) : (
          admin_permission && admin_permission.is_active == 1 ? <NotFound /> : <Main_Router />
        )}
      </div>
    </div>
  )
}

export default App
