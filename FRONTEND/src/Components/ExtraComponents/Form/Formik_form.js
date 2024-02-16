import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";



const ReusableForm = ({ initialValues, validationSchema, onSubmit, btn_name_signUp, btn_name_login, fromDate, fieldtype, formik, btn_name, forlogin, title, additional_field }) => {



  const location = useLocation()
  const navigate = useNavigate()


  const [passwordVisible, setPasswordVisible] = useState({});


  const [previews, setPreviews] = useState([]);


  const handleFileChange = (event, index, name) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Preview = reader.result; // Get the base64 data URL
      const newPreviews = [...previews]; // Create a copy of the previews array

      newPreviews[index] = base64Preview; // Set the base64 preview for the specific index

      // Update the previews array
      setPreviews(newPreviews);
    };

    reader.readAsDataURL(file);
  }

  const sneh = (index, name) => {
  

  }

  const fun = () => {
    navigate('/newsignup')
  }
  const fun1 = () => {
    navigate('/login')
  }

  return (

    <form onSubmit={formik.handleSubmit}>
      <div className='row d-flex justify-content-center ' style={{ height: `${title === "addgroup" ? '65vh' : ""}`, overflowY: `${title === "addgroup" ? 'scroll' : ""}` }}>
        <div className={`row d-flex justify-content-center `}>
          {fieldtype.map((field, index) => (
            <>
              {field.type === 'select' ? <>
                <div className={`col-lg-${title === "update_theme" ? 12 : 6}`}>
                  <div className="mb-1 row">
                    <label
                      className={`col-lg-${title === "forlogin" ? 3 : title === "update_theme" ? 12 : 7}  col-form-label`}
                      htmlFor={field.name}
                    >
                      {field.label}
                      <span className="text-danger">*</span>
                    </label>
                    <div className={`col-lg-${title === "addgroup" ? 12 : 12}`}>
                      <select
                        className="default-select wide form-control"
                        id={field.name}
                        {...formik.getFieldProps(field.name)}
                      >
                        <option value="" selected disabled>
                          Please Select {field.label}
                        </option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value} s>
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
                 
                  {field.options && field.options.length > 0 ? <>
                    {field.options && field.options.map((option, index) => (
                      <>
                        <div className={`col-lg-${title === "addgroup" ? 2 : 3}`} key={option.id}>
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div class="form-check custom-checkbox mb-3">
                                <input type={field.type} className="form-check-input" id={option.label}   {...formik.getFieldProps(option.label)}
                                />
                                <label className="form-check-label" for={option.label} >{option.label}</label>
                              </div>
                              {formik.errors[field.name] &&
                                <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </> :
                    field.s === "toggle" ? <>
                      <div id="app-cover">
                        {/* <div class="row"> */}
                        <div class="toggle-button-cover">
                          <div class="button-cover">
                            <div class="button r" id="button-1">
                              <input type="checkbox" class="checkbox" />
                              <div class="knobs"></div>
                              <div class="layer"></div>
                              <label className="form-check-label" for={field.label} >{field.label}</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </div> */}
                    </> :

                      <>

                        <div className={`col-lg-${title === "addgroup" ? 2 : 3}`} key={field.id}>
                          <div className="row d-flex">
                            <div className="col-lg-12 ">
                              <div class="form-check custom-checkbox mb-3">
                                <input type={field.type} className="form-check-input" id={field.label}   {...formik.getFieldProps(field.label)}
                                />
                                <label className="form-check-label" for={field.label} >{field.label}</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                  }


                </> :

                  field.type === "radio" ? <>
                    {field.index === '1' ? <>
                      
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
                    field.type === "password" && title === "forlogin1" ? <>
                      <div className={`  col-lg-${title === "forlogin1" ? 12 : title === "forUpdatePassword" ? 12 : 6} `}>
                        <div className="mb-3 d-flex justify-content-center row">
                          <label
                            className={`col-lg-${title === "forlogin1" ? 12 : title === "forUpdatePassword" ? 7 : 4} col-form-label `}
                            htmlFor={field.name}
                          >
                            {field.label}
                            <span className="text-danger">*</span>
                          </label>
                          <div className={`col-lg-${title === "forlogin1" ? 12 : title === "forUpdatePassword" ? 12 : 7} `} style={{ position: 'relative' }}>

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
                            {formik.errors[field.name] &&
                              <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                          </div>

                        </div>
                      </div>

                    </> :
                      field.type === "password" && title === "forlogin" ? <>
                        <div className={`col-lg-${title === "forlogin" ? 12 : title === "forUpdatePassword" ? 12 : 6} `}>
                          <div className="mb-3 row">
                            <label
                              className={`col-lg-${title === "forlogin" ? 3 : title === "forUpdatePassword" ? 7 : 4} col-form-label `}
                              htmlFor={field.name}
                            >
                              {field.label}
                              <span className="text-danger">*</span>
                            </label>
                            <div className={`col-lg-${title === "forlogin" ? 8 : title === "forUpdatePassword" ? 12 : 7} `} style={{ position: 'relative' }}>

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
                              {formik.errors[field.name] &&
                                <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                            </div>

                          </div>
                        </div>

                      </> :
                        field.type === "date" ? <>
                          <div className="col-lg-3">
                            <div className="row d-flex">
                              <div className="col-lg-12 ">
                                <div class="form-check custom-checkbox mb-3">
                                  <label className="col-lg-6 " for={field.name}>{field.name}</label>
                                  <input type={field.type} name={field.name} className="form-control" id={field.name}
                                    {...formik.getFieldProps(field.name)}

                                    min={field.name === "todate" ? fromDate : field.name}
                                  />
                                </div>
                                {formik.errors[field.name] &&
                                  <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                              </div>
                            </div>
                          </div>
                        </> :
                          field.type === "msgbox" ? <>
                            <div className="col-lg-12">
                              <div className="row d-flex">
                                <div className="col-lg-12 ">
                                  <div class="mb-3">
                                    <label className="col-lg-4 " for={field.name}>{field.label}</label>
                                    <textarea class="form-control" rows="2" id={field.name} name={field.name}
                                      {...formik.getFieldProps(field.name)}
                                      placeholder={field.label}
                                    ></textarea>
                                    {formik.errors[field.name] &&
                                      <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                                  </div>

                                </div>

                              </div>
                            </div>
                          </> :

                            field.type === "test" ? <>
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


field.type === "number" ? (
  <div className="col-lg-3">
    <div className="row d-flex">
      <div className="col-lg-12 ">
        <div className="form-group mb-3">
          <label htmlFor={field.name}>{field.name}</label>
          <input
            type="number"
            name={field.name}
            className="form-control"
            id={field.name}
            {...formik.getFieldProps(field.name)}
          />
        </div>
      </div>
    </div>
  </div>
) : 




                              field.type === "file" ? <>
                                <div className="col-lg-6">
                                  <div className="row d-flex">
                                    <div className={`col-lg-${title === "addgroup" ? 6 : 12}`}>
                                      <div className="mb-3">
                                        <label className={`col-form-label`} htmlFor={field.name}>
                                          {field.label}
                                          <span className="text-danger">*</span>
                                        </label>
                                        <input
                                          type="file"
                                          id={field.name}
                                          onChange={(e) => handleFileChange(e, index, field.name)} // Pass the index to the handler
                                          className={`form-control`}
                                        />
                                      </div>
                                    </div>
                                    <img src={previews[index] ? previews[index] : sneh(index, field.name)} name={field.name} alt={`Preview_${index}`} className="mb-3" />
                                  </div>
                                </div>
                              </> :
                                title === "forlogin1" ?

                                  <div className={`col-lg-${title === "forlogin1" || title === "brokerkey" ? 12 : title === "forResetPassword" ? 12 : title === "forUpdatePassword" ? 12 : 6} `}>
                                    <div className="mb-3 d-flex justify-content-center row">
                                      <label
                                        className={`col-lg-${title === "forlogin1" ? 12 : title === "brokerkey" ? 6 : 4} col-form-label `}
                                        htmlFor={field.name}
                                      >
                                        {field.label}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <div className={`col-lg-${title === "forlogin1" ? 12 : title === "forResetPassword" || "forUpdatePassword" ? 12 : 7} `}>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id={field.name}
                                          placeholder={`Enter ${field.label}`}
                                          {...formik.getFieldProps(field.name)}
                                          required=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter {field.label}
                                        </div>
                                        {formik.errors[field.name] &&
                                          <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}

                                      </div>
                                    </div>

                                  </div>
                                  :
                                  <div className={`col-lg-${title === "forlogin" || title === "brokerkey" ? 12 : title === "forResetPassword" ? 12 : title === "forUpdatePassword" ? 12 : 6} `}>
                                    <div className="mb-3 row">
                                      <label
                                        className={`col-lg-${title === "forlogin" ? 3 : title === "brokerkey" ? 6 : 4} col-form-label `}
                                        htmlFor={field.name}
                                      >
                                        {field.label}
                                        <span className="text-danger">*</span>
                                      </label>
                                      <div className={`col-lg-${title === "forlogin" ? 8 : title === "forResetPassword" || "forUpdatePassword" ? 12 : 7} `}>
                                        <input
                                          type="text"
                                          className="form-control"
                                          id={field.name}
                                          placeholder={`Enter ${field.label}`}
                                          {...formik.getFieldProps(field.name)}
                                          required=""
                                        />
                                        <div className="invalid-feedback">
                                          Please enter {field.label}
                                        </div>
                                        {formik.errors[field.name] &&
                                          <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}

                                      </div>
                                    </div>

                                  </div>

              }

            </>
          ))}

          {additional_field}

          <div className="form-group mb-0">
            {btn_name == 'Sign In' ?
              < >
                <button className={`btn btn-primary col-lg-12 btn-rounded ${location.pathname === "resetpassword" ? "col-md-11" : ""}`} type="submit">
                  {btn_name}
                </button>
              </ > : <>
                <button className={`btn btn-primary col-lg-12 btn-rounded ${location.pathname === "resetpassword" ? "col-md-11" : ""}`} type="submit">
                  {btn_name}
                </button>
              </>
            }
          </div>
        </div>
      </div >
    </form>

  );
};

export default ReusableForm;
