/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { Pencil, Trash2 } from "lucide-react";
import { Get_Strategy_Description } from "../../../ReduxStore/Slice/Users/StrategySlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../Components/ExtraComponents/Modal";
import { Get_Pmermission } from "../../../ReduxStore/Slice/Users/DashboardSlice";
import { Get_All_Strategy, } from "../../../ReduxStore/Slice/Admin/StrategySlice";
import * as Config from "../../../Utils/Config";


const StrategyDesc = () => {
  const dispatch = useDispatch();

  const [StrategyData, setStrategyData] = useState({ loading: true, data: [] });
  const [StrategyData1, setStrategyData1] = useState({ loading: true, data: [] });
  const [Strategy_permission, setStrategy_permission] = useState([]);
  const [Strategy_By_Price, setStrategy_By_Price] = useState("");
  const [showModal, setshowModal] = useState(false);
  const [ModalData, setModalData] = useState("");

  const user_Id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));



  const Strategy_permissions = async (e) => {
    await dispatch(
      Get_Pmermission({
        "domain": Config.react_domain,
        token: AdminToken,
      })
    )
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStrategy_permission({
            loading: false,
            data: response.data,
          });
        } else {
          setStrategy_permission({
            loading: false,
            data: response.data,
          });
        }
      });
  };

  useEffect(() => {

    Strategy_permissions();
  }, []);



  const getsignals11 = async (e) => {
    if (Strategy_permission.data && Strategy_permission.data[0].Strategy_plan === 1) {
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
          if (response.status) {
            if (response.status) {
              setStrategyData1({
                loading: false,
                data: response.data,
              });
            } else {
              setStrategyData1({
                loading: false,
                data: response.data,
              });
            }
          }
        });

    } else {
      await dispatch(
        Get_Strategy_Description({
          _id: gotodashboard ? GoToDahboard_id.user_id : user_Id,
          token: AdminToken,
        })
      )
        .unwrap()
        .then((response) => {
          if (response.status) {
            setStrategyData({
              loading: false,
              data: response.data,
            });
          } else {
            setStrategyData({
              loading: false,
              data: response.data,
            });
          }
        });
    }
  };


  useEffect(() => {
    getsignals11();
  }, [Strategy_permission.data]);




  console.log("Strategy_By_Price[index] || Strategy_By_Price", Strategy_By_Price)
  return (
    <Content Page_title="Strategy Description" button_status={false}>

      {Strategy_permission.data && Strategy_permission.data[0].Strategy_plan === 1 ? <>
        <div className="row custom-dashboard-new1 mt-2 mb-2">
          {StrategyData1.data &&
            StrategyData1.data.map((item, index) => {
              return (
                <>
                  <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6 mt-2 mb-2">
                    <div className="card-final">
                      <div className="card_head_new">
                        <img src="https://test.smartalgo.in/images/smartalgologo16523435536611695017624260.png" alt="logo" className="logo" />
                        {item.strategy_image ? <>
                          <img src={item.strategy_image} alt="algocrab" className="shoes" />
                        </> : ""}
                        <span className="shoes_caption">
                          <h4>{item.strategy_name}</h4>
                        </span>
                        <span className="more_info mt-3">
                          <a
                            data-description=""
                            onClick={(e) => {
                              setshowModal(true);
                              setModalData(Strategy_permission.data && Strategy_permission.data[0].Strategy_plan === 1 ? item : item.result);
                            }}
                          >
                            <i className="fa-solid fa-plus" /> More Info
                          </a>
                        </span>
                        <span className="back_text">Pro</span>
                      </div>
                      <div className="card_body_main_new">
                        <div className="shoes_desc">
                          <input
                            type="hidden"
                            className="strategyID"
                            defaultValue="1a6c53e21d"
                          />
                          <input type="hidden" className="planID" defaultValue={1} />
                          <span className="shoes_info">{item.strategy_name}</span>
                          <span className="badge">Intraday/Positional</span>
                          <span className="shoes_rating">
                            <i className="" />
                            <i className="" />
                            <i className="" />
                            <i className="" />
                            <i className=" gray" />
                          </span>
                          <span className="shoes_price">
                            <span>
                              <span>PRICE : </span>
                              <i className="fa-solid fa-indian-rupee-sign price tag" />
                              <span className="rs txt-custom-strategy-price">{Strategy_By_Price[index] ? Strategy_By_Price[index] : "select Plan"}</span>
                            </span>
                          </span>
                          <span className="shoes_size">
                            <span>
                              <span>PLANS : </span>
                            </span>
                            <select
                              name="select"
                              className="ddl-custom-stratey-plans form-select select"
                              onChange={(e) =>
                                setStrategy_By_Price((prevPrices) => ({ ...prevPrices, [index]: e.target.value }))
                              }
                            >
                              {item.plans !== undefined && item.plans.length > 0 && JSON.parse(item.plans[0]).map((x, optionIndex) => (
                                <option data-planid={2} value={x.price} key={`${item.strategy_name}-${x.type}-${optionIndex}`}>
                                  {x.type}
                                </option>
                              ))}
                            </select>
                          </span>
                          <span className="shoes_buy">
                            <button className="mb-2" type="submit">
                              <i className="fas fa-bolt" /> WATCH VIDEO
                            </button>
                            <button type="submit" onclick="StrategyPurchase(this)">
                              <i className="fas fa-cart-plus" /> BUY NOW
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div >
                </>
              );
            })}
        </div>

      </> : <>
        <div class="row mb-5">
          {StrategyData.data &&
            StrategyData.data.map((item) => {
              return (
                <>
                  <div
                    class="col-12 col-sm-6 col-md-4"
                    style={{ height: "250px" }}
                  >
                    <div class="card card-purple-blue text-white mb-3 mb-md-0">
                      <div class="d-flex justify-content-between ">
                        <div>
                          <p class="new-un">{item.result.strategy_category}</p>
                        </div>
                        <div>
                          <p class="new-de">{item.result.strategy_segment}</p>
                        </div>
                      </div>
                      <h4 class="card-new-heading">
                        {item.result.strategy_name}
                      </h4>
                      <div class="card-number text-center">
                        <div class="h3">Recommended</div>
                        <small>
                          <strong>
                            Capital : {item.result.strategy_amount} PER LOT
                          </strong>
                        </small>
                      </div>
                      <div class="card-body d-flex justify-content-between  align-items-end p-2">
                        <div class="card-description text-right">
                          <small
                            class="new-sma mx-2"
                            onClick={(e) => {
                              setshowModal(true);
                              setModalData(item.result);
                            }}
                          >
                            Info
                          </small>
                        </div>
                        <div class="card-description text-right ml-3">
                          <small class="new-sma">Join</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}

        </div>
      </>
      }

      {
        showModal ? (
          <>
            <Modal
              isOpen={showModal}
              size="lg"
              title="Strategy Information"
              hideBtn={true}
              // onHide={handleClose}
              handleClose={() => setshowModal(false)}
            >
              <div class="content ml-5 mr-5 ">
                <h5 class=" text-center">{ModalData.strategy_name}</h5>

                <li>{ModalData.strategy_description}</li>
                <div class="text-center">
                  <h5 class=" mb-0">SETTINGS OF INDICATOR</h5>
                  <span>
                    <img
                      src={ModalData.strategy_indicator}
                      alt="INDICATOR"
                      class="w-100 my-3 border border-dark"
                    />
                  </span>
                </div>
                <div class="text-center">
                  <h5 class=" ">NIFTY STRATEGY TESTER</h5>
                  <span>
                    <img
                      src={ModalData.strategy_tester}
                      class="w-100 my-3 border border-dark"
                      alt="STRATEGY TESTER"
                    />
                  </span>
                </div>
                <br />
                <div>
                  <span style={{ fontSize: "13.5pt", whiteSpace: "pre-wrap" }}>
                    This strategy works best in trending type of market
                    conditions.
                  </span>
                  <div>
                    <span>Support :</span>
                    {/* <span> Email : info@trustalgo.net</span>
                  <span> Mobile : +918424978748</span> */}
                  </div>
                  <span style={{ fontSize: "13.5pt", color: "red" }}>
                    <b>Note</b>
                  </span>
                  <ul className="fw-bold">
                    <li>
                      Do not subscribe to the strategy without watching the
                      performance sheets and charts. Since this strategy works
                      on trend there will be multiple entries in 1 trading
                      session.
                    </li>
                    <li>
                      We recommend 1 or 2 trades per day in order to gain
                      capital with calculative risk.
                    </li>
                    <li>
                      Increase lots size and re-entries according to your risk
                      appetite , we are not responsible for your in-calculative
                      losses.
                    </li>
                  </ul>
                </div>
              </div>
            </Modal>
          </>
        ) : (
          ""
        )
      }




    </Content >
  );
};

export default StrategyDesc;
