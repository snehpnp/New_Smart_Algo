import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"


const History = () => {


    return <>
        <Content Page_title="TableWithCustomButtons">
            <div className="table-responsive">
                <table className="table border  table-responsive-md">
                    <thead>
                        <tr>
                            <th style={{ width: 80 }}>
                                <strong>#</strong>
                            </th>
                            <th>
                                <strong>PATIENT</strong>
                            </th>
                            <th>
                                <strong>DR NAME</strong>
                            </th>
                            <th>
                                <strong>DATE</strong>
                            </th>
                            <th>
                                <strong>STATUS</strong>
                            </th>
                            <th>
                                <strong>PRICE</strong>
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>01</strong>
                            </td>
                            <td>Mr. Bobby</td>
                            <td>Dr. Jackson</td>
                            <td>01 August 2020</td>
                            <td>
                                <span className="badge light badge-success">
                                    Successful
                                </span>
                            </td>
                            <td>$21.56</td>
                            <td>
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="btn btn-success light sharp"
                                        data-bs-toggle="dropdown"
                                    >
                                        <svg
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 24 24"
                                            version="1.1"
                                        >
                                            <g
                                                stroke="none"
                                                strokeWidth={1}
                                                fill="none"
                                                fillRule="evenodd"
                                            >
                                                <rect x={0} y={0} width={24} height={24} />
                                                <circle fill="#000000" cx={5} cy={12} r={2} />
                                                <circle fill="#000000" cx={12} cy={12} r={2} />
                                                <circle fill="#000000" cx={19} cy={12} r={2} />
                                            </g>
                                        </svg>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#">
                                            Edit
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Delete
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>02</strong>
                            </td>
                            <td>Mr. Bobby</td>
                            <td>Dr. Jackson</td>
                            <td>01 August 2020</td>
                            <td>
                                <span className="badge light badge-danger">Canceled</span>
                            </td>
                            <td>$21.56</td>
                            <td>
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="btn btn-danger light sharp"
                                        data-bs-toggle="dropdown"
                                    >
                                        <svg
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 24 24"
                                            version="1.1"
                                        >
                                            <g
                                                stroke="none"
                                                strokeWidth={1}
                                                fill="none"
                                                fillRule="evenodd"
                                            >
                                                <rect x={0} y={0} width={24} height={24} />
                                                <circle fill="#000000" cx={5} cy={12} r={2} />
                                                <circle fill="#000000" cx={12} cy={12} r={2} />
                                                <circle fill="#000000" cx={19} cy={12} r={2} />
                                            </g>
                                        </svg>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#">
                                            Edit
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Delete
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>03</strong>
                            </td>
                            <td>Mr. Bobby</td>
                            <td>Dr. Jackson</td>
                            <td>01 August 2020</td>
                            <td>
                                <span className="badge light badge-warning">Pending</span>
                            </td>
                            <td>$21.56</td>
                            <td>
                                <div className="dropdown">
                                    <button
                                        type="button"
                                        className="btn btn-warning light sharp"
                                        data-bs-toggle="dropdown"
                                    >
                                        <svg
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 24 24"
                                            version="1.1"
                                        >
                                            <g
                                                stroke="none"
                                                strokeWidth={1}
                                                fill="none"
                                                fillRule="evenodd"
                                            >
                                                <rect x={0} y={0} width={24} height={24} />
                                                <circle fill="#000000" cx={5} cy={12} r={2} />
                                                <circle fill="#000000" cx={12} cy={12} r={2} />
                                                <circle fill="#000000" cx={19} cy={12} r={2} />
                                            </g>
                                        </svg>
                                    </button>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item" href="#">
                                            Edit
                                        </a>
                                        <a className="dropdown-item" href="#">
                                            Delete
                                        </a>
                                    </div>
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

