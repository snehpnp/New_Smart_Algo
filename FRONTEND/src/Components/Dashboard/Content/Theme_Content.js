import React from 'react'

const Theme_Content = ({Page_title ,  ...rest}) => {
    return (
        <div>
            <div className="content-body">
                <div className="container-fluid">

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
            </div></div>
    )
}

export default Theme_Content