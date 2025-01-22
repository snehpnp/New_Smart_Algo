/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useState } from "react";
import Content from "../../../Components/Dashboard/Content/Content";
import { useDispatch } from "react-redux";
import { All_Api_Info_List_superadmin } from "../../../ReduxStore/Slice/Superadmin/ApiCreateInfoSlice";
import Modal from "../../../Components/ExtraComponents/Modal";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import * as Config from "../../../Utils/Config";
import Loader from "../../../Utils/Loader"; // Assuming you have a Loader component
import {
  getAllPanelDataApi,
  getNameAndBrokerIdDataApi,
} from "../../../Service/superadmin.service";

const ApiCreateInfo = () => {
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("user_details")).token;

  const [showModal, setshowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [brokerId, setBrokerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPanelBrokerCount, setTotalPanelBrokerCount] = useState("");
  const [brokerData, setBrokerData] = useState([]);

  const [UserDetails, setUserDetails] = useState({
    loading: true,
    data: [],
  });

  // Fetch API information list
  const data = async () => {
    const res = await getNameAndBrokerIdDataApi({
      token: token,
      url: Config.react_domain,
    });
    if (res.status) {
      setUserDetails({
        loading: false,
        data: res.data,
      });
    }

  };

  useEffect(() => {
    data();
  }, []);

  // getAllPanelDataApi(data)

  // Show data and fetch data for specific broker
  const ShowData = async (id) => {
    setshowModal(true);
    setLoading(true);
    setBrokerId(id);

    const res = await getAllPanelDataApi({ broker_id: id });

    const data = res.data; // Store response in a local variable
    setBrokerData(data); // Update the state
    setTotalPanelBrokerCount(res.TotalLength);

    setLoading(false);
  };

  return (
    <>
      <Content Page_title="Broker Panel">
        <div className="row">
          <section className="row">
            {UserDetails.data &&
              UserDetails.data.map((item) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
                  <div
                    className="card shadow-sm border-0"
                    style={{ backgroundColor: "#4885ED", color: "white" }}
                  >
                    <div className="card-body d-flex flex-column align-items-center text-center">
                      <h5
                        className="card-title mb-3 text-truncate"
                        style={{ maxWidth: "150px", color: "white" }}
                      >
                        {item.title}
                      </h5>
                      <Link
                        to="#"
                        onClick={() => ShowData(item.broker_id)}
                        className="btn btn-outline-light btn-sm"
                      >
                        <Eye color="white" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </section>
        </div>

        <Modal
          isOpen={showModal}
          size="lg"
          title={`Broker Panel Info`}
          hideBtn={true}
          handleClose={() => setshowModal(false)}
          style={{
            background: "linear-gradient(to bottom, #e0f7fa, #80deea)",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          {loading ? (
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              style={{
                minHeight: "300px",
                textAlign: "center",
                color: "#0277bd",
              }}
            >
              <Loader />
              <h3>Loading Broker Data...</h3>
              <p style={{ marginTop: "10px", fontStyle: "italic" }}>
                Please wait while we fetch the latest data. It might take a few
                moments!
              </p>
              <div
                style={{
                  fontSize: "18px",
                  marginTop: "20px",
                  animation: "blink 1.5s infinite",
                }}
              >
                Fetching amazing insights! 🚀
              </div>

              <style>
                {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
              </style>
            </div>
          ) : (
            <>
              <h4 style={{ color: "#0288d1" }}>
                Total Panels: {brokerData?.length}
              </h4>
              <h5 style={{ color: "#01579b" }}>
                Overall Broker count: {totalPanelBrokerCount}
              </h5>

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #0288d1",
                  borderRadius: "8px",
                  backgroundColor: "#e1f5fe",
                  padding: "10px",
                  marginTop: "20px",
                }}
              >
                <table
                  className="table table-bordered"
                  style={{ color: "#0277bd", backgroundColor: "#e0f7fa" }}
                >
                  <thead>
                    <tr
                      style={{ backgroundColor: "#0288d1", color: "#ffffff" }}
                    >
                      <th>Panel Name</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brokerData.map((panel, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f7fbfc" : "#d6eef7",
                        }}
                      >
                        <td>{panel.panel_name}</td>
                        <td>{panel.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal>
      </Content>
    </>
  );
};

export default ApiCreateInfo;
