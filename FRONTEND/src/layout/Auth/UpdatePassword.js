import React, { useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Update_Password } from "../../ReduxStore/Slice/Auth/AuthSlice";
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
import ToastButton from "../../Components/ExtraComponents/Alert_Toast";
import Formikform from "../../Components/ExtraComponents/Form/Formik_form"
import { useFormik } from 'formik';
import * as  valid_err from "../../Utils/Common_Messages"
// import { toast } from "react-toastify";
import { Email_regex, Mobile_regex } from "../../Utils/Common_regex"
import { encode, decode } from 'js-base64';


const UpdatePassword = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const dcoded_UsrId = (decode(id)).replace(/"/g, "")
    const dispatch = useDispatch();

    const GetAllThemes = () => {
        axios.get("https://api.smartalgo.in:3001/smartalgo/get/theme").then((res) => {
            // console.log("accept res`122`12`", res.data.data);
            // $('body').attr('data-theme-version', themedata.theme_version);
            // setThemeData(res.data.data)
        }).catch((err) => {
            console.log("error", err);
        })
    }


    useEffect(() => {
        GetAllThemes()
    }, [])



    const isValidEmail = (email) => {
        return Email_regex(email)
    }



    const formik = useFormik({
        initialValues: {
            newpassword: '',
            confirmpassword: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.newpassword) {
                errors.newpassword = valid_err.NEW_PASSWORD_ERROR;
            } if (!values.confirmpassword) {
                errors.confirmpassword = valid_err.CONFIRM_PASSWORD_ERROR;
            } else if (values.newpassword !== values.confirmpassword) {
                errors.confirmpassword = valid_err.CONFIRM_AND_NEW_PASSWORD_ERROR;
            }
            return errors;
        },
        onSubmit: async (values) => {

            let req = {
                newpassword: values.newpassword,
                confirmpassword: values.confirmpassword,
                userid: dcoded_UsrId,
            };

            await dispatch(Update_Password(req))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        toast.success(response.msg)
                        setTimeout(() => {
                            navigate("/login", { replace: true });
                        }, 2000);
                    } else if (response.response.status === 409) {
                        toast.error(response.response.data.msg)
                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        }
    })

    const fields = [
        { name: 'newpassword', label: 'New Password', type: 'password' },
        { name: 'confirmpassword', label: 'Confirm Password', type: 'password' },
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
                                                Reset Password
                                            </h4>
                                            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update Password" title="forUpdatePassword" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ToastButton />

                        </div>
                    </div>
                </div>
            </div>



        </div >
    );
};

export default UpdatePassword;


