/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Content from "../../../Components/Dashboard/Content/Content";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { check_Device } from "../../../Utils/find_device";
import {
  User_Dashboard_Data,
  Update_Dashboard_Data,
} from "../../../ReduxStore/Slice/Users/DashboardSlice";
import Loader from "../../../Utils/Loader";
import { GET_IP } from "../../../Service/common.service";
import NewsTicker from "./NewsTicker";

const BrokerResponse = () => {
  const dispatch = useDispatch();

  const BrokerId = JSON.parse(localStorage.getItem("broker"));

  const user_details = JSON.parse(localStorage.getItem("user_details"));
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));
  const Role = JSON.parse(localStorage.getItem("user_role"));
  const [showStartegyModal, setShowStartegyModal] = useState(false);
  const [modalsingleValue, setModalsingleValue] = useState({});
  const [Strategy, setStrategy] = useState({ loading: true, data: [] });
  const [GetServiceStrategy, setGetServiceStrategy] = useState([]);
  const [statusStartegyUser, setStatusStartegy] = useState("0");
  const [inputValue, setInputValue] = useState("1");
  const [DashboardData, setDashboardData] = useState({
    loading: true,
    data: [],
  });
  const [updatedData, setUpdatedData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const [ip, setIp] = useState("");

  useEffect(() => {
    GET_IP().then((response) => {
      setIp(response.data.ip);
    });
  }, []);

  const handleCloseStartegyModal = () => {
    setShowStartegyModal(false);
    setModalsingleValue({});
  };

  const handleShowStartegyModal = (data) => {
    setModalsingleValue(data);
    setShowStartegyModal(true);
  };

  const getservice = async () => {
    await dispatch(
      User_Dashboard_Data({
        user_Id: gotodashboard ? GoToDahboard_id.user_id : user_details.user_id,
        AdminToken: user_details.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setDashboardData({
            loading: false,
            data: response.services,
          });

          setStrategy({
            loading: false,
            data: response.strategy,
          });

          setGetServiceStrategy(response.GetServiceStrategy);
          setStatusStartegy(response.status_startegy);
        }
      });
  };

  useEffect(() => {
    getservice();
  }, []);

  const setgroup_qty_value_test = (e, symboll, rowdata, data) => {
    let numericValue;
    if (e.target.name !== "active_status") {
      numericValue = e.target.value.replace(/[^0-9]/g, "");
    }

    if (e.target.name !== "active_status" && numericValue === 0) {
      toast.error(`cant update  0 Quantity In ${symboll}`);
      e.target.value = 1;
      return;
    }

    if (e.target.name !== "active_status" && e.target.value < 0) {
      e.target.value = 1;
      toast.error(`cant update  - Quantity In ${symboll}`);
      return;
    }

    if (e.target.name === "lot_size") {
      if (numericValue) {
        setInputValue((prevPrices) => ({
          ...prevPrices,
          [symboll]: e.target.value,
        }));
        if (
          data.servicegroup_services_ids.group_qty !== 0 &&
          parseInt(e.target.value) * parseInt(data.service.lotsize) >
            parseInt(data.servicegroup_services_ids.group_qty)
        ) {
          toast.error(
            `cant update more then ${data.servicegroup_services_ids.group_qty} In ${symboll}`
          );
          // e.target.value = 1
          return;
        }
      } else {
        // e.target.value = 1
        return;
      }
    } else if (e.target.name === "strategy_id") {
      const targetObject = GetServiceStrategy.find(
        (item) => item._id === data.service._id
      );
      if (targetObject.strategy_id.includes(e.target.value)) {
        const updatedStrategyId = targetObject.strategy_id.filter(
          (id) => id !== e.target.value
        );
        const updatedObject = {
          ...targetObject,
          strategy_id: updatedStrategyId,
        };
        setGetServiceStrategy((oldArray) =>
          oldArray.map((item) =>
            item._id === targetObject._id ? updatedObject : item
          )
        );
      } else {
        if (
          DashboardData.data[0].userInfo.multiple_strategy_select === 0 ||
          DashboardData.data[0].userInfo.multiple_strategy_select === "0"
        ) {
          const updatedObject = {
            ...targetObject,
            strategy_id: [e.target.value],
          };
          setGetServiceStrategy((oldArray) =>
            oldArray.map((item) =>
              item._id === targetObject._id ? updatedObject : item
            )
          );
        } else {
          const updatedObject = {
            ...targetObject,
            strategy_id: [...targetObject.strategy_id, e.target.value],
          };
          setGetServiceStrategy((oldArray) =>
            oldArray.map((item) =>
              item._id === targetObject._id ? updatedObject : item
            )
          );
        }
      }
    }

    let name = e.target.name;
    let value = e.target.value;
    let id = rowdata._id;

    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: name === "active_status" ? e.target.checked : value,
        ...(name === "lot_size" && {
          quantity: parseInt(e.target.value) * parseInt(data.service.lotsize),
        }),
        // ...(name !== "lot_size" && { "quantity": data.service.lotsize, "lot_size": "1" }),
      },
    }));
  };

  if (updatedData) {
    GetServiceStrategy.forEach((item) => {
      if (updatedData[item._id] !== undefined) {
        if (updatedData[item._id].strategy_id !== undefined) {
          updatedData[item._id].strategy_id = item.strategy_id;
        }
      }
    });
  }

  const UpdateDashboard = async (e) => {
    if (isUpdating) {
      return;
    }
    setIsUpdating(true);

    if (statusStartegyUser === "1" || statusStartegyUser === 1) {
      const isEmpty = Object.keys(updatedData).length === 0;

      if (isEmpty === false) {
        const result = Object.keys(updatedData)
          .filter(
            (key) =>
              Array.isArray(updatedData[key].strategy_id) &&
              updatedData[key].strategy_id.length === 0
          )
          .reduce((obj, key) => {
            obj[key] = updatedData[key];
            return obj;
          }, {});

        const inputId = Object.keys(result)[0];
        const matchingObject = GetServiceStrategy.find(
          (obj) => obj._id === inputId
        );

        const serviceName = matchingObject ? matchingObject.service_name : null;
        const isEmptyStartegyArray = Object.keys(result).length === 0;
        if (isEmptyStartegyArray === false) {
          alert("Please Select one Strategy a script " + serviceName);
          return;
        }
      }
    }

    if (Object.keys(updatedData).length === 0) {
      toast.error(`Can't update empty quantity`);
      setIsUpdating(false);
      return;
    }

    // Iterate over updatedData
    for (const key in updatedData) {
      if (updatedData.hasOwnProperty(key)) {
        const item = updatedData[key];

        if (item.lot_size === 0 || item.lot_size === "0") {
          toast.error(`Can't update 0 Quantity`);
          setIsUpdating(false);
          return;
        }
      }
    }

    handleCloseStartegyModal();
    await dispatch(
      Update_Dashboard_Data({
        data: {
          servicesData: updatedData,
          statusStartegyUser: statusStartegyUser,
          GetServiceStrategy: GetServiceStrategy,
          user_id: user_details.user_id,
          data: { Editor_role: Role, device: check_Device() },
          network_ip: ip,
        },
        AdminToken: user_details.token,
      })
    )
      .unwrap()
      .then((response) => {
        setIsUpdating(false);
        if (response.status) {
          toast.success(response.msg);
          getservice();
          window.location.reload();
        } else {
          toast.error(response.msg);
          window.location.reload();
        }
      });
  };


  const newsData = [
    "Algorithmic trading carries inherent risks, including market volatility and fluctuations.Trading in financial markets can result in the loss of capital   Ensure that you fully understand the risks associated with trading before engaging   You are solely responsible for all decisions and outcomes resulting from the use of this software.",
  ];
  return (

    <>


    <Content Page_title="Dashboard" button_status={false}>
      <div
        className="table-responsive "
        style={{
          height: "55vh",
          overflowY: "auto",
        }}
      >
    
       {BrokerId && BrokerId == "4" && <h6 className="fw-bold text-danger mb-3">
          <strong>Note:</strong> Product Type selection is mandatory for CNC in
          Motilal Oswal.
        </h6>}


        <NewsTicker/>

        <table className="table dashboard-table ">
          <thead className="bg-primary">
            <tr>
              <th>#</th>
              <th>Symbol</th>
              <th>lot size</th>
              <th width="100px  ">max Qty</th>
              <th>No.Of Lot</th>
              <th>Quantity</th>
              <th>Strategy</th>
              <th>Order Type</th>
              <th>Product Type</th>
              <th>Trading </th>
            </tr>
          </thead>

          {DashboardData.loading ? (
            <Loader />
          ) : (
            <tbody>
              {DashboardData.data &&
                DashboardData.data.map((data, index) => {
                  return (
                    <>
                      <tr>
                        <th>{index + 1}</th>
                        <td>{`${data.service.name}[${data.categories.segment}]`}</td>
                        <td>{data.service.lotsize}</td>
                        <td>{data.servicegroup_services_ids.group_qty}</td>
                        <td>
                          <div className="row d-flex">
                            <div className="col-lg-12">
                              <input
                                key={index}
                                type="number"
                                name="lot_size"
                                className="form-control"
                                id="lot_size"
                                placeholder="Enter Qty"
                                min={1}
                                disabled={gotodashboard}
                                onChange={(e) => {
                                  setgroup_qty_value_test(
                                    e,
                                    data.service.name,
                                    data.service,
                                    data
                                  );
                                }}
                                defaultValue={data.lot_size}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          {inputValue[data.service.name]
                            ? parseInt(inputValue[data.service.name]) *
                              parseInt(data.service.lotsize)
                            : parseInt(data.lot_size) *
                              parseInt(data.service.lotsize)}
                        </td>

                        <td className="color-primary col-md-2">
                          {data.userInfo.multiple_strategy_select === "1" ? (
                            // "Multiple Startegy Select"

                            <Button
                              variant="primary"
                              onClick={() => handleShowStartegyModal(data)}
                              disabled={gotodashboard}

                            >
                              Selected Strategy
                            </Button>
                          ) : (
                            //  "Single Strategy Select"
                            <select
                              name="strategy_id"
                              className="form-select form-select-lg "
                              aria-label=".form-select-lg example"
                              disabled={gotodashboard}

                              onChange={(e) =>
                                setgroup_qty_value_test(
                                  e,
                                  data.service.name,
                                  data.service,
                                  data
                                )
                              }
                            >
                              <option
                                value={
                                  Strategy.data &&
                                  Strategy.data.map((item) => {
                                    if (
                                      data.strategy_id.includes(item.result._id)
                                    ) {
                                      return item.result._id;
                                    }
                                  })
                                }
                                className="text-success h6"
                                selected
                                disabled
                              >
                                {Strategy.data &&
                                  Strategy.data.map((item) => {
                                    if (
                                      data.strategy_id.includes(item.result._id)
                                    ) {
                                      return item.result.strategy_name;
                                    }
                                  })}
                              </option>
                              {Strategy.data &&
                                Strategy.data.map((item) => {
                                  if (
                                    data.strategy_id.includes(item.result._id)
                                  ) {
                                  } else {
                                    return (
                                      <option
                                        className="text-danger h6"
                                        value={item.result._id}
                                      >
                                        {item.result.strategy_name}
                                      </option>
                                    );
                                  }
                                })}
                            </select>
                          )}
                        </td>

                        <td className="color-primary">
                          <select
                            name="order_type"
                            disabled={gotodashboard}

                            className="form-select form-select-lg "
                            aria-label=".form-select-lg example"
                            onChange={(e) =>
                              setgroup_qty_value_test(
                                e,
                                data.service.name,
                                data.service,
                                data
                              )
                            }
                            defaultValue={data.order_type}
                          >
                            <option value="1">MARKET</option>
                            <option value="2">LIMIT</option>
                            <option value="3">STOPLOSS LIMIT</option>
                            <option value="4">STOPLOSS MARKET</option>
                          </select>
                        </td>
                        <td className="color-primary">
                          <select
                                disabled={gotodashboard}

                            name="product_type"
                            className="form-select form-select-lg "
                            aria-label=".form-select-lg example"
                            onChange={(e) =>
                              setgroup_qty_value_test(
                                e,
                                data.service.name,
                                data.service,
                                data
                              )
                            }
                            defaultValue={data.product_type}
                          >
                            <option value="2">MIS</option>
                            <option value="1">CNC</option>
                            <option value="3">BO</option>
                            <option value="4">CO</option>
                          </select>
                        </td>
                        <td className="color-primary">
                          <label className="toggle">
                            <input
                              className="toggle-checkbox bg-primary"
                              type="checkbox"
                              disabled={gotodashboard}

                              name="active_status"
                              defaultChecked={data.active_status === "1"}
                              onChange={(e) =>
                                setgroup_qty_value_test(
                                  e,
                                  data.service.name,
                                  data.service,
                                  data
                                )
                              }
                            />

                            <div
                              className={`toggle-switch ${
                                data.active_status === "1"
                                  ? "bg-primary"
                                  : "bg-secondary"
                              }`}
                            ></div>
                          </label>
                        </td>
                      </tr>
                    </>
                  );
                })}

              <ToastButton />
            </tbody>
          )}
        </table>
      </div>

      <Modal show={showStartegyModal} onHide={handleCloseStartegyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Strategy1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {modalsingleValue.strategy_id !== undefined
              ? Strategy.data &&
                Strategy.data.map((item) => (
                  <div key={item.result._id}>
                    <input
                      name="strategy_id"
                      className="form-check-input"
                      type="checkbox"
                      id={item.result._id}
                      value={item.result._id}
                      defaultChecked={modalsingleValue.strategy_id.includes(
                        item.result._id
                      )}
                      onChange={(e) =>
                        setgroup_qty_value_test(
                          e,
                          modalsingleValue.service.name,
                          modalsingleValue.service,
                          modalsingleValue
                        )
                      }
                    />
                    <label
                      className={`form-check-label ${
                        modalsingleValue.strategy_id.includes(item.result._id)
                          ? "text-success"
                          : "text-danger"
                      } h6`}
                      htmlFor={item.result._id}
                    >
                      {item.result.strategy_name}
                    </label>
                  </div>
                ))
              : ""}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStartegyModal}>
            Canccel
          </Button>
          <Button variant="secondary" onClick={(e) => UpdateDashboard(e)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {gotodashboard ? (
        ""
      ) : (
        <>
          <button
            type="button"
            className="btn btn-outline-primary btn-lg mt-4"
            onClick={(e) => UpdateDashboard(e)}
            disabled={isUpdating}
            
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </>
      )}
    </Content>
    </>
  );
};

export default BrokerResponse;
