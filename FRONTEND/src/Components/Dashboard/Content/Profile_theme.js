import React from 'react'
import { Link } from 'react-router-dom'

const Profile_theme = ({ Page_title, route, ...rest }) => {
    return (
        <div>
            <div className="content-body">
                <div className="container-fluid col-md-12">
                    <div className="row page-titles me-2 col-md-12">
                        <div className='text-center'>
                            <i class="fa-solid fa-user display-1"></i>
                            <h3 className='text-center'>Administrator</h3>
                            <div className='text-center'>
                                <label><b>Email ID :</b></label>
                                <div className='text-center'>
                                    <label><b>Mobile :</b></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row page-titles col-md-12">

                        <div>
                            <h3 className='text-center bg-primary text-white p-2'>Change Password</h3>
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
    )
}

export default Profile_theme;