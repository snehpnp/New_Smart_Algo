import React from 'react'
import { Link } from 'react-router-dom'

const Content = ({ Page_title, button_title, button_status, route, additional_field, ...rest }) => {



  return (
    <div>
      <div className="content-body">
        <div className="container-fluid">
          <div className="row page-titles">
            <div className='row mb-3'>
              <div className="col-lg-6"></div>
            </div>
            <ol className="breadcrumb">
              <div className="col-lg-6">
                <li className="breadcrumb-item">
                  <h4 className="font-w500 mb-0">{Page_title}</h4>
                </li>
              </div>
              {button_status === false ? "" : <div className="col-lg-6">
                <Link to={route} className='btn btn-primary float-lg-end' o>
                  <i className={`fa-solid  ${button_title === "Back" ? 'fa-arrow-left' : 'fa-plus'} `}></i> {button_title}</Link>
              </div>}
            </ol>
          </div>
          <div className="row d-flex">
            <div className="col-xl-5">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card form-card">
                    <div className="card-body">
                      <div className="form-validation">
                        {rest.children}
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
            <div className="col-xl-7">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card form-card">
                    <div className="card-body">
                      <div className="form-validation">
                        {additional_field}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  )
}

export default Content
