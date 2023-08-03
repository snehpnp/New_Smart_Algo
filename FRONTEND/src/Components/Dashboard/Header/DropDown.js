/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Log_Out_User } from "../../../ReduxStore/Slice/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { check_Device } from "../../../Utils/find_device";
import toast from 'react-hot-toast';


const DropDown = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user_id = JSON.parse(localStorage.getItem('user_details')).user_id

    const [CheckUser, setCheckUser] = useState(check_Device());


    const LogoutUser = async () => {
        const request = {
            "userId": user_id,
            "Device": CheckUser
        }

        await dispatch(Log_Out_User(request))
            .then((res) => {
                if (res.payload.status) {
                    console.log("Log_Out_User", res.payload.msg);
                    toast.success(res.payload.msg)
                    localStorage.removeItem("user_role",);
                    localStorage.removeItem("user_details");
                    setTimeout(() => {
                        navigate("/");
                    }, 1500);
                }
            }).catch((error) => {
                console.log("logout error", error);

            })
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
            <div className="dropdown-menu dropdown-menu-end" style={{ margin: 0 }}>
                <button className=" my-2 text-center  text-white btn  btn-primary dropdown-item" href="#">
                    Profile
                </button>
                <button className="btn text-center text-white btn-primary dropdown-item" onClick={(e) => LogoutUser(e)}>
                    Logout
                </button>

            </div></div>
    )
}

export default DropDown