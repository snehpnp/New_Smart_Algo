import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Forget_Password } from "../../ReduxStore/Slice/Auth/AuthSlice";
import toast, { Toaster } from 'react-hot-toast';
import Formikform from "../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../Utils/Common_Messages"
import { Email_regex, Mobile_regex } from "../../Utils/Common_regex"

import ToastButton from "../../Components/ExtraComponents/Alert_Toast";


const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
    }, [])



    const isValidEmail = (email) => {
        return Email_regex(email)
    }



    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = valid_err.EMPTY_EMAIL_ERROR;
            } else if (!isValidEmail(values.email)) {
                errors.email = valid_err.INVALID_EMAIL_ERROR;
            }

            return errors;
        },
        onSubmit: async (values) => {

            let req = {
                Email: values.email,
            };

            await dispatch(Forget_Password(req))
                .unwrap()
                .then((response) => {
                    console.log(response)
                    if (response.status) {
                        toast.success(response.msg)
                        setTimeout(() => {
                            navigate("/login", { replace: true });
                        }, 1000);
                    } 
                    else{
                        toast.error(response.msg)

                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                });

        }
    })

    const fields = [
        { name: 'email', label: 'Email', type: 'email' },
    ];

    return (
        <div class="vh-100" >
            <div className="authincation h-100">
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                        <div className="col-md-4">
                            <div className="authincation-content">
                                <div className="row no-gutters">
                                    <div className="col-xl-12">
                                        <div className="auth-form">
                                            <h4 className="text-center mb-4">
                                                Password Reset
                                            </h4>
                                            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Continue" title="forResetPassword" />
                                            <div class="form-row d-flex justify-content-end mt-4 mb-2">
                                                <div class="mb-3 mt-1">
                                                    <Link to="/login">Back To Sign In</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ToastButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div >
    );
};

export default ResetPassword;


