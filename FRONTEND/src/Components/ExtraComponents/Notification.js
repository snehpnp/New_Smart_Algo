/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { fDate, fDateTimeSuffix } from "../../Utils/Date_formet";
const Notification = ({ status, NotificationData }) => {
  const show_Name = (item) => {
    if (item) {
      return item
        .split("_")
        .map((part) => part[0])
        .join("");
    }
  };

  return (
    <div>
      <li className="nav-item dropdown notification_dropdown">
        <a
          className="nav-link nav-action"
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
          {NotificationData.data.length > 0 ? (
            <span className="badge light text-white bg-primary rounded-circle" />
          ) : null}
        </a>
        <div className="dropdown-menu dropdown-menu-end">
          <div id="DZ_W_Notification1" className="widget-media dz-scroll p-3">
            <ul className="timeline">
              {NotificationData.data &&
                NotificationData.data.slice(0, 6).map((item) => {
                  return status == 2 ? (

                    <li key={item.id} style={{ marginBottom: '20px' }}>
                    <div style={{ 
                      padding: '15px', 
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                      borderRadius: '8px', 
                      backgroundColor: '#fff', 
                      border: '1px solid #eaeaea' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ marginRight: '10px' }}>
                          <span style={{ 
                            display: 'inline-block', 
                            width: '40px', 
                            height: '40px', 
                            lineHeight: '40px', 
                            textAlign: 'center', 
                            borderRadius: '50%', 
                            fontSize: '14px', 
                            backgroundColor: '#17a2b8', 
                            color: '#fff' 
                          }}>
                            {show_Name(item.fullname)}
                          </span>
                        </div>
                        <div>
                          <h6 style={{ margin: '0', fontWeight: 'bold', color: '#007bff' }}>
                            Received From Admin
                          </h6>
                        </div>
                      </div>
                      <p style={{ 
                        marginBottom: '10px', 
                        color: '#6c757d', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        width: '100%' 
                      }}>
                        {item.Message}
                      </p>
                      <small style={{ color: '#adb5bd' }}>
                        {fDateTimeSuffix(item.createdAt)}
                      </small>
                    </div>
                  </li>
                  
                  

                   
                  ) : (
                    <li key={item.id}>
                      <div className="timeline-panel">
                        <div className="media me-2 media-info">
                          {show_Name(item.fullname)}
                        </div>
                        <div className="media-body">
                          <h6 className="mb-1">
                            Received From {item.username}
                          </h6>
                          <small className="d-block">
                            {fDateTimeSuffix(item.createdAt)}
                          </small>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          {status == 2 ? (
            <Link to={{ pathname: "/client/helpcenter" }}  state={{ status: 2 }} className="all-notification"  > See all notifications <i className="ti-arrow-end" />  </Link>
          ) : (
            <Link to="/admin/helpcenter" className="all-notification">
              See all notifications <i className="ti-arrow-end" />
            </Link>
          )}
        </div>
      </li>
    </div>
  );
};

export default Notification;
