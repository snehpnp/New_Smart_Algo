import Main_Router from "./Routes/Route";
import NotFound from "./layout/Auth/Deactivate_Company";
import React, { useState, useEffect, useRef, Suspense } from "react";
import * as Config from "./Utils/Config";
import axios from "axios";

const App = () => {
  const pageRef = useRef(null);
  const [admin_permission, setAdmin_permission] = useState(null);

  const data2 = async () => {
    try {
      const res = await axios.post(`${Config.smartAlogUrl}get/panel/permission`, {
        domain: Config.react_domain,
      });
      setAdmin_permission(res.data?.status ? res.data.data?.[0] : {});
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    data2();
  }, []);

  return (
    <div id="App">
      <div ref={pageRef}>
        <Suspense fallback={<p>Loading...</p>}>
          {admin_permission ? (
            admin_permission.is_active === 1 ? (
              <NotFound />
            ) : (
              <Main_Router />
            )
          ) : (
          //  ANIMATED LODING SCREEN
            <div className="loader">
              <div className="loader-inner">
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
                <div className="loader-line-wrap">
                  <div className="loader-line"></div>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default App;
