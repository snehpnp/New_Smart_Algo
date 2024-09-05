import React, { useEffect, useState } from "react";
import Content from "../../../../Components/Dashboard/Content/Content";
import Loader from "../../../../Utils/Loader";
import { Link, useNavigate } from "react-router-dom";
import BasicDataTable from "../../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { Pencil, Trash2, UserPlus, PlusSquare, LayoutList } from "lucide-react";
import FullDataTable from "../../../../Components/ExtraComponents/Datatable/FullDataTable";
import { useDispatch } from "react-redux";
import Modal from "../../../../Components/ExtraComponents/Modal";
import { Get_All_Strategy, Remove_Strategy_BY_Id, Get_client_By_strategy_Id, Add_And_Remove_Strategy_To_Client, UpDate_strategy_Id } from "../../../../ReduxStore/Slice/Admin/StrategySlice";
import { GO_TO_DASHBOARDS } from '../../../../ReduxStore/Slice/Admin/AdminSlice'

import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";

const ServicesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_token = JSON.parse(localStorage.getItem("user_details")).token;
  const [getClient, setGetClient] = useState([]);
  const [startegyClientIds, setStartegyClientIds] = useState([]);
  const [startegyClientIdsDelete, setStartegyClientIdsDelete] = useState([]);
  const [startegyIds, setStartegyIds] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [showModal2, setshowModal2] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [oneStrategyClient, setOneStrategyClient] = useState([]);
  const [showStrategyName, setShowStrategyName] = useState('');
  const [AllStrategy, setAllStrategy] = useState({ loading: true, data: [] });
  const [getServicesName, setServicesName] = useState({ loading: true, data: [] });


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
          <span data-toggle="tooltip" data-placement="top" title="Get Client">
            <PlusSquare
              size={20}
              strokeWidth={2}
              className="mx-1"
              onClick={(e) => Add_Strategy_To_Client(row)}
            />
          </span>
        </div>
      ),
    },
  ];


  const Add_Strategy_To_Client = async (row) => {
    setShowStrategyName(row.strategy_name)
    await dispatch(
      Add_And_Remove_Strategy_To_Client({
        _id: row._id,
        token: user_token,
      })
    )
      .unwrap()
      .then((response) => {
        setshowModal2(true);
        if (response.status) {
          let sclientid = [];
          let OneStategyClientArr = [];
          response.StrategyClient.forEach(element => {
            sclientid.push(element.users._id)
            response.duplicateids.forEach(element1 => {
              if (element1.count == 1 && element.users._id == element1._id) {
                OneStategyClientArr.push(element1._id)
              }

            });

          });





          setStartegyIds(row._id)
          setOneStrategyClient(OneStategyClientArr)
          setStartegyClientIds(sclientid)
          setGetClient(response.AllClients);

        } else {

        }
      });
  };


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



  const handleStrategyChecked = (event) => {
    const CheckedClientId = event.target.name;

    if (event.target.checked) {
      setStartegyClientIds([...startegyClientIds, CheckedClientId]);
      setStartegyClientIdsDelete(startegyClientIdsDelete.filter((item) => item !== CheckedClientId));
    } else {
      setStartegyClientIdsDelete([...startegyClientIdsDelete, CheckedClientId]);
      setStartegyClientIds(startegyClientIds.filter((item) => item !== CheckedClientId));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault()
    let filteredArray = startegyClientIds.filter(item => !oneStrategyClient.includes(item));

    const req = {
      "clientId": filteredArray,
      "strategyId": startegyIds,
      "clientIdDelete": startegyClientIdsDelete
    }

    await dispatch(UpDate_strategy_Id({ req: req })).unwrap()
      .then((response) => {
        if (response.status) {
          toast.success(response.msg)
          setTimeout(() => {
            setshowModal2(false)
          }, [1000])
        }
        else {
          toast.error(response.msg)
        }
      })
  }


  const goToDashboard = async (email) => {
    let req = {
      Email: email.users.Email,

    };
    await dispatch(GO_TO_DASHBOARDS(req)).unwrap()
      .then((response) => {
        if (response.status) {
          localStorage.setItem("gotodashboard", JSON.stringify(true));
          localStorage.setItem("user_details_goTo", JSON.stringify(response.data));
          localStorage.setItem("user_role_goTo", JSON.stringify(response.data.Role));
          localStorage.setItem("page", "strategies");

          navigate("/client/dashboard")

        }
      })

  }

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
                <div className="mb-3">
                  <label for="exampleFormControlInput1" className="form-label">
                    Search Something Here
                  </label>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-control"
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
                  size="x"
                  title="Clients"
                  hideBtn={true}
                  handleClose={() =>
                    setshowModal(false)}
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
                                  ? "Paper Trading"
                                  : "Live 2 Days"}
                            </span>
                          </>
                        ),
                      },
                      // {
                      //   dataField: 'users.TradingStatus',
                      //   text: 'Go To Dashboard',
                      //   formatter: (cell, row, rowIndex) =>
                      //     <>


                      //       <button
                      //         className={`btn  ${row.users.AppLoginStatus == '1' || row.users.WebLoginStatus == '1' ? "btn-success" : "btn-danger"} btn-new-block`}

                      //         onClick={() => goToDashboard(row)}
                      //         disabled={row.users.AppLoginStatus === '0' && row.users.WebLoginStatus === '0'}

                      //       > click</button>
                      //     </>
                      // },
                    ]}
                    tableData={getServicesName && getServicesName.data}
                  />
                </Modal>
              </>
            ) : (
              ""
            )}


            {showModal2 ?
              (
                <>
                  <Modal
                    isOpen={showModal2}
                    size="ms-5"
                    title={showStrategyName}
                    hideBtn={true}
                    handleClose={() =>
                      setshowModal2(false)
                    }
                  >

                    <form onSubmit={(e) => handleSubmit(e)}>
                      <table className="mb-5">
                        <thead>
                          <tr>
                            <th className="h4">Clients List</th>
                          </tr>
                        </thead>

                        <tbody>
                          {getClient && getClient.map((client, index) => {
                            return <tr className="mx-3 h4 font-weight-bold"  >
                              <td>
                                <input
                                  type="checkbox"
                                  id={client._id}
                                  name={client._id}
                                  value="checkboxValue"
                                  defaultChecked={startegyClientIds.includes(client._id)}
                                  disabled={oneStrategyClient.includes(client._id)}
                                  onChange={(e) => handleStrategyChecked(e)}
                                />

                                <label className="mx-3" for={client._id}>{client.UserName}</label>
                                {
                                  oneStrategyClient.includes(client._id) ?
                                    <Link to={`/admin/client/edit/${client._id}`} state={client} >
                                      <span data-toggle="tooltip" data-placement="top" title="Edit">
                                        <Pencil
                                          size={20}
                                          color="#198754"
                                          strokeWidth={2}
                                          className="mx-1"
                                        />
                                      </span>
                                    </Link> : ""}

                              </td>
                            </tr>
                          }
                          )}
                        </tbody>
                      </table>
                      <button className="btn btn-primary" type="submit" >Update</button>
                    </form>

                  </Modal>
                </>
              ) : ""}

          </Content>
        </>
      )}
    </>
  );
};

export default ServicesList;
