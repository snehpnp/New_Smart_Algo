import React from 'react'
import { Link } from 'react-router-dom'

const Theme_Content = ({ Page_title, button_title,button_status, route, ...rest }) => {
    return (
        <div>
            <div className="content-body">
                <div className="container-fluid">

                    <div className='row mb-3'>
                        <div className="col-lg-6"></div>
                        {button_status == false ? "":<div className="col-lg-6">
                            <Link to={route} className='btn btn-primary float-lg-end '>
                                <i className={`fa-solid  ${button_title === "Back" ?  'fa-arrow-left' : 'fa-plus' } `}></i> {button_title}</Link>
                    </div>}
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card form-card">
                            <div className="card-header main-card-header">
                                <h4 className="card-title">{Page_title}</h4>
                            </div>
                            <div className="card-body">
                                <div className="form-validation">
                                    {rest.children}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div></div >
    )
}

export default Theme_Content