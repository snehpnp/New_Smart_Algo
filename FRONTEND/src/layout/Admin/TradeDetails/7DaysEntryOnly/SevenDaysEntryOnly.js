

import React from 'react'
import Content from "../../../../Components/Dashboard/Content/Content"


const SevenDaysEntryOnly = () => {
    return <>

        <Content Page_title="SevenDaysEntryOnly">
            <div className="row">
                <div className="col-xl-4">
                    <div className="row">

                        <div className="col-xl-12">
                            <div className="card form-card">
                                <div className="card-body">
                                    <div className="profile-blog">
                                        <h5 className="text-primary d-block">User Profile</h5>
                                        {/* <img src="../assets/images/header-img/pic-1.jpg"  className="profile-img"></img> */}

                                        <h4>
                                            <a href="a" className="text-black">
                                                Details
                                            </a>
                                        </h4>
                                        <div className="profile-info">
                                            <div className="profile-photo">
                                                <img
                                                    src="images/profile/profile.png"
                                                    className="img-fluid rounded-circle"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="profile-details d-block">
                                                <div className="profile-name px-3 pt-2">
                                                    <h4 className="text-primary mb-0">Mitchell C. Shay</h4>
                                                    <p>UX / UI Designer</p>
                                                </div>
                                                <div className="profile-email px-2 pt-2">
                                                    <h4 className="text-muted mb-0">info@example.com</h4>
                                                    <p>Email</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card form-card">
                        <div className="card-body">
                            <div className="profile-tab">
                                <div className="custom-tab-1">
                                    <ul className="nav nav-tabs">

                                        <li className="nav-item">
                                            <a href="#about-me" data-bs-toggle="tab" className="nav-link">
                                                About Me
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                href="#profile-settings"
                                                data-bs-toggle="tab"
                                                className="nav-link"
                                            >
                                                Setting
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">

                                        <div id="about-me" className="tab-pane fade active show">
                                            <div className="profile-personal-info pt-3">
                                                <h4 className="text-primary mb-4">Personal Information</h4>
                                                <div className="row mb-2">
                                                    <div className="col-sm-3 col-5">
                                                        <h5 className="f-w-500">
                                                            Name <span className="pull-end">:</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-sm-9 col-7">
                                                        <span>Mitchell C.Shay</span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-sm-3 col-5">
                                                        <h5 className="f-w-500">
                                                            Email <span className="pull-end">:</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-sm-9 col-7">
                                                        <span>example@examplel.com</span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-sm-3 col-5">
                                                        <h5 className="f-w-500">
                                                            Availability <span className="pull-end">:</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-sm-9 col-7">
                                                        <span>Full Time (Free Lancer)</span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-sm-3 col-5">
                                                        <h5 className="f-w-500">
                                                            Age <span className="pull-end">:</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-sm-9 col-7">
                                                        <span>27</span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-sm-3 col-5">
                                                        <h5 className="f-w-500">
                                                            Location <span className="pull-end">:</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-sm-9 col-7">
                                                        <span>Rosemont Avenue Melbourne, Florida</span>
                                                    </div>
                                                </div>
                                                <div className="row mb-2">
                                                    <div className="col-sm-3 col-5">
                                                        <h5 className="f-w-500">
                                                            Year Experience <span className="pull-end">:</span>
                                                        </h5>
                                                    </div>
                                                    <div className="col-sm-9 col-7">
                                                        <span>07 Year Experiences</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="profile-settings" className="tab-pane fade">
                                            <div className="pt-3">
                                                <div className="settings-form">
                                                    <h4 className="text-primary">Account Setting</h4>
                                                    <form>
                                                        <div className="row">
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Email</label>
                                                                <input
                                                                    type="email"
                                                                    placeholder="Email"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">Password</label>
                                                                <input
                                                                    type="password"
                                                                    placeholder="Password"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Address</label>
                                                            <input
                                                                type="text"
                                                                placeholder="1234 Main St"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Address 2</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Apartment, studio, or floor"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="row">
                                                            <div className="mb-3 col-md-6">
                                                                <label className="form-label">City</label>
                                                                <input type="text" className="form-control" />
                                                            </div>
                                                            <div className="mb-3 col-md-4">
                                                                <label className="form-label">State</label>
                                                                <select
                                                                    className="form-control default-select wide"
                                                                    id="inputState"
                                                                >
                                                                    <option selected="">Choose...</option>
                                                                    <option>Option 1</option>
                                                                    <option>Option 2</option>
                                                                    <option>Option 3</option>
                                                                </select>
                                                            </div>
                                                            <div className="mb-3 col-md-2">
                                                                <label className="form-label">Zip</label>
                                                                <input type="text" className="form-control" />
                                                            </div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <div className="form-check custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id="gridCheck"
                                                                />
                                                                <label
                                                                    className="form-check-label form-label"
                                                                    htmlFor="gridCheck"
                                                                >
                                                                    {" "}
                                                                    Check me out
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-primary" type="submit">
                                                            Sign in
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/ Modal /}
                                <div className="modal fade" id="replyModal">
                                    <div
                                        className="modal-dialog modal-dialog-centered"
                                        role="document"
                                    >
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Post Reply</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="modal"
                                                />
                                            </div>
                                            <div className="modal-body">
                                                <form>
                                                    <textarea
                                                        className="form-control"
                                                        rows={4}
                                                        defaultValue={"Message"}
                                                    />
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger light"
                                                    data-bs-dismiss="modal"
                                                >
                                                    btn-close
                                                </button>
                                                <button type="button" className="btn btn-primary">
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Content>


        )
    </>
}


export default SevenDaysEntryOnly
