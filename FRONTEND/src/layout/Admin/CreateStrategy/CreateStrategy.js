import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select'
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import FullDataTable from "../../../Components/ExtraComponents/Datatable/FullDataTable";
import Loader from "../../../Utils/Loader";
import { fa_time, fDateTimeSuffix } from "../../../Utils/Date_formet";
import { Pencil, Trash2 } from "lucide-react";
import { Get_All_Signals } from "../../../ReduxStore/Slice/Admin/SignalsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Get_All_Strategy } from "../../../ReduxStore/Slice/Admin/StrategySlice";
import { get_time_frame } from "../../../ReduxStore/Slice/Common/make_strategy_slice";



const Signals = () => {

  const user_Id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;
  ///console.log("AdminToken",AdminToken)
  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));


  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [storeServiceData, setStoreServiceData] = useState([])
  const [filterServices, setFilterServices] = useState("")

  //console.log("filterServices - ",filterServices)
  const [selectedItems, setSelectedItems] = useState([]);
  //console.log("selectedItems",selectedItems)

  const [getIndicators, setGetIndicators] = useState([])
  const [getSources, setGetSources] = useState([])
  console.log("getSources", getSources);
  const [selectAddIndicators, setSelectAddIndicators] = useState([])
  const [indicatorModalRowData, setIndicatorModalRowData] = useState([])

  const [showEnterPrice, setShowEnterPrice] = useState(false);
  const handleCloseEnterPrice = () => setShowEnterPrice(false);
  const handleShowEnterPrice = () => {
    getSourcesApi()
    setShowEnterPrice(true)
  }
  const jumbotronStyles = {
    border: '5px outset #b463ff',
    backgroundColor: 'white',
    textAlign: 'center',
    height: '250px'
  }

  const handleClose = () => setShow(false);

  const [priceAction, setPriceAction] = useState("above");
  const [inputValue, setInputValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const handlePriceActionChange = (event) => {
    setPriceAction(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleMinValueChange = (event) => {
    setMinValue(event.target.value);
  };

  const handleMaxValueChange = (event) => {
    setMaxValue(event.target.value);
  };


  useEffect(() => {
    if (filterServices) {
      handleShow();
    }
    getIndicatorApi()
  }, [filterServices]);




  const handleShow = () => {
    setShow(true);

    const config = {
      method: 'post',
      url: 'http://localhost:7700/add/getservicename',
      data: {
        searchQuery: filterServices
      }
    };

    axios(config)
      .then(function (response) {
        // console.log("get service name",response.data);
        setStoreServiceData(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddItem = (item) => {
    const isItemAlreadySelected = selectedItems.some(
      (selectedItem) => selectedItem.tradesymbol === item.tradesymbol
    );
    if (!isItemAlreadySelected) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedItems = selectedItems.filter((item) => item !== itemToRemove);
    setSelectedItems(updatedItems);
  };

  const getIndicatorApi = () => {

    const config = {
      method: 'get',
      url: 'http://localhost:7700/get_indicators',
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setGetIndicators(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getSourcesApi = () => {

    const config = {
      method: 'get',
      url: 'http://localhost:7700/get_sources',
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setGetSources(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const indicatorAddItem = (item) => {
    const isItemAlreadySelected = selectAddIndicators.some(
      (selectedItem) => selectedItem.name === item.name
    );
    if (!isItemAlreadySelected) {
      setSelectAddIndicators([...selectAddIndicators, item]);
    }
  };

  const indicatorRemoveItem = (itemToRemove) => {
    const updatedItems = selectAddIndicators.filter((item) => item !== itemToRemove);
    setSelectAddIndicators(updatedItems);
  };

  const getSourcesss = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const conditionText = "((close(2) < MA(2)) && (close(1) > MA(11))";


  useEffect(() => {
    getAllSteategyApi();
    getAllTimeFrameApi();
  }, []);

  //const [strategyDataAllAdmin, setStrategyDataAllAdmin] = useState([]);
  const [strategyDataAllAdmin, setStrategyDataAllAdmin] = useState({ loading: true, data: [] });
  const [selectStrategy, setSelectStrategy] = useState("");

  // get data time frame 
  const [timeFrameData, setTimeFrameData] = useState({ loading: true, data: [] });




  // console.log("timeFrameData",timeFrameData)
  // console.log("selectStrategy",selectStrategy)


  const getAllTimeFrameApi = async () => {
    await dispatch(
      get_time_frame({
        req: {
          page: "1",
          limit: "100",
        },
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        //console.log("response get_time_frame - ",response)
        if (response.status) {
          if (response.status) {
            setTimeFrameData({
              loading: false,
              data: response.data,
            });
          } else {
            setTimeFrameData({
              loading: false,
              data: response.data,
            });
          }
        }
      });
  };

  const getAllSteategyApi = async () => {
    await dispatch(
      Get_All_Strategy({
        req: {
          page: "1",
          limit: "100",
        },
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        //console.log("response strategy - ",response)
        if (response.status) {
          if (response.status) {
            setStrategyDataAllAdmin({
              loading: false,
              data: response.data,
            });
          } else {
            setStrategyDataAllAdmin({
              loading: false,
              data: response.data,
            });
          }
        }
      });
  };


  const [timeFrameVal, setTimeFrameVal] = useState("1");

  const [buyCheck, setBuyCheck] = useState(false);

  const [sellCheck, setSellCheck] = useState(false);


  const selectTimeFrame = (item) => {
    console.log("dd -", item.value)
    setTimeFrameVal(item.value);
  }



  console.log("timeFrameVal - ", timeFrameVal)

  console.log("buyCheck - ", buyCheck)

  const saveStrategy = () => {
    if (selectStrategy == "") {
      alert("Please select a strategy");
      return;
    }


   // Send Request Buy ------
   if(buyCheck){
    let data = {
      "scriptArray": selectedItems,
      "user_id": "6512c8f2eb5673dd61bb931a",
      // "tokensymbol": "3045",
      // "symbol_name": "SBIN",
      // "segment": "C",
      "strategy_name": selectStrategy,
      // "strike_price":"19300",
      // "option_type":"CE",
      //  "expiry":"26102023",
      "timeframe": timeFrameVal,
      "type": "BUY",
      "indicator": "MA",
      "price_source": "open",
      "period": "1",
      "inside_indicator": "EMA",
      "condition": "(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]>data.high[2]",
      "condition_source": "['close(0)','low(1)',low(2),close(1),high(2)]",
      "buffer_value": "2",
      "offset": "0"
    }
   } 


  

   // Send Request Sell ------
   if(sellCheck){
    let data = {
      "scriptArray": selectedItems,
      "user_id": "6512c8f2eb5673dd61bb931a",
      // "tokensymbol": "3045",
      // "symbol_name": "SBIN",
      // "segment": "C",
      "strategy_name": selectStrategy,
      // "strike_price":"19300",
      // "option_type":"CE",
      //  "expiry":"26102023",
      "timeframe": timeFrameVal,
      "type": "SELL",
      "indicator": "MA",
      "price_source": "open",
      "period": "1",
      "inside_indicator": "EMA",
      "condition": "(data.close[0]>=data.low[1]||data.high[0]<data.low[2])&&data.close[1]>data.high[2]",
      "condition_source": "['close(0)','low(1)',low(2),close(1),high(2)]",
      "buffer_value": "2",
      "offset": "0"
    }
   }



  }



  return (
    <>
      <>
        <Content Page_title="All Services" button_status={false}>
          <div>

            <div className="col-md-2 ">
              <label className=" ps-5" style={{ fontWeight: 'bold', color: 'black', fontSize: '20px' }}>Strategy</label>
              <select className="form-select stratergy-box" onChange={(e) => setSelectStrategy(e.target.value)} name="strategyname">
                <option value="">-- Select Strategy --</option>
                {strategyDataAllAdmin.data && strategyDataAllAdmin.data.map((sm, i) =>
                  <option value={sm.strategy_name}>{sm.strategy_name}</option>)}
              </select>
            </div>




            <Modal show={show} onHide={handleClose} className="right">
              <Modal.Header>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Stocks eg, SBIN"
                  value={filterServices}
                  onChange={(e) => setFilterServices(e.target.value)}
                />
                {/* <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleClose}
                >
                  Done
                </Button> */}
              </Modal.Header>
              <Modal.Body>
                <ul className="ps-0">
                  {storeServiceData && Array.isArray(storeServiceData) ? (
                    storeServiceData.map((x) => (
                      <li className="my-2" key={x.id}>
                        <div className="row">
                          <div className="col-md-2">
                            <img
                              className="w-100 p-2"
                              src="https://upload.wikimedia.org/wikipedia/en/6/60/ACFTU_logo.png"
                              alt="Logo"
                            />
                          </div>
                          <div className="col-md-7 ps-0">
                            <h3 className="mb-0">{x.tradesymbol}</h3>
                            <p className="text-muted my-0">{x.exch_seg}</p>
                          </div>
                          <div className="col-md-3 d-flex list-btn">
                            {/* <button
                              className="btn border-0"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Add Dynamic Contract"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button> */}
                            <button className="btn border-0">
                              <i
                                className="fa-regular fa-square-plus"
                                onClick={() => handleAddItem(x)}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>No data available</li>
                  )}
                </ul>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
            <ul class="StepProgress">
              <li class="StepProgress-item is-done">


                <strong>Instruments</strong>
                <div className="row">
                  <div className="col-md-2">
                    <button
                      className="btn btn-strategy"
                      variant="primary"
                      onClick={handleShow}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <h5 className="mb-0">Add</h5>
                      <p className="mb-0">Stocks eg, SBIN</p>
                    </button>
                  </div>

                  {selectedItems && selectedItems.map((x) => (
                    <div className="col-md-2">
                      <div className="card card-strategy">
                        <div className="card-body">
                          <h4>
                            <span>
                              <img src="https://seeklogo.com/images/I/indraprastha-gas-logo-8CD9114819-seeklogo.com.png"></img>
                            </span>
                            {x.tradesymbol}
                          </h4>
                          <p className="text-muted my-0">{x.exch_seg}</p>
                          <div className="d-flex justify-content-between my-1">
                            <i className="fa-solid fa-pen-to-square"></i>
                            <i className="fa-solid fa-trash-can"
                              onClick={() => handleRemoveItem(x)}
                            ></i>
                          </div>
                          <h3 className="text-success my-0 ">45.5</h3>
                          <p className="text-success my-0">%45.5</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </li>
              <li class="StepProgress-item is-done">
                <div className="row">



                  {/* <div className="col-md-3">
                    <div class="columns">
                      <label>Position I would take</label>
                      <div class="column is-12">
                        <div class="up-in-toggle">
                          <input
                            type="radio"
                            id="switch_left"
                            name="switch_2"
                            value="yes"
                          />
                          <label for="switch_left">Buy</label>
                          <input
                            type="radio"
                            id="switch_right"
                            name="switch_2"
                            value="no"
                            checked
                          />
                          <label for="switch_right">Sell</label>
                        </div>
                      </div>
                    </div>
                  </div> */}



                  <div className="col-xl-6">
                    <div className="card">
                      <div className="">
                        <label>Candle Interval</label>
                      </div>
                      <div className="card-body px-0 pt-0">
                        <ul className="nav nav-pills justify-content-between mb-4">

                          {
                            timeFrameData.data && timeFrameData.data.map((item, index) => (
                              <li className=" nav-item">
                                <a
                                  href="#navpills2-1"
                                  className={`nav-link ${timeFrameVal === item.value ? "active" : ""}`}
                                  data-bs-toggle="tab"
                                  aria-expanded="false"
                                  onClick={() => selectTimeFrame(item)}
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))
                          }



                          {/* <li className=" nav-item">
                            <a
                              href="#navpills2-1"
                              className="nav-link"
                              data-bs-toggle="tab"
                              aria-expanded="false"
                            >
                             3 min
                            </a>
                          </li> */}

                        </ul>
                        {/* <div className="tab-content">
                          <div id="navpills2-1" className="tab-pane">
                            <div className="row">
                              <div className="col-md-12">

                                Raw denim you probably haven't heard of them jean shorts Austin.
                                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                                Mustache cliche tempor, williamsburg carles vegan helvetica.
                                <p>
                                  <br /> Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                                  Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div id="navpills2-2" className="tab-pane">
                            <div className="row">
                              <div className="col-md-12">

                                Raw denim you probably haven't heard of them jean shorts Austin.
                                Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                                <p>
                                  <br /> Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                                  Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div id="navpills2-3" className="tab-pane active">
                            <div className="row">
                              <div className="col-md-12">


                                <p>
                                  <br /> Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                                  Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Quantity ( in lots )</label>
                      <input type="number" className="form-control"></input>
                    </div>
                  </div> */}

                </div>
              </li>


              <li class="StepProgress-item current is-done">

                <div className="form-check form-check-inline">
                  <input className="form-check-input" onChange={(e) => setBuyCheck(e.target.checked)} type="checkbox" id="inlineCheckbox1" value="option1" />
                  <label className="form-check-label" for="inlineCheckbox1">Buy</label>
                </div>


                <strong>Buy Entry Condition</strong>

                {/* <Form.Select aria-label="Default select example">
                  <option>Select</option>
                  <option value="price">Price</option>
                  <option value="time">Time</option>
                  <option value="indicator">Indicator</option>
                </Form.Select>

              </li>

              <li class="StepProgress-item current is-done">

                <div className="form-check form-check-inline">
                  <input className="form-check-input" onChange={(e) => setSellCheck(e.target.checked)} type="checkbox" id="inlineCheckbox2" value="option1" />
                  <label className="form-check-label" for="inlineCheckbox2">Sell</label>
                </div>

                <strong>Sell Entry Condition</strong>

                <Form.Select aria-label="Default select example">
                  <option>Select</option>
                  <option value="price">Price</option>
                  <option value="time">Time</option>
                  <option value="indicator">Indicator</option>
                </Form.Select>

              </li>



              <li class="StepProgress-item">
                <strong>Exit Condition</strong>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-danger">Stop loss %</label>
                      <input type="text" className="form-control"></input>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="text-success">Target Profit %</label>
                      <input type="text" className="form-control"></input>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="">Trailing SL % (optional)</label>
                      <input type="text" className="form-control"></input>
                    </div>
                  </div>
                </div>
              </li>
            </ul>


            {/* {getIndicators.map((x) => (
              <div key={x.id}>
                <input type="checkbox" onClick={() => indicatorAddItem(x)} name="simple_moving_average" />
                <label>{x.name}</label><br />
              </div>
            ))}

            {selectAddIndicators && selectAddIndicators.map((x) => (
              <div className="d-flex border-box" >
                <p>{x.value}</p>
                <p>0</p>
                <p>open</p>
                <p>EMA</p>
                <p>0</p>
                <p><i onClick={() => { handleShowEnterPrice(); setIndicatorModalRowData(x) }} className="fa-solid fa-gear"></i></p>
                <p><i onClick={() => indicatorRemoveItem(x)} className="fa-solid fa-xmark"></i></p>
              </div>
            ))} */}

            <>
              <Modal show={showEnterPrice} onHide={handleCloseEnterPrice}>
                <Modal.Header closeButton>
                  <Modal.Title>Inputs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <label>Length</label><br />
                    <input type="number" min={0} defaultValue={0} /><br />

                    <label>Source</label><br />
                    <select name="sources">
                      {getSources && getSources.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <br />

                    <label>Offset</label><br />
                    <input type="number" min={0} defaultValue={0} /><br />

                    <br /><label>SMOOTHING</label><br />

                    <label>Method</label><br />
                    {
                      indicatorModalRowData && Array.isArray(indicatorModalRowData.data) && (
                        <select name="method">
                          {indicatorModalRowData.data.map((item, index) => (
                            <option key={index} value={item[Object.keys(item)[0]]}>
                              {indicatorModalRowData.data[index][Object.keys(item)[0]]}
                            </option>
                          ))}
                        </select>
                      )
                    }
                    <br />

                    <label>EMA Length</label><br />
                    <input type="number" min={0} defaultValue={0} /><br />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEnterPrice}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleCloseEnterPrice}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </>


          </div>

          <div className="col-md-4">
            <button className='btn btn-info float-end m-0' onClick={saveStrategy}>save</button>
          </div>



        </Content>
      </>
    </>
  );
};

export default Signals;



{/* <button value="math_function" className="btn btn-info btn-sm">Math Function</button>
<button value="indicators" className="btn btn-info btn-sm">Indicators</button>
<button value="bracket" className="btn btn-info btn-sm">Bracket</button>
  <select name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </select> */}