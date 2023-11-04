// import React from 'react'
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Loader from "../../../../Utils/Loader";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch, useSelector } from "react-redux";
import { Expired_Soon_User } from "../../../../ReduxStore/Slice/Admin/LicenceSlice";
import { fDate, fDateTimeSuffix } from "../../../../Utils/Date_formet";

const ExpiredLicence = () => {
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const [originalData, setOriginalData] = useState([]);
  const [searchInput, setSearchInput] = useState("");


  const [getAllClients, setAllClients] = useState({
    loading: true,
    data: [],
  });

  const data = async () => {
    await dispatch(Expired_Soon_User({ token: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllClients({
            loading: false,
            data: response.data,
          });
        } else {
          setAllClients({
            loading: false,
            data: response.data,
          });
        }

        setOriginalData(response.data);
      });
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
      sort: true,
    },
    {
      dataField: "Email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "PhoneNo",
      text: "Phone Number",
      sort: true,
    },
    {
      dataField: "StartDate",
      text: "Start Date",
      formatter: (cell, row) => fDateTimeSuffix(row.StartDate),
      sort: true,
    },
    {
      dataField: "EndDate",
      text: "End Date",
      formatter: (cell, row) => fDateTimeSuffix(row.EndDate),
      sort: true,
    },
  ];




//  MANAGE MULTIFILTER
  useEffect(() => {
    const filteredData = originalData.filter((item) => {
      return (
        item.UserName.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.Email.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.PhoneNo.includes(searchInput) ||
        fDateTimeSuffix(item.StartDate).includes(searchInput) ||
        fDateTimeSuffix(item.EndDate).includes(searchInput)
      );
    });
    setAllClients({
      loading: false,
      data: searchInput ? filteredData : originalData,
    });
  }, [searchInput, originalData]);

  return (
    <>
      {getAllClients.loading ? (
        <Loader />
      ) : (
        <>
          <Content Page_title="Expired Soon Licence" button_status={false}>
            <div className="row">
              <div className="col-lg-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">
                    Search Something Here
                  </label>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    class="form-control"
                    id="exampleFormControlInput1"
                  />
                </div>
              </div>
            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={getAllClients.data}
            />
          </Content>
        </>
      )}
    </>
  );
};

export default ExpiredLicence;
