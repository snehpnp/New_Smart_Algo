
import React, { useEffect, useState } from "react";

import Content from '../../../Components/Dashboard/Content/Content'

import Loader from "../../../Utils/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import {
    GET_ALL_SIGNUP_CLIENTS,


    DELETE_ALL_SIGNUP
} from "../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch } from "react-redux";
import { fa_time } from "../../../Utils/Date_formet";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import toast from 'react-hot-toast';
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const AllSignUpClients = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [SwitchButton, setSwitchButton] = useState(true);




    const dispatch = useDispatch();
    const Role = JSON.parse(localStorage.getItem("user_details")).Role;
    const user_ID = JSON.parse(localStorage.getItem("user_details")).user_id;
    const token = JSON.parse(localStorage.getItem("user_details")).token;
    const [refresh, setrefresh] = useState(false);
    const [DateArray, setDateArray] = useState([]);
    const [first, setfirst] = useState("all");

    const [getAllSignUpClients, setAllSignUpClients] = useState({
        loading: true,
        data: [],
    });




    const [getAllClient, setAllClient] = useState({
        loading: true,
        data: [],
    });

    const [userLogs, setUserLogs] = useState({
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
                } else {
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

                    {row.ActiveStatus === '1' ? <span
                        style={
                            cell == "off" || cell === null
                                ? { color: "#FF0000", fontSize: "15px" }
                                : { color: "#008000", fontSize: "15px" }
                        }
                    >
                       Active
                    </span> :
                        <Link to={`/admin/client/add`} state={row}>
                            <label class="toggle mt-3">
                                <input
                                    class="toggle-checkbox bg-primary"
                                    type="checkbox"
                                    checked={row.ActiveStatus === "1" ? true : false}
                                    onChange={(e) => {

                                    }}
                                />
                                <div class={`toggle-switch  ${row.ActiveStatus === "1" ? 'bg-success' : 'bg-danger'}`}></div>
                            </label>
                        </Link>
                    }
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



    return (
        <>
            {getAllSignUpClients.loading ? (
                <Loader />
            ) : (
                <>
                    <Content Page_title="All SignUp Clients" button_status={false}>
                        <Tabs
                            defaultActiveKey="home"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="home" title="Active Client">
                                {
                                    getAllSignUpClients.data.filter((client) => client.ActiveStatus == 1)
                                        .length > 0 && (
                                        <FullDataTable
                                            TableColumns={columns}
                                            tableData={getAllSignUpClients.data.filter(
                                                (client) => client.ActiveStatus == 1
                                            )}
                                        />
                                    )}
                            </Tab>
                            <Tab eventKey="profile" title="Inactive Client">

                                {
                                    getAllSignUpClients.data.filter((client) => client.ActiveStatus == 0)
                                        .length > 0 && (
                                        <FullDataTable
                                            TableColumns={columns}
                                            tableData={getAllSignUpClients.data.filter(
                                                (client) => client.ActiveStatus == 0
                                            )}
                                        />
                                    )}
                            </Tab>
                        </Tabs>
                    </Content>
                    <ToastButton />

                </>
            )}
        </>
    );
};

export default AllSignUpClients;
