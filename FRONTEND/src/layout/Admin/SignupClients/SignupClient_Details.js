
import React, { useEffect, useState } from "react";

import Content from '../../../Components/Dashboard/Content/Content'

import Loader from "../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
    GET_ALL_SIGNUP_CLIENTS,
    UPDATE_USER_ACTIVE_STATUS,
    DELETE_USER_SERVICES,
    DELETE_ALL_SIGNUP
} from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch } from "react-redux";
import { fa_time } from "../../../Utils/Date_formet";



import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const AllSignUpClients = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const dispatch = useDispatch();
    const Role = JSON.parse(localStorage.getItem("user_details")).Role;
    const user_ID = JSON.parse(localStorage.getItem("user_details")).user_id;
    const token = JSON.parse(localStorage.getItem("user_details")).token;

    // For Filter
    const [SwitchButton, setSwitchButton] = useState(true);


    const [refresh, setrefresh] = useState(false);

    const [getAllSignUpClients, setAllSignUpClients] = useState({
        loading: true,
        data: [],
    });


    // DELETE USET FUNCTION TO DELETE ALL SERVICES
    const Delete_user = async (id) => {
        var req1 = {
            id: id,
        };
        if (window.confirm("Do you want to delete this User ?")) {
            await dispatch(DELETE_ALL_SIGNUP(req1))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        toast.success(response.msg);

                        setrefresh(!refresh);
                    } else {
                        toast.error(response.msg);

                    }
                });
        } else {
            return
        }
    };

    const data = async () => {
        var req1 = {
            Find_Role: Role,
            user_ID: user_ID,
        };

        await dispatch(GET_ALL_SIGNUP_CLIENTS(req1))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setAllSignUpClients({
                        loading: false,
                        data: response.data,
                    });
                }else{
                    setAllSignUpClients({
                        loading: false,
                        data: [],
                    });
                }
            })
            .catch()
            
    };

    useEffect(() => {
        data();
    }, [refresh]);

    // ACTIVE USER TO API
    const activeUser = async (e, data) => {

        if (window.confirm("Do you want To Change Status For This User ?") === true) {
            let req = {
                id: data._id,
                user_active_status: e.target.checked === true ? "1" : "0",
            };
            await dispatch(UPDATE_USER_ACTIVE_STATUS(req))
                .unwrap()
                .then((response) => {
                    setrefresh(!refresh)
                    window.location.reload();

                    if (response.status) {

                        setrefresh(!refresh)
                        toast.success(response.msg);

                        window.location.reload()
                        setTimeout(() => {
                        }, 500);
                    } else {
                        toast.error(response.msg);
                    }
                });
        }
        else {
            return setrefresh(!refresh)

        }


    };

    const columns = [
        {
            dataField: "index",
            text: "SR. No.",
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: "UserName",
            text: "User Name",
        },
        {
            dataField: "Email",
            text: "Email",
        },

        {
            dataField: "FullName",
            text: "Full Name",
        },

        {
            dataField: "PhoneNo",
            text: "Phone Number",
        },
        {
            dataField: "ActiveStatus",
            text: "Status",
            formatter: (cell, row) => (
                <>
                    <label class="toggle mt-3">
                        <input
                            class="toggle-checkbox bg-primary"
                            type="checkbox"
                            checked={row.ActiveStatus === "1" ? true : false}
                            onChange={(e) => {
                                activeUser(e, row);
                                setSwitchButton(e.target.checked)
                            }}
                        />
                        <div class={`toggle-switch  ${row.ActiveStatus === "1" ? 'bg-success' : 'bg-danger'}`}></div>
                    </label>
                </>
            ),
        },
        {
            dataField: "CreateDate",
            text: "Create Date",
            formatter: (cell, row) => fa_time(row.createdAt),
        },

        {
            dataField: "actions",
            text: "Actions",
            formatter: (cell, row) => (
                <div style={{ width: "120px" }}>
                    <div>
                        <Link>
                            <span data-toggle="tooltip" data-placement="top" title="Delete">
                                <Trash2
                                    size={20}
                                    color="#d83131"
                                    strokeWidth={2}
                                    className="mx-1"
                                    onClick={(e) => Delete_user(row._id)}
                                />
                            </span>
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    console.log("kika", getAllSignUpClients)

    return (
        <>
            {getAllSignUpClients.loading ? (
                <Loader />
            ) : (
                <>
                    <Content button_status={false}
                        Page_title_showClient="All SignUp Clients"
                    >

                        <FullDataTable
                            TableColumns={columns}
                            tableData={getAllSignUpClients.data}
                        />
                        <ToastButton />

                    </Content>
                </>
            )}
        </>
    );
};

export default AllSignUpClients;
