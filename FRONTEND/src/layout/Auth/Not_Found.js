import React from 'react'
import { Link } from "react-router-dom";

const Not_Found = () => {
    return (

        <div class="authincation h-100 d-flex align-items-center">
            <div class="container h-100">
                <div class="row justify-content-center h-100 align-items-center">
                    <div class="col-md-7">
                        <div class="form-input-content text-center error-page">
                            <h1 class="error-text fw-bold">404</h1>
                            <h4><i class="fa fa-exclamation-triangle text-warning"></i> The page you were looking for is not found!</h4>
                            <p>You may have mistyped the address or the page may have moved.</p>
                            <div>
                                <Link to="/login" class="btn btn-primary" >Back to Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Not_Found