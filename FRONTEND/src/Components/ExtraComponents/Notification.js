import React from 'react'

const Notification = () => {
    return (
        <div>
            <li className="nav-item dropdown notification_dropdown">
                <a
                    className="nav-link nav-action"
                    // href="javascript:void(0);"
                    role="button"
                    data-bs-toggle="dropdown"
                >
                    <svg
                        width={28}
                        height={28}
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10.4524 25.6682C11.0605 27.0357 12.409 28 14.0005 28C15.592 28 16.9405 27.0357 17.5487 25.6682C16.4265 25.7231 15.2594 25.76 14.0005 25.76C12.7417 25.76 11.5746 25.723 10.4524 25.6682Z"
                            fill="#737B8B"
                        />
                        <path
                            d="M26.3532 19.74C24.877 17.8785 22.3996 14.2195 22.3996 10.64C22.3996 7.09073 20.1193 3.89758 16.7996 2.72382C16.7593 1.21406 15.5183 0 14.0007 0C12.482 0 11.2422 1.21406 11.2018 2.72382C7.88101 3.89758 5.6007 7.09073 5.6007 10.64C5.6007 14.2207 3.1244 17.8785 1.64712 19.74C1.15433 20.3616 1.00197 21.1825 1.24058 21.9363C1.47354 22.6721 2.05367 23.2422 2.79288 23.4595C4.08761 23.8415 6.20997 24.2715 9.44682 24.491C10.8479 24.5851 12.3543 24.64 14.0008 24.64C15.646 24.64 17.1525 24.5851 18.5535 24.491C21.7915 24.2715 23.9128 23.8415 25.2086 23.4595C25.9478 23.2422 26.5268 22.6722 26.7598 21.9363C26.9983 21.1825 26.8449 20.3616 26.3532 19.74Z"
                            fill="#737B8B"
                        />
                    </svg>
                    <span className="badge light text-white bg-primary rounded-circle" />
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                    <div
                        id="DZ_W_Notification1"
                        className="widget-media dz-scroll p-3"
                        style={{ height: 380 }}
                    >
                        <ul className="timeline">
                            <li>
                                <div className="timeline-panel">
                                    <div className="media me-2">
                                        <img
                                            alt="image"
                                            width={50}
                                            src="../assets/images/avatar/1.jpg"
                                        />
                                    </div>
                                    <div className="media-body">
                                        <h6 className="mb-1">Dr sultads Send you Photo</h6>
                                        <small className="d-block">
                                            29 July 2020 - 02:26 PM
                                        </small>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-panel">
                                    <div className="media me-2 media-info">KG</div>
                                    <div className="media-body">
                                        <h6 className="mb-1">
                                            Resport created successfully
                                        </h6>
                                        <small className="d-block">
                                            29 July 2020 - 02:26 PM
                                        </small>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-panel">
                                    <div className="media me-2 media-success">
                                        <i className="fa fa-home" />
                                    </div>
                                    <div className="media-body">
                                        <h6 className="mb-1">Reminder : Treatment Time!</h6>
                                        <small className="d-block">
                                            29 July 2020 - 02:26 PM
                                        </small>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-panel">
                                    <div className="media me-2">
                                        <img
                                            alt="image"
                                            width={50}
                                            src="../assets/images/avatar/1.jpg"
                                        />
                                    </div>
                                    <div className="media-body">
                                        <h6 className="mb-1">Dr sultads Send you Photo</h6>
                                        <small className="d-block">
                                            29 July 2020 - 02:26 PM
                                        </small>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-panel">
                                    <div className="media me-2 media-danger">KG</div>
                                    <div className="media-body">
                                        <h6 className="mb-1">
                                            Resport created successfully
                                        </h6>
                                        <small className="d-block">
                                            29 July 2020 - 02:26 PM
                                        </small>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="timeline-panel">
                                    <div className="media me-2 media-primary">
                                        <i className="fa fa-home" />
                                    </div>
                                    <div className="media-body">
                                        <h6 className="mb-1">Reminder : Treatment Time!</h6>
                                        <small className="d-block">
                                            29 July 2020 - 02:26 PM
                                        </small>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <a className="all-notification" href="javascript:void(0);">
                        See all notifications <i className="ti-arrow-end" />
                    </a>
                </div>
            </li>
        </div>
    )
}

export default Notification