import React, { useState, useEffect } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import BasicDataTable from "../../../Components/ExtraComponents/Datatable/BasicDataTable";
import { Pencil, Trash2 } from "lucide-react";
import { Get_Strategy_Description } from "../../../ReduxStore/Slice/Users/StrategySlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../Components/ExtraComponents/Modal";

const StrategyDesc = () => {
  const dispatch = useDispatch();

  const [StrategyData, setStrategyData] = useState({ loading: true, data: [] });
  const [showModal, setshowModal] = useState(false);
  const [ModalData, setModalData] = useState("");

  const user_Id = JSON.parse(localStorage.getItem("user_details")).user_id;
  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

  const gotodashboard = JSON.parse(localStorage.getItem("gotodashboard"));
  const GoToDahboard_id = JSON.parse(localStorage.getItem("user_details_goTo"));

  const getsignals11 = async (e) => {
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
  };

  useEffect(() => {
    getsignals11();
  }, []);

  console.log("ModalData", ModalData);

  return (
    <Content Page_title="Strategy Description" button_status={false}>
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

        {showModal ? (
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
                    <span> Email : info@trustalgo.net</span>
                    <span> Mobile : +918424978748</span>
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
        )}
      </div>
    </Content>
  );
};

export default StrategyDesc;
