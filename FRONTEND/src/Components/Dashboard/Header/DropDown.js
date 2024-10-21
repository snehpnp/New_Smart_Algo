/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Log_Out_User } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { check_Device } from "../../../Utils/find_device";
import toast from "react-hot-toast";
import { User, LogOut, Settings, Award } from "lucide-react";
import { Get_Pmermission } from "../../../ReduxStore/Slice/Users/DashboardSlice";
import * as Config from "../../../Utils/Config";

const DropDown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const Role = JSON.parse(localStorage.getItem("user_details")).Role;
  const [CheckUser, setCheckUser] = useState(check_Device());
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const user_role_goTo = JSON.parse(localStorage.getItem("user_role_goTo"));

  const [admin_permission, setAdmin_permission] = useState(0);
  const token = JSON.parse(localStorage.getItem("user_details")).token;
  useEffect(() => {
    Permmision();
  }, []);

  const LogoutUser = async () => {
    const request = {
      userId: user_id,
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
            navigate("/");
          }, 1500);
        }
      })
      .catch((error) => {
        return;
      });
  };


  const profile_Route = () => {
    if (gotodashboard == null) {
      if (Role === "USER") {
        return "/client/profile";
      } else if (Role === "ADMIN") {
        return "/admin/profile";
      } else if (Role === "SUBADMIN") {
        return "/subadmin/profile";
      } else if (Role === "SUPERADMIN") {
        return "/super/profile";
      } else {
        return "/client/profile";
      }
    } else {
      if (user_role_goTo === "USER") {
        return "/client/profile";
      } else if (user_role_goTo === "ADMIN") {
        return "/admin/profile";
      } else if (user_role_goTo === "SUBADMIN") {
        return "/subadmin/profile";
      } else if (user_role_goTo === "SUPERADMIN") {
        return "/super/profile";
      } else {
        return "/client/profile";
      }
    }
  };

  const Permmision = async () => {
    await dispatch(
      Get_Pmermission({
        domain: Config.react_domain,
        token: token,
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
        {Role === "ADMIN" && gotodashboard == null ? (
          <li>
            <Link
              to="/admin/system"
              className="dropdown-item d-flex align-items-center"
            >
              <Settings className="me-2" size={16} />
              System
            </Link>
          </li>
        ) : null}
        <li>
          <Link
            to={profile_Route()}
            className="dropdown-item d-flex align-items-center my-2"
          >
            <User className="me-2" size={16} />
            Profile
          </Link>
        </li>

        {admin_permission && admin_permission == 1 ? (
          Role === "USER" || Role === "ADMIN" ? (
            <li>
              <Link
                to={
                  Role === "USER" ? "/client/refer-earn" : "/admin/refer-earn"
                }
                className="dropdown-item d-flex align-items-center my-2"
              >
                <Award className="me-2" size={16} />
                Refer And Earn
              </Link>
            </li>
          ) : null
        ) : (
          ""
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
