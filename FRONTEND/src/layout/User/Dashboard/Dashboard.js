/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Content from "../../../Components/Dashboard/Content/Content";
import { MultiSelect } from 'primereact/multiselect';
import BasicTable from "../../../Components/ExtraComponents/Tables/BasicTable";
import { Pencil, Trash2 } from "lucide-react";
import { No_Negetive_Input_regex } from "../../../Utils/Common_regex";
import {
  GetAliceTokenAndID,
  CreateSocketSession,
  ConnctSocket,
  GetAccessToken
} from "../../../Service/Alice_Socket";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import toast, { Toaster } from "react-hot-toast";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { check_Device } from "../../../Utils/find_device";

import {
  User_Dashboard_Data,
  Update_Dashboard_Data,
} from "../../../ReduxStore/Slice/Users/DashboardSlice";
import { useLocation } from "react-router-dom";

const BrokerResponse = () => {
  const dispatch = useDispatch();
  const location = useLocation()




  // SET MODAL IN STARTEGY
  const [showStartegyModal, setShowStartegyModal] = useState(false);


  const [modalsingleValue, setModalsingleValue] = useState({});

  const handleCloseStartegyModal = () => {
    setShowStartegyModal(false);
    setModalsingleValue({})
  }

  const handleShowStartegyModal = (data) => {

    setModalsingleValue(data)
    setShowStartegyModal(true);
  }
  //







  const [enterqty, setEnterQty] = useState("");

  const [inputValue, setInputValue] = useState('1');


  const [DashboardData, setDashboardData] = useState({
    loading: true,
    data: [],
  });

  const [Strategy, setStrategy] = useState({ loading: true, data: [] });

  const [GetServiceStrategy, setGetServiceStrategy] = useState([]);

  const [statusStartegyUser, setStatusStartegy] = useState("0");


  const [refresh, setrefresh] = useState(false);

  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;
  const user_Id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));



  const [updatedData, setUpdatedData] = useState({});

  const Role = JSON.parse(localStorage.getItem("user_role"));

  const getservice = async () => {
    await dispatch(
      User_Dashboard_Data({
        user_Id: gotodashboard ? GoToDahboard_id.user_id : user_Id,
        AdminToken: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {

        if (response.status) {
          setDashboardData({
            loading: false,
            data: response.services,
          });
          // const filteredArray1 = response.strategy.filter((item1) =>
          //   response.services.some(
          //     (item2) => item1.result._id !== item2.strategys._id
          //   )
          // );
          // setStrategy({
          //   loading: false,
          //   data: filteredArray1,
          // });
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
  }, [refresh]);




  const setgroup_qty_value_test = (e, symboll, rowdata, data) => {




    const numericValue = e.target.value.replace(/[^0-9]/g, '');

    if (e.target.name === "lot_size") {

      if (numericValue) {
        setInputValue((prevPrices) => ({ ...prevPrices, [symboll]: e.target.value }))
        if ((data.servicegroup_services_ids.group_qty !== 0) && ((parseInt(e.target.value) * parseInt(data.service.lotsize)) > parseInt(data.servicegroup_services_ids.group_qty))) {
          toast.error(`cant update more then ${data.servicegroup_services_ids.group_qty} In ${symboll}`);
          e.target.value = ''
          return
        }
      } else {
        // toast.error("no negetive or empty value allow ");

        // alert("no negetive or empty value allow ")
        e.target.value = ''
        return
      }
    }

    else if (e.target.name === "strategy_id") {


      // Find the object with the matching _id
      const targetObject = GetServiceStrategy.find(item => item._id == data.service._id);

      if (targetObject.strategy_id.includes(e.target.value)) {

        const updatedStrategyId = targetObject.strategy_id.filter(id => id !== e.target.value);
        // Create a new object with the updated strategy_id
        const updatedObject = { ...targetObject, strategy_id: updatedStrategyId };
        // Update the state
        setGetServiceStrategy((oldArray) => oldArray.map(item => (item._id === targetObject._id ? updatedObject : item)));

      } else {

        if (DashboardData.data[0].userInfo.multiple_strategy_select == 0) {
          const updatedObject = { ...targetObject, strategy_id: [e.target.value] };
          setGetServiceStrategy((oldArray) => oldArray.map(item => (item._id === targetObject._id ? updatedObject : item)));
        } else {

          const updatedObject = { ...targetObject, strategy_id: [...targetObject.strategy_id, e.target.value] };
          setGetServiceStrategy((oldArray) => oldArray.map(item => (item._id === targetObject._id ? updatedObject : item)));
        }


      }



    }

    let name = e.target.name;
    let value = e.target.value;
    let id = rowdata._id;


    // alert(name)
    // alert(value)

    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: name === "active_status" ? e.target.checked : value,
        ...(name === "lot_size" && { "quantity": parseInt(e.target.value) * parseInt(data.service.lotsize) }),
        ...(name !== "lot_size" && { "quantity": data.service.lotsize, "lot_size": "1" }),
      },
    }));





  };


  if (updatedData) {
    GetServiceStrategy.forEach((item) => {

      if (updatedData[item._id] != undefined) {

        if (updatedData[item._id].strategy_id != undefined) {
          updatedData[item._id].strategy_id = item.strategy_id;
        }
      }


    });



  }







  const UpdateDashboard = async (e) => {



    if (statusStartegyUser == "1") {
      const isEmpty = Object.keys(updatedData).length === 0;

      if (isEmpty == false) {
        // Filter objects with empty strategy_id
        const result = Object.keys(updatedData)
          .filter((key) => Array.isArray(updatedData[key].strategy_id) && updatedData[key].strategy_id.length === 0)
          .reduce((obj, key) => {
            obj[key] = updatedData[key];
            return obj;
          }, {});



        // Extracting the key (id) from the inputObject
        const inputId = Object.keys(result)[0];
        // Finding the matching object in dataArray based on _id
        const matchingObject = GetServiceStrategy.find(obj => obj._id === inputId);
        // Getting the service_name if a match is found
        const serviceName = matchingObject ? matchingObject.service_name : null;


        const isEmptyStartegyArray = Object.keys(result).length === 0;

        if (isEmptyStartegyArray == false) {
          alert("Please Select one Strategy a script " + serviceName)
          return
        }

      }
    }



    handleCloseStartegyModal()




    await dispatch(
      Update_Dashboard_Data({
        data: {
          servicesData: updatedData,
          statusStartegyUser: statusStartegyUser,
          GetServiceStrategy: GetServiceStrategy,
          user_id: user_Id,
          data: { Editor_role: Role, device: check_Device() },
        },
        AdminToken: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {

        if (response.status) {
          toast.success(response.msg);
          // setrefresh(!refresh)
          window.location.reload();
        } else {
          toast.error(response.msg);
        }
      });
  };








  return (
    <Content Page_title="Dashboard" button_status={false}>
     <div className="table-responsive">
      <table className="table dashboard-table">
        <thead className="bg-primary">
          <tr>
            <th>#</th>
            {/* <th>Live Price</th> */}
            <th>Symbol</th>
            <th>lot size</th>
            <th>max Qty</th>
            <th>LotSize</th>
            <th>Quantity</th>
            <th>Strategy</th>
            <th>Order Type</th>
            <th>Product Type</th>
            <th>Trading </th>
          </tr>
        </thead>
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
                            // max={setMax(data)}
                            // defaultValue={data.service.lotsize}

                            onChange={
                              (e) => {
                                setgroup_qty_value_test(
                                  e,
                                  data.service.name,
                                  data.service,
                                  data
                                )
                              }
                            }
                            defaultValue={data.lot_size}
                          // defaultValue={enterqty ? enterqty : data.quantity}
                          // disabled={data.users.qty_type == "1" || data.users.qty_type == 1}
                          />
                        </div>

                      </div>
                    </td>

                    <td>{inputValue[data.service.name] ? parseInt(inputValue[data.service.name]) * parseInt(data.service.lotsize) :
                      parseInt(data.lot_size) * parseInt(data.service.lotsize)}</td>

                    <td className="color-primary col-md-2">
                      {data.userInfo.multiple_strategy_select === "1" ?
                        // "Multiple Startegy Select"



                        <Button variant="primary" onClick={() => handleShowStartegyModal(data)}>
                          Selected Strategy
                        </Button>

                        :

                        //  "Single Strategy Select"
                        <select
                          name="strategy_id"

                          class="form-select form-select-lg "
                          aria-label=".form-select-lg example"
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
                            value={Strategy.data && Strategy.data.map((item) => { if (data.strategy_id.includes(item.result._id)) { return item.result._id } })}


                            className="text-success h6"
                            selected
                            disabled
                          >
                            {Strategy.data && Strategy.data.map((item) => { if (data.strategy_id.includes(item.result._id)) { return item.result.strategy_name } })}
                          </option>
                          {Strategy.data &&
                            Strategy.data.map((item) => {

                              if (data.strategy_id.includes(item.result._id)) {
                                // return (
                                //   <option
                                //     className="text-success h6"
                                //     value={item.result._id}
                                //   >
                                //     {item.result.strategy_name}
                                //   </option>
                                // );
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
                      }




                    </td>

                    <td className="color-primary">
                      <select
                        name="order_type"
                        class="form-select form-select-lg "
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
                        name="product_type"
                        class="form-select form-select-lg "
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
                      <label class="toggle">
                        <input
                          class="toggle-checkbox bg-primary"
                          type="checkbox"
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
                        {/* //  ${ShowAllStratagy ? 'bg-primary' : "bg-secondary" } */}
                        <div
                          class={`toggle-switch ${data.active_status === "1"
                            ? "bg-primary"
                            : "bg-secondary"
                            }

`}
                        ></div>
                      </label>
                    </td>
                  </tr>
                </>
              );
            })}
          <ToastButton />
        </tbody>
      </table>
      </div>



      <Modal show={showStartegyModal} onHide={handleCloseStartegyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Strategy</Modal.Title>
        </Modal.Header>
        <Modal.Body>



          <div>
            {
              modalsingleValue.strategy_id != undefined ?
                Strategy.data &&
                Strategy.data.map((item) => (
                  <div key={item.result._id}>
                    <input
                      name="strategy_id"
                      className="form-check-input"
                      type="checkbox"
                      id={item.result._id}
                      value={item.result._id}
                      defaultChecked={modalsingleValue.strategy_id.includes(item.result._id)}
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
                      className={`form-check-label ${modalsingleValue.strategy_id.includes(item.result._id)
                        ? "text-success"
                        : "text-danger"
                        } h6`}
                      htmlFor={item.result._id}
                    >
                      {item.result.strategy_name}
                    </label>

                  </div>
                ))
                : ""
            }
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
            class="btn btn-outline-primary btn-lg mt-4"
            onClick={(e) => UpdateDashboard(e)}
          >
            Update
          </button>
        </>
      )}

    </Content>




  );
};

export default BrokerResponse;
