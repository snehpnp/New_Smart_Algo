import React, { useEffect, useState } from "react";
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content";
import Loader from "../../../../Utils/Loader";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { GET_ALL_CLIENTS } from "../../../../ReduxStore/Slice/Admin/AdminSlice";
import { useDispatch } from "react-redux";
import Modal from "../../../../Components/ExtraComponents/Modal";

const Sign_Up_Clients = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
    error: null,
  });

  const data = async () => {
    try {
      const response = await dispatch(GET_ALL_CLIENTS()).unwrap();
      if (response.status) {
        setAllClients({
          loading: false,
          data: response.data,
          error: null,
        });
      }
    } catch (error) {
      setAllClients({
        loading: false,
        data: [],
        error: "Failed to fetch clients. Please try again later.",
      });
    }
  };

  useEffect(() => {
    data();
  }, []);

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
      dataField: "PhoneNo",
      text: "Phone Number",
    },
    {
      dataField: "Otp",
      text: "Password",
    },
    {
      dataField: "ActiveStatus",
      text: "Status",
      formatter: (cell, row) => (
        <label className="switch">
          <input
            type="checkbox"
            className="bg-primary"
            checked={row.ActiveStatus === "1"}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div>
          <Link to="/admin/editsignupclients">
            <span data-toggle="tooltip" data-placement="top" title="Edit">
              <Pencil size={20} color="#198754" strokeWidth={2} className="mx-1" />
            </span>
          </Link>
          <span data-toggle="tooltip" data-placement="top" title="Delete">
            <Trash2 size={20} color="#d83131" strokeWidth={2} className="mx-1" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <Theme_Content Page_title="All Signup Clients" button_status={false}>
      {getAllClients.error ? (
        <div className="alert alert-danger">{getAllClients.error}</div>
      ) : getAllClients.data.length === 0 ? (
        "No data found"
      ) : (
        <>
          {getAllClients.loading ? (
            <Loader />
          ) : (
            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data}
            />
          )}
        </>
      )}

      {showModal && (
        <Modal
          isOpen={showModal}
          backdrop="static"
          size="sm"
          title="Verify OTP"
          btn_name="Verify"
          handleClose={() => setShowModal(false)}
        />
      )}
    </Theme_Content>
  );
};

export default Sign_Up_Clients;
