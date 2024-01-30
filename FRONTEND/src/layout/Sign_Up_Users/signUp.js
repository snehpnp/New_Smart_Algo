import React, { useEffect } from 'react'
import Formikform from '../../Components/ExtraComponents/Form/Formik_form'
import ToastButton from '../../Components/ExtraComponents/Alert_Toast'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from "formik";
import { Email_regex, Mobile_regex } from '../../Utils/Common_regex'
import { check_Device } from "../../Utils/find_device"
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SignUpUser, Get_Panel_Informtion } from '../../ReduxStore/Slice/Auth/AuthSlice'
import toast, { Toaster } from "react-hot-toast";
import * as valid_err from '../../Utils/Common_Messages'
import * as Config from "../../Utils/Config";
import { Get_Company_Logo } from '../../ReduxStore/Slice/Admin/AdminSlice'
import $ from "jquery";



const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [showModal, setshowModal] = useState(false);
  const [UserData, setUserData] = useState("");
  const [getCompanyName, setGetCompanyName] = useState("");
  const [CheckUser, setCheckUser] = useState(check_Device());




  const getPanelDetails = async () => {
    let domain = window.location.host
    const req = {
      domain: Config.react_domain
      // domain: "sneh.com",
    };

    await dispatch(Get_Panel_Informtion(req))
      .unwrap()
      .then((response) => {
        let res = response.data[0].theme_data[0];
        localStorage.setItem("theme", JSON.stringify(res));
      });
  };
  const CompanyName = async () => {
    await dispatch(Get_Company_Logo()).unwrap()
      .then((response) => {
        if (response.status) {
          setGetCompanyName(response.data && response.data[0].panel_name)

          $(".logo-abbr").attr('src', response.data && response.data[0].logo);
          // console.log("response.data && response.data", response.data && response.data)
          $(".Company_logo").html(response.data && response.data[0].panel_name);


          $(".set_Favicon")

          let favicon = $("link[rel='icon']").length
            ? $("link[rel='icon']")
            : $("<link rel='icon' type='image/x-icon' />");
          favicon.attr('href', response.data && response.data[0].favicon);
          $('head').append(favicon);
        }
      })
  }



  const isValidEmail = (email) => {
    return Email_regex(email);
  };
  const isValidContact = (phone) => {
    return Mobile_regex(phone)
  }

  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      phone: "",
      email: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.fullname) {
        errors.fullname = valid_err.FULLNAME_ERROR;
      }
      if (!values.username) {
        errors.username = valid_err.USERNAME_ERROR;
      }
      if (!values.email) {
        errors.email = valid_err.EMPTY_EMAIL_ERROR;
      }
      else if (!isValidEmail(values.email)) {
        errors.email = valid_err.INVALID_EMAIL_ERROR;
      }
      if (!values.phone) {
        errors.phone = valid_err.CONTACT_ERROR;
      }
      else if (!isValidContact(values.phone)) {
        errors.phone = valid_err.INVALID_CONTACT_ERROR;
      }
      return errors;
    },
    onSubmit: async (values) => {
      let req = {
        FullName: values.fullname,
        UserName: values.username,
        Email: values.email,
        PhoneNo: values.phone,
        device: CheckUser,
      };


      //  console.log("req:", req);

      await dispatch(SignUpUser(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            toast.success(response.msg);
            setTimeout(() => {
              navigate('/login')

            }, 2000)
          }
          else {
            response.response.data.data.map((data, index) => {
              toast.error(data);
            })
          }
        })
        .catch((error) => {
          console.log("Error", error);
        });

    },
  });

  const fields = [
    { name: "fullname", label: "FullName", type: 'text' },
    { name: "username", label: "UserName", type: 'text' },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "text" },
  ];

  useEffect(() => {
    getPanelDetails()
    CompanyName();

  }, [])
  return (
    <>
      <div class="vh-100">
        <div className="authincation h-100">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-md-6">
                <div className="authincation-content">
                  <div className="row no-gutters">
                    <div className="col-xl-12">
                      <div className="auth-form">
                        <div className="text-center mb-3">
                          {/* <a href="#a"> logo </a> */}
                          <span className="brand-logo">
                            <img className="logo-abbr w-50" src="assets/icons/logo.png" alt="logo" />
                          </span>
                        </div>
                        <h4 className="text-center mb-4">Sign Up your account</h4>
                        <Formikform
                          fieldtype={fields.filter(
                            (field) =>
                              !field.showWhen || field.showWhen(formik.values)
                          )}
                          formik={formik}
                          btn_name="Sign Up"
                          // btn_name_login='Sign In'
                          title="forlogin1"
                        />
                        <div class="form-row mt-4 mb-2">
                          <div class="mb-3 mt-1  d-flex justify-content-end ">

                            <div><Link to="/login">Sign In</Link></div>
                          </div>
                        </div>
                      </div>
                      <ToastButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SignUp