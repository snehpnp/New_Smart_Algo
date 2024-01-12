/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { Log_Out_User } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { check_Device } from "../../../Utils/find_device";
import toast from 'react-hot-toast';


const DropDown = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user_id = JSON.parse(localStorage.getItem('user_details')).user_id
    const Role = JSON.parse(localStorage.getItem('user_details')).Role

    const [CheckUser, setCheckUser] = useState(check_Device());

    const gotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))

    const LogoutUser = async () => {
        const request = {
            "userId": user_id,
            "Device": CheckUser
        }

        await dispatch(Log_Out_User(request))
            .then((res) => {
                if (res.payload.status) {
                    toast.success(res.payload.msg)
                    localStorage.removeItem("user_role",);
                    localStorage.removeItem("user_details");
                    localStorage.clear();
                    setTimeout(() => {
                        navigate("/");
                    }, 1500);
                }
            }).catch((error) => {
                console.log("Error logout error", error);

            })
    }

    const profile_Route = () => {

        if (Role === "USER") {
            return "/client/profile"
        }
        else if (Role === "ADMIN") {
            return "/admin/profile"
        }
        else if (Role === "SUBADMIN") {
            return "/subadmin/profile"
        }
        else if (Role === "SUPERADMIN") {
            return "/super/profile"
        } else {
            return "/client/profile"
        }

    }


    return (
        <div className="mb-0 dropdown custom-dropdown">
            <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <img src="../assets/images/avatar/1.png" />
                <i className="fa fa-angle-down ms-3" />
            </button>
            <div className="dropdown-menu dropdown-menu-end" style={{ margin: 0, padding: "11px" }}>
                <Link to={profile_Route()} className="btn btn-primary w-100 my-2 ">
                    Profile
                </Link>
                {gotodashboard == null ?
                    <button className="btn btn-primary  w-100 " onClick={(e) => LogoutUser(e)}>
                        Logout
                    </button>
                    : ""}


            </div>
        </div>
    )
}

export default DropDown