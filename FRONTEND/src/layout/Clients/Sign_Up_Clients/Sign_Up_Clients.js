import React from "react";
import Content from "../../../Components/Dashboard/Content/Content";

const Sign_Up_Clients = () => {
    return (
        <>
            <div>
                <div className="content-body">
                    {/* row */}
                    <div className="container-fluid">
                        {/* <Content Page_title="Sign_Up_Clients">
            <p>Sign_Up_Clients</p>
        </Content> */}
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card form-card">
                                    <div className="card-header main-card-header">
                                        <h4 className="card-title">Add Client</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-validation">
                                            <form
                                                className="needs-validation"
                                                noValidate=""
                                                data-bitwarden-watching={1}
                                            >
                                                <div className="row">
                                                    <div className="col-xl-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom01"
                                                            >
                                                                Username
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="validationCustom01"
                                                                    placeholder="Enter a username.."
                                                                    required=""
                                                                />
                                                                <div className="invalid-feedback">
                                                                    Please enter a username.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom01"
                                                            >
                                                                Fullname
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="validationCustom01"
                                                                    placeholder="Enter a username.."
                                                                    required=""
                                                                />
                                                                <div className="invalid-feedback">
                                                                    Please enter a fullname.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom02"
                                                            >
                                                                Email <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="validationCustom02"
                                                                    placeholder="Your valid email.."
                                                                    required=""
                                                                />
                                                                <div className="invalid-feedback">
                                                                    Please enter a Email.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom03"
                                                            >
                                                                Password
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <input
                                                                    type="password"
                                                                    className="form-control"
                                                                    id="validationCustom03"
                                                                    placeholder="Choose a safe one.."
                                                                    required=""
                                                                />
                                                                <div className="invalid-feedback">
                                                                    Please enter a password.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom05"
                                                            >
                                                                To Month (Form Date)
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7 ">
                                                                <input
                                                                    type="date"
                                                                    className="datepicker-default form-control"
                                                                    id="datepicker"
                                                                    placeholder="2017-06-04"
                                                                />

                                                                <div className="invalid-feedback">
                                                                    Please select a one.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom05"
                                                            >
                                                                License
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <select
                                                                    className="default-select wide form-control"
                                                                    id="validationCustom05"
                                                                >
                                                                    <option data-display="Select">
                                                                        Please select
                                                                    </option>
                                                                    <option value="html">HTML</option>
                                                                    <option value="css">CSS</option>
                                                                    <option value="javascript">JavaScript</option>
                                                                    <option value="angular">Angular</option>
                                                                    <option value="angular">React</option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    Please select a one.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom05"
                                                            >
                                                                To Month (To Date)
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7 ">
                                                                <input
                                                                    type="date"
                                                                    className="datepicker-default form-control"
                                                                    id="datepicker"
                                                                    placeholder="2017-06-04"
                                                                />

                                                                <div className="invalid-feedback">
                                                                    Please select a one.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom05"
                                                            >
                                                                Group
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <select
                                                                    className="default-select wide form-control"
                                                                    id="validationCustom05"
                                                                >
                                                                    <option data-display="Select">
                                                                        Please select
                                                                    </option>
                                                                    <option value="html">HTML</option>
                                                                    <option value="css">CSS</option>
                                                                    <option value="javascript">JavaScript</option>
                                                                    <option value="angular">Angular</option>
                                                                    <option value="angular">React</option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    Please select a one.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="row">
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>
                                                            <div className="col-lg-2">
                                                            <div class="form-check custom-checkbox mb-3">
											<input type="checkbox" className="form-check-input" id="customCheckBox1" required/>
											<label className="form-check-label" for="customCheckBox1">Checkbox 1</label>
										</div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom05"
                                                            >
                                                               Service Month Given
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <select
                                                                    className="default-select wide form-control"
                                                                    id="validationCustom05"
                                                                >
                                                                    <option data-display="Select">
                                                                        Please select
                                                                    </option>
                                                                    <option value="html">HTML</option>
                                                                    <option value="css">CSS</option>
                                                                    <option value="javascript">JavaScript</option>
                                                                    <option value="angular">Angular</option>
                                                                    <option value="angular">React</option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    Please select a one.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3 row">
                                                            <label
                                                                className="col-lg-4 col-form-label"
                                                                htmlFor="validationCustom05"
                                                            >
                                                                Sub-Admin
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="col-lg-7">
                                                                <select
                                                                    className="default-select wide form-control"
                                                                    id="validationCustom05"
                                                                >
                                                                    <option data-display="Select">
                                                                        Please select
                                                                    </option>
                                                                    <option value="html">HTML</option>
                                                                    <option value="css">CSS</option>
                                                                    <option value="javascript">JavaScript</option>
                                                                    <option value="angular">Angular</option>
                                                                    <option value="angular">React</option>
                                                                </select>
                                                                <div className="invalid-feedback">
                                                                    Please select a one.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12">
                                                        <div className="mb-3">

                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                >
                                                                    Submit
                                                                </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        </>
    );
};

export default Sign_Up_Clients;
