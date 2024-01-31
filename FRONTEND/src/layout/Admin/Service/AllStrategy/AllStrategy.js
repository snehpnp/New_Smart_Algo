/* eslint-disable react/jsx-pascal-case */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Loader from "../../../../Utils/Loader";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable";

import { Pencil, Trash2, UserPlus, LayoutList } from "lucide-react";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";

import { useDispatch} from "react-redux";
import Modal from "../../../../Components/ExtraComponents/Modal";
import {
  Get_All_Strategy,
  Remove_Strategy_BY_Id,
  Get_client_By_strategy_Id,
} from "../../../../ReduxStore/Slice/Admin/StrategySlice";

import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

const ServicesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user_token = JSON.parse(localStorage.getItem("user_details")).token;

  const [showModal, setshowModal] = useState(false);

  const [refresh, setRefresh] = useState(false);

  //    For Filter

  const [searchInput, setSearchInput] = useState("");
  const [originalData, setOriginalData] = useState([]);

  const [AllStrategy, setAllStrategy] = useState({
    loading: true,
    data: [],
  });

  const [getServicesName, setServicesName] = useState({
    loading: true,
    data: [],
  });



  const data = async () => {
    await dispatch(
      Get_All_Strategy({
        req: {
          page: "1",
          limit: "100",
        },
        token: user_token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllStrategy({
            loading: false,
            data: response.data,
          });
        }
        setOriginalData(response.data);
      });
  };

  useEffect(() => {
    data();
  }, [refresh]);


  

  const columns = [
    {
      dataField: "index",
      text: "SR. No.",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      sort: true,
    },
    {
      dataField: "strategy_name",
      text: "Strategy Name",
      sort: true,
    },
    {
      dataField: "strategy_description",
      text: "Strategy Description",
      width: "550px",
      sort: true,
    },

    {
      dataField: "strategy_segment",
      text: "Segment",
      sort: true,
    },

    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div className="d-flex">
          <span data-toggle="tooltip" data-placement="top" title="Get Clients">
            <UserPlus
              size={20}
              strokeWidth={2}
              className="mx-1"
              onClick={(e) => GetClientsByStrategyID(row)}
            />
          </span>
          {/* <span data-toggle="tooltip" data-placement="top" title="Delete">
                        <LayoutList size={20} strokeWidth={2} className="mx-1" />
                    </span> */}
          <Link to={`/admin/strategies/edit/${row._id}`} state={row}>
            <span data-toggle="tooltip" data-placement="top" title="Edit">
              <Pencil
                size={20}
                color="#198754"
                strokeWidth={2}
                className="mx-1"
              />
              <>{cell}</>
            </span>
          </Link>
          <span data-toggle="tooltip" data-placement="top" title="Delete">
            <Trash2
              size={20}
              color="#d83131"
              strokeWidth={2}
              className="mx-1"
              onClick={() => RemoveStrategy(row._id)}
            />
          </span>
        </div>
      ),
    },
  ];

  // GET ALL CLIENTS BY STRATEGY ID
  
  const GetClientsByStrategyID = async (row) => {
    

    await dispatch(
      Get_client_By_strategy_Id({
        _id: row._id,
        token: user_token,
      })
    )
      .unwrap()
      .then((response) => {
        setshowModal(true);

        if (response.status) {

           
          setServicesName({
            loading: false,
            data: response.data,
          });
        } else {
          setServicesName({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  //  MANAGE MULTIFILTER
  useEffect(() => {
    
    const filteredData = originalData.filter((item) => {
      return (
        item.strategy_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.strategy_description
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        item.strategy_segment.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
    setAllStrategy({
      loading: false,
      data: searchInput ? filteredData : originalData,
    });
  }, [searchInput, originalData]);

  const ResetDate = (e) => {
    e.preventDefault();
    setSearchInput("");
    setAllStrategy({
      loading: false,
      data: getServicesName.data,
    });
  };





  // Remove_Strategy_BY_Id
  const RemoveStrategy = async (strat_id) => {
    if (window.confirm("Do you want to delete this ?")) {
      await dispatch(
        Remove_Strategy_BY_Id({
          _id: strat_id,
          token: user_token,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.msg);
            setRefresh(!refresh);
            setTimeout(() => {
              navigate("/admin/strategies");
            }, 5000);
          } else {
            toast.error(response.msg);
          }
        });
    }
  };








  return (
    <>
      {AllStrategy.loading ? (
        <Loader />
      ) : (
        <>
          <Content
            Page_title="All Strategy"
            button_title="Add Strategy"
            route="/admin/strategies/add"
          >
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

              <div className="col-lg-2 mt-3">
                <button
                  className="btn btn-primary mt-2"
                  onClick={(e) => ResetDate(e)}
                >
                  Reset
                </button>
              </div>
            </div>

            <FullDataTable
              TableColumns={columns}
              tableData={AllStrategy.data}
            />

            <ToastButton />

            {showModal ? (
              <>
                <Modal
                  isOpen={showModal}
                  size="ms-5"
                  title="Clients"
                  hideBtn={true}
                  // onHide={handleClose}
                  handleClose={() => setshowModal(false)}
                >
                  <BasicDataTable
                    TableColumns={[
                      {
                        dataField: "index",
                        text: "SR. No.",
                        formatter: (cell, row, rowIndex) => rowIndex + 1,
                      },
                      {
                        dataField: "users.UserName",
                        text: "user Name",
                      },
                      {
                        dataField: "users.license_type",
                        text: "lotsize",
                        formatter: (cell, row, rowIndex) => (
                          <>
                            <span>
                              {cell === "2"
                                ? "LIVE"
                                : cell === "1"
                                ? "DEMO"
                                : "2 Days"}
                            </span>
                          </>
                        ),
                      },
                    ]}
                    tableData={getServicesName && getServicesName.data}
                  />
                </Modal>
              </>
            ) : (
              ""
            )}
          </Content>
        </>
      )}
    </>
  );
};

export default ServicesList;
