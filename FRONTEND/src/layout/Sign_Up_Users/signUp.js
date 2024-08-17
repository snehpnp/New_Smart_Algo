import React, { useEffect } from 'react'
import Formikform from '../../Components/ExtraComponents/Form/Formik_form'
import ToastButton from '../../Components/ExtraComponents/Alert_Toast'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from "formik";
import { Email_regex, Mobile_regex } from '../../Utils/Common_regex'
import { check_Device } from "../../Utils/find_device"
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SignUpUser, Get_Panel_Informtion } from '../../ReduxStore/Slice/Auth/AuthSlice'
import toast from "react-hot-toast";
import * as valid_err from '../../Utils/Common_Messages'
import * as Config from "../../Utils/Config";
import { Get_Company_Logo } from '../../ReduxStore/Slice/Admin/AdminSlice'
import $ from "jquery";


const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const locationData = useLocation()
  const [referCode, setReferCode] = useState('');
  const [CheckUser, setCheckUser] = useState(check_Device());

  var ReferalCode = locationData.pathname.split('/');


  const getPanelDetails = async () => {
    const req = {
      domain: Config.react_domain
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

          $(".logo-abbr").attr('src', response.data && response.data[0].logo);
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
      refer_code: "",

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
        refer_code: referCode || values.refer_code,

      };


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
          return;
        });

    },
  });


  const fields = [
      { name: "fullname", label: "FullName", type: 'text' },
      { name: "username", label: "UserName", type: 'text' },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "refer_code", label: "Refrel", type: "text", disable: ReferalCode.length == 3  ? true : false }
  ];
  

  useEffect(() => {
    getPanelDetails()
    CompanyName();
    setReferCode(ReferalCode && ReferalCode[2]);
    formik.setFieldValue('refer_code', ReferalCode && ReferalCode[2]);

  }, [])

  return (
    <>
      <div className="vh-100">
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
                        <div className="form-row mt-4 mb-2">
                          <div className="mb-3 mt-1  d-flex justify-content-end ">

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