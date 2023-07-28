import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"


const History = () => {


    return <>
        <Content Page_title="TableWithIconButtons">
            <div className="table-responsive">
                <table className="table table-responsive-md">
                    <thead>
                        <tr>
                            <th style={{ width: 50 }}>
                                <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="checkAll"
                                        required=""
                                    />
                                    <label className="form-check-label" htmlFor="checkAll" />
                                </div>
                            </th>
                            <th>
                                <strong>ROLL NO.</strong>
                            </th>
                            <th>
                                <strong>NAME</strong>
                            </th>
                            <th>
                                <strong>Email</strong>
                            </th>
                            <th>
                                <strong>Date</strong>
                            </th>
                            <th>
                                <strong>Status</strong>
                            </th>
                            <th>
                                <strong />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customCheckBox2"
                                        required=""
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="customCheckBox2"
                                    />
                                </div>
                            </td>
                            <td>
                                <strong>542</strong>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src="images/avatar/1.jpg"
                                        className="rounded-lg me-2"
                                        width={24}
                                        alt=""
                                    />{" "}
                                    <span className="w-space-no">Dr. Jackson</span>
                                </div>
                            </td>
                            <td>example@example.com </td>
                            <td>01 August 2020</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-circle text-success me-1" />{" "}
                                    Successful
                                </div>
                            </td>
                            <td>
                                <div className="d-flex">
                                    <a
                                        href="#"
                                        className="btn btn-primary shadow btn-xs sharp me-1"
                                    >
                                        <i className="fa fa-pencil" />
                                    </a>
                                    <a
                                        href="#"
                                        className="btn btn-danger shadow btn-xs sharp"
                                    >
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customCheckBox3"
                                        required=""
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="customCheckBox3"
                                    />
                                </div>
                            </td>
                            <td>
                                <strong>542</strong>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src="images/avatar/2.jpg"
                                        className="rounded-lg me-2"
                                        width={24}
                                        alt=""
                                    />{" "}
                                    <span className="w-space-no">Dr. Jackson</span>
                                </div>
                            </td>
                            <td>example@example.com </td>
                            <td>01 August 2020</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-circle text-danger me-1" /> Canceled
                                </div>
                            </td>
                            <td>
                                <div className="d-flex">
                                    <a
                                        href="#"
                                        className="btn btn-primary shadow btn-xs sharp me-1"
                                    >
                                        <i className="fa fa-pencil" />
                                    </a>
                                    <a
                                        href="#"
                                        className="btn btn-danger shadow btn-xs sharp"
                                    >
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-check custom-checkbox checkbox-success check-lg me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="customCheckBox4"
                                        required=""
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="customCheckBox4"
                                    />
                                </div>
                            </td>
                            <td>
                                <strong>542</strong>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src="images/avatar/3.jpg"
                                        className="rounded-lg me-2"
                                        width={24}
                                        alt=""
                                    />{" "}
                                    <span className="w-space-no">Dr. Jackson</span>
                                </div>
                            </td>
                            <td>example@example.com </td>
                            <td>01 August 2020</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-circle text-warning me-1" /> Pending
                                </div>
                            </td>
                            <td>
                                <div className="d-flex">
                                    <a
                                        href="#"
                                        className="btn btn-primary shadow btn-xs sharp me-1"
                                    >
                                        <i className="fa fa-pencil" />
                                    </a>
                                    <a
                                        href="#"
                                        className="btn btn-danger shadow btn-xs sharp"
                                    >
                                        <i className="fa fa-trash" />
                                    </a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </Content>
        )
    </>
}


export default History

