/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Log_Out_User } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { check_Device } from "../../../Utils/find_device";
import toast from "react-hot-toast";
import { User, LogOut, Settings, Award, Wrench } from "lucide-react";
import { Get_Pmermission } from "../../../ReduxStore/Slice/Users/DashboardSlice";
import * as Config from "../../../Utils/Config";

const DropDown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [CheckUser, setCheckUser] = useState(check_Device());
  const [admin_permission, setAdmin_permission] = useState(0);

  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));
  const user_details1 = JSON.parse(localStorage.getItem("user_details_goTo"));

  useEffect(() => {
    Permmision();
  }, []);

  const LogoutUser = async () => {
    const request = {
      userId: user_details?.user_id,
      Device: CheckUser,
    };

    await dispatch(Log_Out_User(request))
      .then((res) => {
        if (res.payload.status) {
          toast.success(res.payload.msg);
          localStorage.removeItem("user_role");
          localStorage.removeItem("user_details");
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const profile_Routes = {
    USER: "/client/profile",
    ADMIN: "/admin/profile",
    SUBADMIN: "/subadmin/profile",
    SUPERADMIN: "/super/profile",
  };

  const profile_Route = () => {
    const roleKey = gotodashboard == null ? user_details?.Role : user_role_goTo;
    return profile_Routes[roleKey] || "/client/profile";
  };

  const Permmision = async () => {
    await dispatch(
      Get_Pmermission({
        domain: Config.react_domain,
        token: user_details?.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.data.length === 0) {
            setAdmin_permission(0);
          } else {
            setAdmin_permission(response.data[0].Refer_Earn);
          }
        } else {
          setAdmin_permission(0);
        }
      });
  };

  return (
    <div className="mb-0 dropdown custom-dropdown">
      <button
        type="button"
        className="btn btn-sm btn-outline-primary d-flex align-items-center"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src="../assets/images/avatar/1.png"
          alt="Profile"
          className="rounded-circle me-2"
          width="30"
          height="30"
        />
        <i className="fa fa-angle-down ms-1" />
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end"
        style={{ margin: 0, padding: "10px", minWidth: "150px" }}
      >
        <li className="dropdown-header text-center">
          <span
            className="text-capitalize"
            style={{ fontSize: "16px", color: "#000", fontWeight: "bold" }}
          >
            <i className="fas fa-user" style={{ marginRight: "8px" }}></i>
            User:{" "}
            {gotodashboard
              ? user_details1?.UserName
              : user_details?.UserName || "Guest"}
          </span>
          <hr />
        </li>

        {user_details?.Role === "ADMIN" && gotodashboard == null && (
          <li>
            <Link
              to="/admin/system"
              className="dropdown-item d-flex align-items-center"
            >
              <Wrench className="me-2" size={16} />
              System
            </Link>
          </li>
        )}

        <li>
          <Link
            to={profile_Route()}
            className="dropdown-item d-flex align-items-center my-2"
          >
            <User className="me-2" size={16} />
            Profile
          </Link>
        </li>

        {(admin_permission === "1" || admin_permission === 1) &&
          (user_details?.Role === "USER" || user_details?.Role === "ADMIN") && (
            <li>
              <Link
                to={
                  user_details?.Role === "USER" ? "/client/refer-earn" : "/admin/refer-earn"
                }
                className="dropdown-item d-flex align-items-center my-2"
              >
                <Award className="me-2" size={16} />
                Refer And Earn
              </Link>
            </li>
          )}

        {user_details?.Role === "ADMIN" && gotodashboard == null && (
          <li>
            <Link
              to="/admin/settings"
              className="dropdown-item d-flex align-items-center"
            >
              <Settings className="me-2" size={16} />
              Settings
            </Link>
          </li>
        )}

        {gotodashboard == null && (
          <li>
            <button
              className="dropdown-item d-flex align-items-center"
              onClick={(e) => LogoutUser(e)}
            >
              <LogOut className="me-2" size={16} />
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DropDown;
