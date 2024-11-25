import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import Content from "../../../../Components/Dashboard/Content/Content"

import * as Config from "../../../../Utils/Config";


function Kotakneo() {
  const [kotakStatus, setKotakStatus] = useState(false);
  const [kotakStatus1, setKotakStatus1] = useState(false);
  const [formValues, setFormValues] = useState({
    userId: "",
    password: "",
    otp: "",
  });
  const [activeTab, setActiveTab] = useState("mobile");

  const [formValuesErr, setFormValuesErr] = useState({
    userId: "",
    password: "",
    otp: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  const [UserDetails, setUserDetails] = useState([]);








  const handleTabChange = (tab) => {
    if (tab === "mobile") {
  
      setUsername("");
      setPassword("");
      setErrors({ username: "", password: "" });
    } else {
      Swal.fire({
        title: "Coming Soon!",
        text: "This feature is under development.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const handleBackClick = () => {
    setUsername("");
    setPassword("");
    setErrors({ username: "", password: "" });
    setKotakStatus(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.match(/^[0-9]{0,1}$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input if backspace is pressed
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleNextClick = () => {
    let newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios({
        url: `${Config.base_url}kotakGetToken`,
        method: "post",
        data: {
          Email: UserDetails.Email,
          username: username,
          password: password,
        },
      }).then((res) => {
        if (res.data.status) {
          setKotakStatus1(true);
        } else{
          console.log(res.data.msg);
          toast.error(res.data.msg);
        }
      });
    }
  };

  const handleSubmit = () => {
    if (otp.join("").length < 4) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid OTP.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    axios({
      url: `${Config.base_url}kotakGetSession`,
      method: "post",
      data: {
        Email: UserDetails.Email,
        otp: otp.join(""),
      },
    }).then((res) => {
      if (res.data.status == true) {
        toast.success(res.data.msg);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else if (res.data.status == false) {
        toast.error(res.data.msg);
      }
    });
  };

  const handleBack = () => {
    setUsername("");
    setPassword("");
    setErrors({ username: "", password: "" });
    setKotakStatus(false);
    setKotakStatus1(false);
    setOtp(["", "", "", ""]);
  };


 return (
    <>
    <Content Page_title="Signals" button_status={false}>
      <div className="row">
        <div className="col-12 col-md-8 mx-auto">
          <div className="row">
            <div className="col-md-6">
              <div>
                <img
                  src="./assets/images/kotakneo.png"
                  alt="Kotak Neo"
                  style={{ width: "66px" }}
                />

                <h1
                  style={{
                    color: "#1b3e81",
                    fontSize: "2rem",
                    marginBottom: "20px",
                  }}
                >
                  Welcome to the new <br /> age of investing
                </h1>
                <ul
                  style={{
                    listStyle: "none",
                    color: "#1b3e81",
                    marginBottom: "30px",
                  }}
                >
                  <li style={{ marginBottom: "10px" }}>
                    Great product experience
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    Amazing customer support
                  </li>
                  <li style={{ marginBottom: "10px" }}>Years of trust</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "white",
                  padding: "50px",
                  borderRadius: "10px",
                  boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {kotakStatus1 ? (
                  // OTP Section
                  <div>
                    <h2 style={{ marginBottom: "20px", color: "#333" }}>
                      Enter OTP
                    </h2>
                    <p style={{ marginBottom: "30px", color: "#666" }}>
                      Please enter the 4-digit OTP sent to your mobile number.
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "30px",
                      }}
                    >
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          style={{
                            width: "60px",
                            padding: "15px",
                            fontSize: "1.5rem",
                            textAlign: "center",
                            border: "2px solid #007bff",
                            borderRadius: "8px",
                            margin: "0 5px",
                            outline: "none",
                          }}
                        />
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={handleSubmit}
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "15px",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          cursor: "pointer",
                          marginBottom: "15px",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#0056b3")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#007bff")
                        }
                      >
                        Submit
                      </button>
                      <button
                        onClick={handleBack}
                        style={{
                          backgroundColor: "#d8ecff",
                          color: "#1b3e81",
                          padding: "15px",
                          border: "1px solid #1b3e81",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#a8d6ff")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#d8ecff")
                        }
                      >
                        Back
                      </button>
                    </div>
                  </div>
                ) : (
                  // Login Page
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* <div style={{ display: "flex", marginBottom: "10px" }}> */}
                    {/* <button
                          style={{
                            backgroundColor:
                              activeTab === "mobile" ? "#d8ecff" : "white",
                            border: "1px solid #ccc",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={() => handleTabChange("mobile")}
                        >
                          Login with User ID
                        </button> */}

                    {/* </div> */}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <input
                        type="text"
                        placeholder={
                          activeTab === "mobile"
                            ? "Trading User ID"
                            : activeTab === "pan"
                            ? "PAN number"
                            : "Enter QR code"
                        }
                        value={username}
                        onChange={handleUsernameChange}
                        style={{
                          width: "100%",
                          padding: "15px",
                          marginBottom: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "1rem",
                        }}
                      />
                      {errors.username && (
                        <p style={{ color: "red", fontSize: "0.9rem" }}>
                          {errors.username}
                        </p>
                      )}

                      <input
                        type="password"
                        placeholder="Demat Password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={{
                          width: "100%",
                          padding: "15px",
                          marginBottom: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize: "1rem",
                        }}
                      />
                      {errors.password && (
                        <p style={{ color: "red", fontSize: "0.9rem" }}>
                          {errors.password}
                        </p>
                      )}

                      <button
                        onClick={handleNextClick}
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "15px",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "1rem",
                          cursor: "pointer",
                          marginBottom: "10px",
                        }}
                      >
                        Next
                      </button>
                      <button
                        style={{
                          backgroundColor: "#d8ecff",
                          color: "#1b3e81",
                          padding: "10px",
                          border: "1px solid #1b3e81",
                          borderRadius: "5px",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={handleBackClick}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      </Content>
  </> 
)
}

export default Kotakneo;
