import React, { useState, useEffect, useRef } from "react";
import FullDataTable from "../../../Components/ExtraComponents/Tables/DataTable";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Content from "../../../Components/Dashboard/Content/Content";
import Swal from "sweetalert2";
import {
  GetBrokerLiveDatas,
  GetDataAboveBelowRange,
  DeleteDataMakeCall,
  UpdateDataMakeCall,
} from "../../../ReduxStore/Slice/Common/Makecall/make";

const MakeCallPendingPosition = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentTypeABRRef = useRef("below");

  const [typeABROnclickFunc, setTypeABROnclickFunc] = useState("below");

  const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const token = JSON.parse(localStorage.getItem("user_details")).token;
  const UserLocalDetails = JSON.parse(localStorage.getItem("user_details"));

  const [selected, setSelected] = useState([]);
  const [selected1, setSelected1] = useState([]);
  const [livePriceDataDetails, setLivePriceDataDetails] = useState("");
  const [userIdSocketRun, setUserIdSocketRun] = useState("none");
  const [aboveBelowRangData, setAboveBelowRangData] = useState({
    loading: true,
    data: [],
  });
  const [iscolumntPrice, setiscolumntPrice] = useState(false);
  const [iscolumntPriceRange, setiscolumntPriceRange] = useState(true);
  const [selectedM, setSelectedM] = useState([]);
  const [selected1M, setSelected1M] = useState([]);
  const [refreshscreen, setRefreshscreen] = useState(false);
  const [updatedDataPriceTS, setUpdatedDataPriceTS] = useState({});

  const containerStyle = {
    width: "100px",
    height: "30px",
  };

  const containerStyle1 = {
    width: "100px",
    height: "35px",
  };

  const tabs = [
    { key: "below", icon: "fa-solid fa-landmark", title: "Below" },
    { key: "above", icon: "fa-solid fa-envelope", title: "Above" },
    { key: "range", icon: "fa-regular fa-image", title: "Range" },
  ];

  useEffect(() => {
    handleClick_abr(typeABROnclickFunc);
  }, []);

  useEffect(() => {
    GetBrokerLiveData(userIdSocketRun);
  }, [userIdSocketRun]);

  const GetBrokerLiveData = async (userIdSocketRun) => {
    await dispatch(
      GetBrokerLiveDatas({
        req: {
          id: user_id,
          exist_user: userIdSocketRun,
          exist_user_details: livePriceDataDetails,
        },

        token: token,
      })
    )
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setLivePriceDataDetails(response.data);
        }
      });
  };

  const inputChangeTargetStoplos = (e, type, row) => {
    let name = e.target.name;
    let value = e.target.value;
    let id = row._id;

    if (type == "ExitTime" || type == "NoTradeTime") {
      value = e.target.value.replace(":", "");
    }

    setUpdatedDataPriceTS((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [name]: value,
      },
    }));
  };

  let columnsM = [
    {
      dataField: "1",
      text: "S No",
      formatter: (cell, row, rowIndex) => rowIndex + 1,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row, rowIndex) => (
        <select
          style={{
            width: "105px",
            height: "33px",
            color: row.status == 0 ? "green" : "red",
          }}
          className="form-select"
          name="status"
          onChange={(e) => {
            inputChangeTargetStoplos(e, "status", row);
          }}
        >
          <option
            value="0"
            style={{ color: "green" }}
            selected={row.status == 0}
          >
            OPEN
          </option>
          <option value="2" style={{ color: "red" }} selected={row.status == 2}>
            CLOSE
          </option>
        </select>
      ),
    },
    {
      dataField: "Symbol",
      text: "Script",
      formatter: (cell, row, rowIndex) => (
        <div>
          {row.Segment == "O" || row.Segment == "MO" || row.Segment == "CO" ? (
            <span>
              {row.Symbol +
                " " +
                row.Strike +
                " " +
                row.OType +
                " " +
                row.Expiry}
            </span>
          ) : row.Segment == "F" ||
            row.Segment == "MF" ||
            row.Segment == "CF" ? (
            <span>{row.Symbol + " FUT " + row.Expiry}</span>
          ) : (
            <span>{row.Symbol}</span>
          )}
        </div>
      ),
    },

    {
      dataField: "Strategy",
      text: "Strategy Tag",
    },

    {
      dataField: "ExitTime",
      text: "Exit Time",
      formatter: (cell, row, rowIndex) => (
        <div className="col-12">
          <input
            type="time"
            name="ExitTime"
            defaultValue={
              row.ExitTime.substring(0, 2) + ":" + row.ExitTime.substring(2)
            }
            onChange={(e) => {
              inputChangeTargetStoplos(e, "ExitTime", row);
            }}
          />
        </div>
      ),
    },

    {
      dataField: "NoTradeTime",
      text: "No Trade Time",
      formatter: (cell, row, rowIndex) => (
        <div className="col-12">
          <input
            type="time"
            name="NoTradeTime"
            defaultValue={
              row.NoTradeTime.substring(0, 2) +
              ":" +
              row.NoTradeTime.substring(2)
            }
            onChange={(e) => {
              inputChangeTargetStoplos(e, "NoTradeTime", row);
            }}
          />
        </div>
      ),
    },

    {
      dataField: "Price",
      text: "Price",
      formatter: (cell, row, rowIndex) => (
        <div>
          <input
            style={containerStyle}
            className="hidebg"
            name="Price"
            type="number"
            onChange={(e) => {
              inputChangeTargetStoplos(e, "price", row);
            }}
            defaultValue={row.Price}
          />
        </div>
      ),
      hidden: iscolumntPrice,
    },
    {
      dataField: "EntryPriceRange_one",
      text: "Price First",
      formatter: (cell, row, rowIndex) => (
        <div>
          <input
            style={containerStyle}
            className="hidebg"
            name="EntryPriceRange_one"
            type="number"
            onChange={(e) => {
              inputChangeTargetStoplos(e, "rangePriceOne", row);
            }}
            defaultValue={row.EntryPriceRange_one}
          />
        </div>
      ),
      hidden: iscolumntPriceRange,
    },
    {
      dataField: "EntryPriceRange_two",
      text: "Price Second",
      formatter: (cell, row, rowIndex) => (
        <div>
          <input
            style={containerStyle}
            //className="hidebg"
            name="EntryPriceRange_two"
            type="number"
            onChange={(e) => {
              inputChangeTargetStoplos(e, "rangePriceTwo", row);
            }}
            defaultValue={row.EntryPriceRange_two}
          />
        </div>
      ),
      hidden: iscolumntPriceRange,
    },
    {
      dataField: "TType",
      text: "T Type",
      formatter: (cell, row, rowIndex) => (
        <div>{row.TType == "LE" ? <span>BUY</span> : <span>SELL</span>}</div>
      ),
    },
    {
      dataField: "WiseTypeDropdown",
      text: "Wise Type",
      formatter: (cell, row, rowIndex) => (
        <select
          style={containerStyle1}
          className="form-select"
          name="WiseTypeDropdown"
          onChange={(e) => {
            inputChangeTargetStoplos(e, "WiseTypeDropdown", row);
          }}
        >
          <option value="" selected={row.WiseTypeDropdown == ""}>
            Not Set
          </option>
          <option value="1" selected={row.WiseTypeDropdown == "1"}>
            %
          </option>
          <option value="2" selected={row.WiseTypeDropdown == "2"}>
            Points
          </option>
        </select>
      ),
    },

    {
      dataField: "Target",
      text: "Target",
      formatter: (cell, row, rowIndex) => (
        <div>
          <input
            style={containerStyle}
            className="hidebg"
            name="Target"
            type="number"
            onChange={(e) => {
              inputChangeTargetStoplos(e, "target", row);
            }}
            defaultValue={row.Target}
          />
        </div>
      ),
    },

    {
      dataField: "StopLoss",
      text: "StopLoss",
      formatter: (cell, row, rowIndex) => (
        <div>
          <input
            style={containerStyle}
            className="hidebg"
            name="StopLoss"
            type="number"
            onChange={(e) => {
              inputChangeTargetStoplos(e, "stoploss", row);
            }}
            defaultValue={row.StopLoss}
          />
        </div>
      ),
    },
  ];

  if (iscolumntPrice == true) {
    columnsM = columnsM.filter((column) => column.dataField !== "Price");
  }

  const handleOnSelectM = (row, isSelect) => {
    if (isSelect) {
      setSelectedM([...selectedM, row._id]);
      setSelected1M([...selected1M, row]);
    } else {
      setSelectedM(selectedM.filter((x) => x !== row._id));
      setSelected1M(selected1M.filter((x) => x._id !== row._id));
    }
  };

  const handleOnSelectAllM = (isSelect, rows) => {
    const ids = rows.map((r) => r._id);

    if (isSelect) {
      setSelectedM(ids);
      setSelected1M(rows);
    } else {
      setSelectedM([]);
      setSelected1M([]);
    }
  };

  const selectRowM = {
    mode: "checkbox",
    clickToSelect: true,
    nonSelectableStyle: { backgroundColor: "aliceblue" },
    onSelect: handleOnSelectM,
    onSelectAll: handleOnSelectAllM,
  };

  const delete_data = async (ABR) => {
    if (selected1M.length <= 0) {
      Swal.fire({
        text: "please select any signal",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }
    let text = "Are you sure you want delete signal ?";
    if (window.confirm(text) == true) {
      //  alert("DONE")
      await dispatch(
        DeleteDataMakeCall({
          req: {
            user_id: UserLocalDetails.user_id,
            row: selected1M,
          },

          token: UserLocalDetails.token,
        })
      )
        .unwrap()
        .then((response) => {
          setSelected([]);
          setSelected1([]);
          setUpdatedDataPriceTS({});
          if (response.status) {
            Swal.fire({
              title: "Delete Successful!",
              text: response.msg,
              icon: "success",
              timer: 1500,
              timerProgressBar: true,
            });

            setRefreshscreen(!refreshscreen);

            handleClick_abr(ABR);
          } else {
            Swal.fire({
              title: "Error",
              text: response.msg,
              icon: "error",
              timer: 1500,
              timerProgressBar: true,
            });
            setRefreshscreen(!refreshscreen);
            handleClick_abr(ABR);
          }
        });
    }
  };

  const update_data = async (ABR) => {
    if (Object.keys(updatedDataPriceTS).length === 0) {
      Swal.fire({
        text: "please Input Any Field",
        icon: "warning",
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }

    await dispatch(
      UpdateDataMakeCall({
        req: {
          user_id: UserLocalDetails.user_id,
          row: updatedDataPriceTS,
        },

        token: UserLocalDetails.token,
      })
    )
      .unwrap()
      .then((response) => {
        setSelected([]);
        setSelected1([]);
        setUpdatedDataPriceTS({});

        if (response.status) {
          Swal.fire({
            title: "Update Successful!",
            text: response.msg,
            icon: "success",
            timer: 1500,
            timerProgressBar: true,
          });
          setRefreshscreen(!refreshscreen);
          handleClick_abr(ABR);
          // window.location.reload();
        } else {
          Swal.fire({
            title: "Error",
            text: response.msg,
            icon: "error",
            timer: 1500,
            timerProgressBar: true,
          });
          setRefreshscreen(!refreshscreen);
          handleClick_abr(ABR);
        }
      });
  };

  const handleClick_abr = (ABR) => {
    setSelected([]);
    setSelected1([]);
    setUpdatedDataPriceTS({});
    if (ABR == "range") {
      setiscolumntPrice(true);
      setiscolumntPriceRange(false);
    } else {
      setiscolumntPrice(false);
      setiscolumntPriceRange(true);
    }
    currentTypeABRRef.current = ABR;
    setTypeABROnclickFunc(ABR);
    GetDataAboveBelowRangeFun(ABR);
  };

  const GetDataAboveBelowRangeFun = async (ABR) => {
    await dispatch(
      GetDataAboveBelowRange({
        req: {
          user_id: UserLocalDetails.user_id,
          ABR: ABR,
        },

        token: UserLocalDetails.token,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAboveBelowRangData({
            loading: false,
            data: response.data,
          });
        } else {
          setAboveBelowRangData({
            loading: false,
            data: [],
          });
        }
      });
  };

  return (
    <>
      <Content
        Page_title="Make Call Pending Position"
        button_title="Add SubAdmin"
        button_status={false}
      >
       <div className="row">
  <div className="col-lg-12 col-md-12">
    <ul
      className="nav nav-tabs nav-tabs-solid d-flex justify-content-center"
      style={{
        borderBottom: "2px solid #ddd",
        marginBottom: "20px",
      }}
    >
      {tabs &&
        tabs.map((TabData) => (
          <li
            className="nav-item"
            key={TabData.key}
            style={{
              margin: "0 10px",
            }}
          >
            <a
              className={`nav-link ${
                currentTypeABRRef.current === TabData.key ? "active" : ""
              }`}
              data-bs-toggle="tab"
              href={`#solid-tab${TabData.key}`}
              onClick={() => handleClick_abr(TabData.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 15px",
                borderRadius: "5px",
                textDecoration: "none",
                color: currentTypeABRRef.current === TabData.key ? "#fff" : "#555",
                backgroundColor:
                  currentTypeABRRef.current === TabData.key
                    ? "#007bff"
                    : "#f8f9fa",
                transition: "background-color 0.3s",
                width: "150px",
              }}
            >
              <i
                className={TabData.icon}
                style={{
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              ></i>
              {TabData.title}
            </a>
          </li>
        ))}
    </ul>
  </div>
</div>


        <div className="row mt-3">
          <div className="tab-content">
            {tabs &&
              tabs.map((TabData) => (
                <div
                  key={TabData.key}
                  className={`tab-pane ${
                    currentTypeABRRef.current === TabData.key
                      ? "show active"
                      : ""
                  }`}
                  id={`solid-tab${TabData.key}`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                 
                    <div className="preview-boxs">
                      <h5 className="card-title mb-0 w-auto">
                        {/* <i className={`${TabData.icon} pe-2`}></i> */}
                        {/* {TabData.title} */}
                      </h5>
                    </div>

                    <div className="d-flex">
                      <div className="preview-boxs ms-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => update_data(TabData.key)}
                        >
                          Update
                        </button>
                      </div>
                      <div className="preview-boxs ms-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => delete_data(TabData.key)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table Content */}
                  <div className="card-body table-responsive">
                    <div className="invoice-total-box border">
                      <div className="invoice-total-inner">
                        <div className="inventory-table">
                          <FullDataTable
                            keyField="_id"
                            TableColumns={columnsM}
                            tableData={aboveBelowRangData.data}
                            pagination1={true}
                            selectRow={selectRowM}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Content>
    </>
  );
};

export default MakeCallPendingPosition;
