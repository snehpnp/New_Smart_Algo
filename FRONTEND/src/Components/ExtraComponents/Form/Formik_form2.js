import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";



const ReusableForm = ({ initialValues, validationSchema, onSubmit, fromDate, isSelected, fieldtype, formik, btn_name, forlogin, title, label_size, col_size, disable, check_box_true, row_size, additional_field, showImagePreview, }) => {



  const location = useLocation()

  const [passwordVisible, setPasswordVisible] = useState({});



  const [previews, setPreviews] = useState([]); // Array to store individual previews

  const handleFileChange = (event, index, name) => {
    const file = event.target.files[0];
    const newPreviews = [...previews]; // Create a copy of the previews array

    newPreviews[index] = URL.createObjectURL(file); // Set the preview for the specific index
    setPreviews(newPreviews); // Update the previews array



    const reader = new FileReader();
    reader.onload = () => {
      //setPreviewImage(reader.result);
      formik.setFieldValue(name, reader.result); // Set Formik field value for the specific index
    };


    reader.readAsDataURL(file);
  }
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zeros if month or day is less than 10
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };






  return (


    // <Content Page_title="HelpCenter">
    <form onSubmit={formik.handleSubmit}>
      <div className='row' style={{ height: `${title === "addgroup" ? '65vh' : ""}`, overflowY: `${title === "addgroup" ? 'scroll' : ""}` }}>
        <div className={`row`}>
          {fieldtype.map((field, index) => (
            <>
              {field.type === 'select' ? <>
                <div className={`col-lg-${field.col_size}`}>
                  <div className="mb-1 row">
                    <label
                      className={`col-lg-${field.col_size}`}
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
                        disabled={field.disable}
                      >
                        <option value="" selected disable={field.disable}>
                          Please Select {field.label}
                        </option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}  >
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
                        <div className={`col-lg-${field.col_size}`} key={option.id}>
                          <div className="row d-flex">
                            <div className={`col-lg-${field.col_size}`}>
                              <div class="form-check custom-checkbox mb-3">
                                <input type={field.type} className="form-check-input" id={option.label}   {...formik.getFieldProps(option.name)}
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
                    <>
                      <div className={`col-lg-${field.col_size}`} >
                        <div className="row d-flex">
                          <div
                          //  className={`col-lg-${field.col_size}`}
                          >
                            <div class="form-check custom-checkbox mb-3">
                              <input type={field.type} className="form-check-input" id={field.label}   {...formik.getFieldProps(field.name)}
                                checked={field.check_box_true}
                              />
                              <label className="form-check-label" for={field.label} >{field.label}</label>
                            </div>
                            {formik.errors[field.name] &&
                              <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                          </div>
                        </div>
                      </div>
                    </>
                  }


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
                      <div className={`col-lg-${field.col_size}`}>
                        <div className="mb-3 row">
                          <label
                            className={`col-lg-${field.label_size} col-form-label `}
                            htmlFor={field.name}
                          >
                            {field.label}
                            <span className="text-danger">*</span>
                          </label>
                          <div
                            // className={`col-lg-${field.col_size}`}
                            style={{ position: 'relative' }}>

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

                                  min={field.name === "todate" ? fromDate : getCurrentDate()}
                                />
                              </div>
                              {formik.errors[field.name] &&
                                <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                            </div>
                          </div>
                        </div>
                      </> :
                        field.type === "msgbox" ? <>
                          <div className={`col-lg-${field.col_size}`}>
                            <div className="row d-flex">
                              <div
                              // className={`col-lg-${field.col_size}`}
                              >
                                <div class="mb-3">
                                  <label className={`col-lg-${field.label_size}`} for={field.name}>{field.label}</label>
                                  <textarea class="form-control" rows={field.row_size} id={field.name} name={field.name}
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

                                  <img src={formik.getFieldProps(field.name).value} name={field.name} id={field.name} alt={`Preview ${index}`} className="mb-3"

                                  />


                                </div>

                              </div>
                            </> :

                              <div className={`col-lg-${field.col_size}`}>
                                <div className="mb-3 row flex-column">
                                  <label
                                    className={`col-lg-${field.label_size}`}
                                    htmlFor={field.name}
                                  >
                                    {field.label}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div
                                  // className={`col-lg-${field.col_size}`}
                                  >
                                    <input
                                      type="text"
                                      className="form-control"
                                      style={{ background: field.disable ? '#eeeeee' : "" }}
                                      id={field.name}
                                      placeholder={`Enter ${field.label}`}
                                      {...formik.getFieldProps(field.name)}
                                      // required=""
                                      readOnly={field.disable}
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




        </div >
        {additional_field}

        <div className="form-group mb-0">
          <button className={`btn btn-primary  ${location.pathname === "resetpassword" ? "col-md-11" : ""}`} type="submit">
            {btn_name}
          </button>
        </div>
      </div>

    </form >

  );
};

export default ReusableForm;
