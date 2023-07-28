import React from 'react'

const DropDown = () => {
    return (
          <div className="mb-0 dropdown custom-dropdown">
            <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <img src="../assets/images/avatar/1.png" />
                <i className="fa fa-angle-down ms-3" />
            </button>
            <div className="dropdown-menu dropdown-menu-end" style={{ margin: 0 }}>
                <a className="dropdown-item" href="#">
                    Profile
                </a>
                <a className="dropdown-item" href="#">
                    Logout
                </a>

        </div></div>
    )
}

export default DropDown