import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Content from "../../../Components/Dashboard/Content/Content";
import { Get_All_Theme } from "../../../ReduxStore/Slice/ThemeSlice";
import Swal from "sweetalert2";
import {
  UPDATE_PNL_POSITION,
  GET_PNL_POSITION,
  UPDATE_PRICE_PERMISSION,
} from "../../../ReduxStore/Slice/Admin/AdminHelpSlice";
import { Modal, Button, Table } from "react-bootstrap";
import { fDate, fDateTime } from "../../../Utils/Date_formet";
import { GET_COMPANY_INFOS } from "../../../ReduxStore/Slice/Admin/AdminSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState([]);
  const token = localStorage.getItem("token");
  const [pricePermission, setPricePermission] = useState("0");
  const [showModal, setShowModal] = useState(false);
  const [showLogsData, setShowLogsData] = useState([]);

  // State to manage permissions
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      name: "Trade History Profit/Loss Position",
      type: "select",
      options: ["Top", "Bottom"],
      selected: "Top",
    },
    //{ id: 2, name: "View All Themes", type: "theme", selected: "Yes" },
    {
      id: 3,
      name: "Trade Permission",
      type: "select1",
      options: ["MT 4", "Live Price"],
      selected: "MT 4",
    },
  ]);

  useEffect(() => {
    GetAllThems();
    GetPnlPosition();
    CompanyName();
  }, []);

  const CompanyName = async () => {
    await dispatch(GET_COMPANY_INFOS())
      .unwrap()
      .then((response) => {
        if (response.status) {
          setShowLogsData(response.Permission_Logs_data);
          setPricePermission(response.data[0].price_permission);
        }
      });
  };

  const GetAllThems = async () => {

    const res = await dispatch(Get_All_Theme()).unwrap();

    if (res?.data) {
      setTheme(res.data);
    }
  };

  const GetPnlPosition = async () => {
    const res = await dispatch(GET_PNL_POSITION({ token: token })).unwrap();
    if (res?.data) {
      const pnlPosition = res.data[0].pnl_position;
      const newPermissions = permissions.map((p) => {
        if (p.id === 1) {
          return { ...p, selected: pnlPosition };
        }
        return p;
      });
      setPermissions(newPermissions);
    }
  };

  const ChangeTheme = async (themeItem) => {
    // Contact To Support Team For Theme Change Functionality
    Swal.fire({
      title: "Contact To Support Team For Theme Change Functionality",
      icon: "warning",
    });
    return;

    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You want to change the theme?",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, change it!",
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     localStorage.setItem("theme", JSON.stringify(themeItem));
    //     window.location.reload();
    //   }
    // });
  };

  const UPDATE_PNL_POSITION_API = async (data, e, perm) => {
    try {
      const res = await dispatch(
        UPDATE_PNL_POSITION({ pnlposition: data, token: token })
      ).unwrap();

      if (res.status) {
        const newPermissions = permissions.map((p) => {
          if (p.id === perm.id) {
            return { ...p, selected: e.target.checked ? "Top" : "Bottom" };
          }
          return p;
        });
        setPermissions(newPermissions);

        Swal.fire({
          title: "Panel Updated",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Internal Server Error",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating PNL position:", error);
      Swal.fire({
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    let requestData = {
      status: e.target.value,
    };

    dispatch(UPDATE_PRICE_PERMISSION(requestData))
      .unwrap()
      .then((response) => {
        if (response.status) {
          Swal.fire({
            title: "Price Permission Updated",
            icon: "success",
          });

          setPricePermission(e.target.value);
        } else {
          Swal.fire({
            title: response.msg,
            icon: "error",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "Update Failed",
          text: "Something went wrong. Please try again.",
          icon: "error",
        });
      });
  };

  return (
    <Content Page_title={"Settings"} button_status={false}>
      <div style={{ padding: "16px" }}>
        <h3 style={{ marginBottom: "24px" }}>Permissions</h3>
        {permissions.map((perm) => (
          <div
            key={perm.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ marginBottom: "8px" }}>
              {perm.name}{" "}
              {perm.name == "Trade Permission" && (
                <i
                  className="bi bi-info-circle"
                  style={{ marginLeft: "5px" }}
                  onClick={(e) => setShowModal(true)}
                ></i>
              )}
            </h4>

            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                {perm.type === "select" && (
                  <div className="row mb-2 d-flex align-items-center justify-content-center">
                    <div className="col-12 d-flex justify-content-between">
                      {/* Radio Button - Top */}
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="topOption"
                          name="priceOption"
                          value="Top"
                          checked={perm.selected === "Top"}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            UPDATE_PNL_POSITION_API(newValue, e, perm);
                          }}
                        />
                        <label className="form-check-label" htmlFor="topOption">
                          Top
                        </label>
                      </div>

                      {/* Radio Button - Bottom */}
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="bottomOption"
                          name="priceOption"
                          value="Bottom"
                          checked={perm.selected === "Bottom"}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            UPDATE_PNL_POSITION_API(newValue, e, perm);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="bottomOption"
                        >
                          Bottom
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {perm.type === "theme" && (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
                  >
                    {theme.map((themeItem, index) => (
                      <div
                        key={index}
                        style={{
                          flex: "1 1 calc(25% - 1rem)", // 4 cards per row
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#fff",
                        }}
                      >
                        <img
                          src={themeItem.image} // Use the image URL from your theme array
                          alt={themeItem.name} // Use the name as alt text
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ padding: "1rem" }}>
                          <h3
                            style={{
                              margin: "0 0 0.5rem 0",
                              fontSize: "1.25rem",
                            }}
                          >
                            {themeItem.theme_name}
                          </h3>

                          <button
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            onClick={
                              () => ChangeTheme(themeItem) // Pass the theme object to the function
                            }
                          >
                            Select Theme
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {perm.type === "select1" && (
                  <div className="row mb-2 d-flex align-items-center justify-content-center">
                    <div className="col-12 d-flex justify-content-between">
                      {/* Radio Buttons */}
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="mt4Option1"
                          name="priceOption1"
                          value="0"
                          checked={pricePermission == "0"}
                          onChange={(e) => handleSubmit1(e)}
                        />
                        <label className="form-check-label" htmlFor="mt4Option">
                          MT 4
                        </label>
                      </div>

                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="livePriceOption1"
                          name="priceOption1"
                          value="1"
                          checked={pricePermission == "1"}
                          onChange={(e) => handleSubmit1(e)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="livePriceOption"
                        >
                          Live Price
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Price Permission Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showLogsData && showLogsData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th style={{ color: "black" }}>ID</th>
                    <th style={{ color: "black" }}>Status</th>
                    <th style={{ color: "black" }}>Message</th>
                    <th style={{ color: "black" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {showLogsData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1 || "N/A"}</td>
                      <td>{data.status === 1 ? "MT-4" : "Live Price"}</td>
                      <td>{data.msg || "No Message"}</td>
                      <td>{fDateTime(data.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No logs available.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Content>
  );
};

export default SettingsPage;
