import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { BrowserRouter, Route, Routes, NavLink, useLocation, useNavigate } from "react-router-dom";
import Content from '../../Dashboard/Content/Content';



const ReusableForm = ({ initialValues, validationSchema, onSubmit, fieldtype, formik, btn_name }) => {

  const location = useLocation()

  const [passwordVisible, setPasswordVisible] = useState({});

  return (

    // <Content Page_title="HelpCenter">
    <form onSubmit={formik.handleSubmit}>
      <div className='row'>
        {/* <div className={`row`}> */}
        {fieldtype.map((field) => (

          <>

            {field.type === 'select' ? <>
              <div className="col-lg-6">
                <div className="mb-3 row">
                  <label
                    className="col-lg-4 col-form-label"
                    htmlFor={field.name}
                  >
                    {field.label}
                    <span className="text-danger">*</span>
                  </label>
                  <div className="col-lg-7">
                    <select
                      className="default-select wide form-control"
                      id={field.name}
                      {...formik.getFieldProps(field.name)}

                    >
                      <option value="" selected disabled>
                        Please Select {field.label}
                      </option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {formik.errors[field.name] &&
                      <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                  </div>
                </div>
              </div>

            </> :

              field.type === "checkbox" ? <>

                {field.index === '1' ? <>

                </>
                  : ""}
                <div className="col-lg-3">
                  <div className="row d-flex">
                    <div className="col-lg-12 ">
                      <div class="form-check custom-checkbox mb-3">
                        <input type={field.type} className="form-check-input" id={field.name}   {...formik.getFieldProps(field.name)}
                        />
                        <label className="form-check-label" for={field.name}>{field.name}</label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </> :

                field.type === "radio" ? <>
                  {field.index === '1' ? <>
                    {/* <label
                      className="col-lg-3 col-form-label mb-3"
                      htmlFor={field.name}
                    >
                      Fullname
                      <span className="text-danger">*</span>
                    </label> */}
                  </>
                    : ""}

                  <div className="col-lg-3">
                    <div className="row d-flex">
                      <div className="col-lg-12 ">
                        <div class="form-check custom-checkbox mb-3">
                          <input type={field.type} name={field.name} className="form-check-input" id={field.name}
                            {...formik.getFieldProps(field.name)}
                          />
                          <label className="form-check-label" for={field.name}>{field.name}</label>
                        </div>
                      </div>
                    </div>
                  </div>

                </> :
                  field.type === "password" ? <>
                    <div className="col-lg-6">
                      <div className="mb-3 row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="validationCustom01"
                        >
                          Fullname
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-7" style={{ position: 'relative' }}>

                          <input
                            id={field.name}
                            type={passwordVisible[field.name] ? 'text' : field.type}
                            placeholder={field.label}
                            {...formik.getFieldProps(field.name)}
                            className={` form-control`}
                          />
                          <i class={`fa-solid ${passwordVisible[field.name] ? 'fa-eye-slash' : 'fa-eye'}`} style={{
                            position: 'absolute',
                            top: '1.5px',
                            right: '20px',
                            padding: '12.4px 6.6px',
                            borderRadius: '3px'
                          }}
                            onClick={() => setPasswordVisible((prevState) => ({
                              ...prevState,
                              [field.name]: !prevState[field.name],
                            }))

                            }
                          ></i>
                        </div>
                      </div>
                    </div>

                  </> :
                    field.type === "date" ? <>
                      <div className="col-lg-3">
                        <div className="row d-flex">
                          <div className="col-lg-12 ">
                            <div class="form-check custom-checkbox mb-3">
                              <label className="col-lg-4 " for={field.name}>{field.name}</label>
                              <input type={field.type} name={field.name} className="form-control" id={field.name}
                                {...formik.getFieldProps(field.name)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </> :



                      <div className="col-lg-6">
                        <div className="mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor={field.name}
                          >
                            {field.label}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-7">
                            <input
                              type="text"
                              className="form-control"
                              id={field.name}
                              placeholder={`Enter a ${field.label}`}
                              {...formik.getFieldProps(field.name)}
                              required=""
                            />
                            <div className="invalid-feedback">
                              Please enter a {field.label}
                            </div>
                            {formik.errors[field.name] &&
                              <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}

                          </div>
                        </div>
                      </div>


            }

          </>
        ))}

        <div className="form-group mb-0">
          <button className={`btn btn-primary  ${location.pathname === "resetpassword" ? "col-md-11" : ""}`} type="submit">
            {btn_name}
          </button>
        </div>

      </div >
    </form >

  );
};

export default ReusableForm;
