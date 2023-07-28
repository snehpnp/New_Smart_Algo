import React from 'react'
import {useNavigate, Link } from "react-router-dom";
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate()

    const loginUser = (e) => {
        e.preventDefault();

        let req = {
            // "email": "superadmin@gmail.com", 'password': "123",
            'email': "admin@gmail.com", 'password': "123",
            // 'email': "subadmin@gmail.com", 'password': "123",
            // 'email': "client@gmail.com", 'password': "123",
        }

        axios.post("https://api.smartalgo.in:3001/new/login", req).then((res) => {

            if (res.data.status) {

                if (res.data.data.role === "SUPERADMIN") {
                    // __________ Super Admin __________
                    localStorage.setItem('user_details', JSON.stringify(res.data.data));
                    localStorage.setItem('user_role', JSON.stringify(res.data.data.role));
                    navigate("/super/dashboard");
                }
                else if (res.data.data.role === "ADMIN") {
                    // __________ Admin __________
                    localStorage.setItem('user_details', JSON.stringify(res.data.data));
                    localStorage.setItem('user_role', JSON.stringify(res.data.data.role));
                    navigate("/admin/dashboard");
                } else if (res.data.data.role === "CLIENT") {
                    // __________ client __________
                    localStorage.setItem('user_details', JSON.stringify(res.data.data));
                    localStorage.setItem('user_role', JSON.stringify(res.data.data.role));
                    navigate("/client/dashboard");
                } else if (res.data.data.role === "SUBADMIN") {
                    // __________ subadmin __________
                    localStorage.setItem('user_details', JSON.stringify(res.data.data));
                    localStorage.setItem('user_role', JSON.stringify(res.data.data.role));
                    navigate("/subadmin/dashboard");
                }

            }

        }).catch((err) => {
            console.log("error", err);
        })

    }


    return (
        <div class="vh-100">   <div className="authincation h-100">
            <div className="container h-100">
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-6">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <div className="text-center mb-3">
                                            <a href="#">
                                                logo
                                            </a>
                                        </div>
                                        <h4 className="text-center mb-4">Sign in your account</h4>
                                        <form action="index.html">
                                            <div className="mb-3">
                                                <label className="mb-1">
                                                    <strong>Email</strong>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Example@gmail.com"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="mb-1">
                                                    <strong>Password</strong>
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
                                                        loginUser(e)
                                                    }}
                                                >
                                                    Sign Me In
                                                </button>
                                            </div>
                                        </form>
                                        {/* <div className="new-account mt-3">
                                            <p className="mb-0 mb-sm-3">
                                                Don't have an account?{" "}
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
        </div></div>
    )
}

export default Login