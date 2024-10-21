import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import Loader from "../../../Utils/Loader";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../Components/ExtraComponents/Modal";
import { fa_time, fDateTimeSuffix, today } from "../../../Utils/Date_formet";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  Get_Admin_Helps,
  Get_All_Admin_Client,
  DELETE_USER_SERVICES,
  Find_User,
  DELETE_LICENSE_API,
} from "../../../ReduxStore/Slice/Superadmin/SuperAdminSlice";

const SubAdminList = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [allClients, setAllClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({ loading: true, data: [] });
  const [searchInput, setSearchInput] = useState("");
  const [licence, setLicence] = useState("");

  const rowId = localStorage.getItem("RowData");
  const backendUrl = localStorage.getItem("backend_rul");
  const userName = JSON.parse(localStorage.getItem("user_details")).UserName;
  const panelName = localStorage.getItem("panel_name");

  useEffect(() => {
    GetAllClients();
  }, [refresh]);

  useEffect(() => {
    filterClients();
  }, [searchInput, allClients]);

  const GetAllClients = async () => {
    try {
      const data = { id: rowId };
      const response = await dispatch(Get_All_Admin_Client(data)).unwrap();

      if (response.status) {
        setAllClients(response.data.data);
        setFilteredClients(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch clients.");
    }
  };

  const filterClients = () => {
    const filterData = allClients.filter(
      (item) =>

        searchInput === "" ||
        item.UserName.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.Email.toLowerCase().includes(searchInput.toLowerCase()) || 
        item.PhoneNo.includes(searchInput) 
        // item.broker.toLowerCase().includes(searchInput.toLowerCase()) || 
        // item.license_type.toLowerCase().includes(searchInput.toLowerCase()) 

        


    );
    setFilteredClients(filterData);
  };

  const DeleteUser = async (id) => {
    if (window.confirm("Do you want to delete this User ?")) {
      try {
        const req = {
          id,
          backend_rul: backendUrl,
          superadmin_name: userName,
          panel_name: panelName,
        };
        const response = await dispatch(DELETE_USER_SERVICES(req)).unwrap();

        if (response.status) {
          toast.success(response.msg);
          setRefresh(!refresh);
        } else {
          toast.error(response.msg);
        }
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    }
  };

  const handleViewFunction = async (id) => {
    try {
      const data = { id, backend_rul: backendUrl };
      const response = await dispatch(Find_User(data)).unwrap();

      if (response.status) {
        setUserData({ loading: false, data: response.data });
      }
    } catch (error) {
      toast.error("Failed to fetch user details.");
    }
  };

  const showBrokerName = (value1, licence_type) => {
    let value = parseInt(value1);

    if (licence_type === "0") return "2 Days Only";
    if (licence_type === "1") return "Demo";

    switch (value) {
      case 1:
        return "markethub";
      case 2:
        return "alice blue";
      case 3:
        return "master trust";
      case 4:
        return "Motilal Oswal";
      case 5:
        return "Zebull";
      case 6:
        return "IIFl";
      case 7:
        return "Kotak";
      case 8:
        return "Mandot";
      case 9:
        return "Choice";
      case 10:
        return "Anand Rathi";
      case 11:
        return "B2C";
      case 12:
        return "Angel";
      case 13:
        return "Fyers";
      case 14:
        return "5-Paisa";
      case 15:
        return "Zerodha";
      default:
        return "Unknown";
    }
  };

  const showLicenceName = (value1, licence_type) => {
    let value = parseInt(value1);
    if (licence_type === "0") return "2 Days Only";
    if (licence_type === "1") return "Demo";
    return "Live";
  };

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    { dataField: "UserName", text: "User Name" },
    { dataField: "Email", text: "Email" },
    { dataField: "PhoneNo", text: "Phone Number" },
    {
      dataField: "broker",
      text: "Broker",
      formatter: (cell, row) => showBrokerName(cell, row.license_type),
    },
    {
      dataField: "license_type",
      text: "Licence Type",
      formatter: (cell, row) => showLicenceName(cell, row.license_type),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div style={{ width: "120px" }}>
          {row.license_type == 2 ? (
            <Link>
              <span data-toggle="tooltip" data-placement="top" title="View">
                <Eye
                  size={20}
                  strokeWidth={2}
                  className="mx-1"
                  onClick={() => {
                    setShowModal(true);
                    handleViewFunction(row._id);
                  }}
                />
              </span>
            </Link>
          ) : null}

          <Link to={`/super/client/edit/${row._id}`} state={row}>
            <span data-toggle="tooltip" data-placement="top" title="Edit">
              <Pencil
                size={20}
                color="#198754"
                strokeWidth={2}
                className="mx-1"
              />
            </span>
          </Link>
          <Link>
            <span data-toggle="tooltip" data-placement="top" title="Delete">
              <Trash2
                size={20}
                color="#d83131"
                strokeWidth={2}
                className="mx-1"
                onClick={() => DeleteUser(row._id)}
              />
            </span>
          </Link>
        </div>
      ),
    },
  ];

  function getMonthsRemaining(endDate) {
    const currentDate = new Date();
    const end = new Date(endDate);

    if (end < currentDate) {
      return 0;
    }

    const yearDiff = end.getFullYear() - currentDate.getFullYear();
    const monthDiff = end.getMonth() - currentDate.getMonth();

    let monthsRemaining = yearDiff * 12 + monthDiff;

    if (end.getDate() < currentDate.getDate()) {
      monthsRemaining -= 1;
    }

    return monthsRemaining;
  }

  const RemoveLicense = async (data) => {
    // if (window.confirm("Do you want to remove this License ?")) {
    try {
      const req = {
        UserName: userData.data[0].UserName,
        licence: licence,
        backend_rul: backendUrl,
        superadmin_name: userName,
        panel_name: panelName,
      };
      const response = await dispatch(DELETE_LICENSE_API(req)).unwrap();

      if (response.status) {
        toast.success(response.msg);
        setRefresh(!refresh);
        setShowModal(false);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      toast.error("Failed to delete user.");
    }
    // }
  };

  const ChnageInput = (e, endDate) => {
    let value = e.target.value;
    var remainData = getMonthsRemaining(endDate);

    if (value > remainData) {
      e.target.value = remainData;
      setLicence(remainData);
      toast.error("You can't remove more than remaining months");
    } else {
      setLicence(value);
    }
  };


  return (
    <>
      {!allClients.length ? (
        <Loader />
      ) : (
        <Content
          Page_title="Client List"
          button_status={true}
          button_title="Back"
          route="/super/permitions"
        >
          <div className="mb-4">
            <h6>Search here something</h6>
            <input
              type="text"
              style={{ height: "2rem" }}
              placeholder="search..."
              className="p-2 rounded"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
          </div>
          <FullDataTable TableColumns={columns} tableData={filteredClients} />
        </Content>
      )}
      {showModal && (
        <Modal
          isOpen={showModal}
          size="md"
          title="Licence View"
          hideBtn={true}
          handleClose={() => setShowModal(false)}
        >
          <table className="table table-responsive-sm table-bordered ">
            {userData.data && (
              <tbody>
                <tr>
                  <td>Create Date</td>
                  <td>
                    {userData.data.length > 0 &&
                      fDateTimeSuffix(userData.data[0]?.CreateDate)}
                  </td>
                </tr>
                <tr>
                  <td>Start Date</td>
                  <td>
                    {userData.data.length > 0 &&
                      fDateTimeSuffix(userData.data[0]?.StartDate)}
                  </td>
                </tr>
                <tr>
                  <td>End Date</td>
                  <td>
                    {userData.data.length > 0 &&
                      fDateTimeSuffix(userData.data[0]?.EndDate)}
                  </td>
                </tr>
                <tr>
                  <td>To Month</td>
                  <td>
                    {userData.data.length > 0 && userData.data[0]?.totalLicence}
                  </td>
                </tr>
                <tr>
                  <td>Total Licence</td>
                  <td>
                    {userData.data.length > 0 && userData.data[0]?.licence}
                  </td>
                </tr>
                <tr>
                  <td>Remaining Licence</td>
                  <td>
                    {userData.data.length > 0 &&
                      getMonthsRemaining(userData.data[0]?.EndDate)}
                  </td>
                </tr>
                <tr>
                  <td>Minus Licence</td>
                  <td>
                    <input
                      type="Number"
                      onChange={(e) =>
                        ChnageInput(e, userData.data[0]?.EndDate)
                      }
                    />{" "}
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-primary"
                      onClick={(e) => RemoveLicense(userData.data)}
                    >
                      Submit
                    </button>{" "}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </Modal>
      )}
    </>
  );
};

export default SubAdminList;
