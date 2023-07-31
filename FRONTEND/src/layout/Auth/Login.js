import React, { useEffect, useState , useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SignIn } from "../../ReduxStore/Slice/Auth/AuthSlice";
import Modal from "../../Components/ExtraComponents/Modal"
import OtpInput from 'react-otp-input';
import { check_Device } from "../../Utils/find_device";

const Login = () => {
  const navigate = useNavigate();
  const data = useRef()
  const dispatch = useDispatch();


  const [showModal, setshowModal] = useState(false)
  const [otp, setOtp] = useState('');
  // let aaaa
  // useEffect(() => {
  //   aaaa += check_Device()
  // }, [aaaa])


  // console.log("abc", aaaa);

  const loginUser = async (e) => {
    e.preventDefault();

    let req = {
      Email: "superadmin@gmail.com",
      Password: "269043",
      device: "APP",
    };

    await dispatch(SignIn(req))
      .then((res) => {
        console.log("signin", res);

        if (res.payload.status) {
          if (res.payload.data.Role === "SUPERADMIN") {
            // __________ Super Admin __________
            localStorage.setItem("user_details",JSON.stringify(res.payload.data));
            localStorage.setItem("user_role",JSON.stringify(res.data.data.role));
            navigate("/super/dashboard");
          } else if (res.payload.data.Role === "ADMIN") {
            // __________ Admin __________
            localStorage.setItem("user_details",JSON.stringify(res.payload.data));
            localStorage.setItem("user_role", JSON.stringify(res.data.data.role));
        
            navigate("/admin/dashboard");
          } else if (res.payload.data.Role === "CLIENT") {
            // __________ client __________
            localStorage.setItem("user_details", JSON.stringify(res.payload.data));
            localStorage.setItem("user_role", JSON.stringify(res.data.data.role));
            navigate("/client/dashboard");
          } else if (res.payload.data.Role === "SUBADMIN") {
            // __________ subadmin __________
            localStorage.setItem("user_details", JSON.stringify(res.data.data));
            localStorage.setItem("user_role",JSON.stringify(res.data.data.role));
            navigate("/subadmin/dashboard");
          }
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };







  const verifyOTP = () => {


  }


  return (
    <div class="vh-100">
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <div className="text-center mb-3">

                        <a href="#a"> logo </a>
                      </div>
                      <h4 className="text-center mb-4">

                        Sign in your account




                      </h4>

                      <button onClick={() => setshowModal(!showModal)}  > click</button>
                      {showModal ?
                        <>
                          <Modal isOpen={showModal} handleClose={!showModal} backdrop="static" size="sm" title="Verify OTP" btn_name="Verify" Submit_Function={verifyOTP()}>
                            <OtpInput
                              containerStyle="otp-div"
                              value={otp}
                              onChange={setOtp}
                              numInputs={4}
                              renderSeparator={<span></span>}
                              renderInput={(props) => <input {...props} />}
                            />
                          </Modal >
                        </>
                        : ""
                      }




                      <form action="index.html">
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong> Email </strong>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Example@gmail.com"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="mb-1">
                            <strong> Password </strong>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                          />
                        </div>
                        {/* <div className="form-row d-flex justify-content-between mt-4 mb-2">
                                                            <div className="mb-3">
                                                                <div className="form-check custom-checkbox ms-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="basic_checkbox_1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="basic_checkbox_1"
                                                                    >
                                                                        Remember my preference
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3 mt-1">
                                                                <a href="page-forgot-password.html">Forgot Password?</a>
                                                            </div>
                                                        </div> */}
                        <div className="text-center">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            onClick={(e) => {
                              loginUser(e);
                            }}
                          >
                            Sign Me In
                          </button>
                        </div>
                      </form>
                      {/* <div className="new-account mt-3">
                                                        <p className="mb-0 mb-sm-3">
                                                            Don't have an account?
                                                            <a className="text-primary" href="./page-register.html">
                                                                Sign up
                                                            </a>
                                                        </p>
                                                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
