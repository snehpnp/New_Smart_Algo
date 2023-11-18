/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
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

const BrokerResponse = () => {
  const dispatch = useDispatch();
  const [enterqty, setEnterQty] = useState("");

  const [inputValue, setInputValue] = useState('1');


  const [DashboardData, setDashboardData] = useState({
    loading: true,
    data: [],
  });
  const [Strategy, setStrategy] = useState({ loading: true, data: [] });

  const [refresh, setrefresh] = useState(false);

  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;
  const user_Id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));

  // console.log("GoToDahboard_id", GoToDahboard_id);

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
          const filteredArray1 = response.strategy.filter((item1) =>
            response.services.some(
              (item2) => item1.result._id !== item2.strategys._id
            )
          );
          setStrategy({
            loading: false,
            data: filteredArray1,
          });
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
          e.target.value = 1
          return
        }
      } else {
        // toast.error("no negetive or empty value allow ");

        // alert("no negetive or empty value allow ")
        e.target.value = 1
        return
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
        ...(name === "lot_size" && { "quantity": parseInt(e.target.value) * parseInt(data.service.lotsize) }),
        ...(name !== "lot_size" && { "quantity": data.service.lotsize, "lot_size": "1" }),
      },
    }));

    return
    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: name === "active_status" ? e.target.checked : value,
      },
    }));
  };

  const UpdateDashboard = async (e) => {




    await dispatch(
      Update_Dashboard_Data({
        data: {
          servicesData: updatedData,
          user_id: user_Id,
          data: { Editor_role: Role, device: check_Device() },
        },
        AdminToken: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        // console.log("response", response);
        if (response.status) {
          toast.success(response.msg);
          // setrefresh(!refresh)
          window.location.reload();
        } else {
          toast.error("No Data For Update");
        }
      });
  };










  return (
    <Content Page_title="Dashboard" button_status={false}>
      <table className="table table-responsive-sm ">
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
            <th>Profuct Type</th>
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
                    {/* {console.log("data.service.lotsize", data.service.lotsize)}
                    {console.log("data.lot_size", data.lot_size)} */}
                    <td>{inputValue[data.service.name] ? parseInt(inputValue[data.service.name]) * parseInt(data.service.lotsize) :
                      parseInt(data.lot_size) * parseInt(data.service.lotsize)}</td>

                    <td className="color-primary col-md-2">
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
                          value="1"
                          className="text-success h6"
                          selected
                          disabled
                        >
                          {data.strategys.strategy_name}
                        </option>
                        {Strategy.data &&
                          Strategy.data.map((item) => {
                            return (
                              <option
                                className="text-danger h6"
                                value={item.result._id}
                              >
                                {item.result.strategy_name}
                              </option>
                            );
                          })}
                      </select>
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
      {gotodashboard ? (
        ""
      ) : (
        <>
          <button
            type="button"
            class="btn btn-outline-primary"
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
