import React from "react";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { All_Panel_List } from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [AllData, setAllData] = useState({ loading: true, data: [] });
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [inActiveUserCount, setInActiveUserCount] = useState(0);

  const data = async () => {
    await dispatch(All_Panel_List())
      .unwrap()
      .then((response) => {
        const activeUsers = response.data.filter(
          (user) => user.is_active === 0
        ).length;
        const inActiveUsers = response.data.filter(
          (user) => user.is_active === 1
        ).length;

        setActiveUsersCount(activeUsers);
        setInActiveUserCount(inActiveUsers);

        setAllData({
          loading: false,
          data: response.data,
        });
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    data();
  }, []);

  return (
    <>
      <div className="content-body">
        {!AllData.loading && (
          <div className="container-fluid">
            {location.pathname === "/super/dashboard" ? (
              <>
                <div className="row">
                  <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
                    <div className="widget-stat card  sixth-dashboard-card">
                      <div className="card-body  p-4">
                        <div className="media">
                          <span className="me-3 bg-primary">
                            <i className="la la-users  text-white" />
                          </span>
                          <div className="media-body ">
                            <p className="mb-1">Total Panel</p>
                            <h3 className="">{AllData.data.length}</h3>

                            <div className="progress mb-2 bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
                    <div className="widget-stat card  sixth-dashboard-card">
                      <div className="card-body  p-4">
                        <div className="media">
                          <span className="me-3 bg-primary">
                            <i className="la la-users  text-white" />
                          </span>
                          <div className="media-body ">
                            <p className="mb-1">Total Active Panel</p>
                            <h3 className="">{activeUsersCount}</h3>

                            <div className="progress mb-2 bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
                    <div className="widget-stat card  sixth-dashboard-card">
                      <div className="card-body  p-4">
                        <div className="media">
                          <span className="me-3 bg-primary">
                            <i className="la la-users  text-white" />
                          </span>
                          <div className="media-body ">
                            <p className="mb-1">Total InActive Panel </p>
                            <h3 className="">{inActiveUserCount}</h3>
                            <div className="progress mb-2 bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row">
          
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
