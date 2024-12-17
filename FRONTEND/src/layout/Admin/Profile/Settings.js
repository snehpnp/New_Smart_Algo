import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Content from "../../../Components/Dashboard/Content/Content";
import { Get_All_Theme } from "../../../ReduxStore/Slice/ThemeSlice";
import Swal from "sweetalert2";
import {
  UPDATE_PNL_POSITION,
  GET_PNL_POSITION,
} from "../../../ReduxStore/Slice/Admin/AdminHelpSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState([]);
  const token = localStorage.getItem("token");

  // State to manage permissions
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      name: "Trade History Profit/Loss Position",
      type: "select",
      options: ["Top", "Bottom"],
      selected: "Top",
    },
    { id: 2, name: "View All Themes", type: "theme", selected: "Yes" },
  ]);

  useEffect(() => {
    GetAllThems();
    GetPnlPosition();
  }, []);

  const GetAllThems = async () => {
    console.log("Fetching themes...");

    console.log("Fetching from API");
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
    //     console.log("Theme selected:", themeItem);
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
            <h4 style={{ marginBottom: "8px" }}>{perm.name}</h4>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                {perm.type === "select" && (
                  <div
                    className="form-check form-switch"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      checked={perm.selected === "Top"}
                      onChange={(e) => {
                        const newValue = e.target.checked ? "Top" : "Bottom";
                        UPDATE_PNL_POSITION_API(newValue, e, perm);
                      }}
                      style={{
                        width: "3rem",
                        height: "1.5rem",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        backgroundColor: "#ddd",
                        transition:
                          "background-color 0.3s ease, transform 0.3s ease",
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexSwitchCheckDefault"
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#333",
                        userSelect: "none",
                        cursor: "pointer",
                      }}
                    >
                      {perm.selected}
                    </label>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </Content>
  );
};

export default SettingsPage;
