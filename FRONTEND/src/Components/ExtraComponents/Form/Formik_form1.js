import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ReusableForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  fromDate,
  isSelected,
  fieldtype,
  formik,
  btn_name,
  forlogin,
  title,
  label_size,
  col_size,
  disable,
  check_box_true,
  row_size,
  additional_field,
  showImagePreview,
  placeholderdata,
  disabled,
  LastUSerName,
  removebtn,
  hidebtn
}) => {
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState({});
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (event, index, name) => {
    if (event.target.files[0].size > 420000) {
      alert("Please  Select file less then 420KB");
      event.target.value = "";
      return;
    } else {
      const file = event.target.files[0];
      const newPreviews = [...previews];

      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);

      const reader = new FileReader();
      reader.onload = () => {
        formik.setFieldValue(name, reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  };

  const Removeimg = () => {
    formik.setFieldValue("logo", "");
    formik.setFieldValue("favicon", "");
    formik.setFieldValue("watermark", "");
    formik.setFieldValue("loginimg", "");
    setPreviews([]);
  };

  var GetThemeId = JSON.parse(localStorage.getItem("theme"));

  useEffect(() => {
    if (GetThemeId.themeId == 19) {
      const elements = document.getElementsByTagName("label");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = "White";
      }

      const elements1 = document.getElementsByTagName("select");
      for (let i = 0; i < elements1.length; i++) {
        elements1[i].style.background = "black";
        elements1[i].style.color = "white";
      }

      const elements2 = document.getElementsByTagName("input");
      for (let i = 0; i < elements2.length; i++) {
        elements2[i].style.background = "black";
        elements2[i].style.color = "white";
      }
    }
  }, [GetThemeId.themeId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div
        className="row"
        style={{
          height: `${title === "addgroup" ? "65vh" : ""}`,
          overflowY: `${title === "addgroup" ? "scroll" : ""}`,
        }}
      >
        <div className={`row`}>
          {fieldtype.map((field, index) => (
            <>
              {field.type === "lastusername" ? (
                <>
                  <div className=" row">
                    <h5>
                      Last Created User :- {LastUSerName ? LastUSerName : "-"}
                    </h5>
                  </div>
                </>
              ) : field.type === "select" ? (
                <>
                  <div
                    className={`col-lg-${title === "update_theme" ? 12 : 6}`}
                  >
                    <div className=" row">
                      <label
                        className={`col-lg-${
                          title === "forlogin"
                            ? 3
                            : title === "update_theme"
                            ? 12
                            : 7
                        }  col-form-label`}
                        htmlFor={field.name}
                      >
                        {field.label}
                        <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`col-lg-${title === "addgroup" ? 12 : 12}`}
                      >
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
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {field.name == "broker" &&
                          formik.values.broker == 7 && (
                            <div style={{ color: "red" }}>
                              You should save the mobile number which is
                              registered in the account of Kotak Neo in the
                              mobile number field.
                            </div>
                          )}

                        {formik.errors[field.name] && (
                          <div style={{ color: "red" }}>
                            {formik.errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "checkbox" ? (
                <>
                  {field.options && field.options.length > 0 ? (
                    <>
                      {field.options &&
                        field.options.map((option, index) => (
                          <>
                            <div
                              className={`col-lg-${field.col_size}`}
                              key={option.id}
                            >
                              <div className="row d-flex">
                                <div className={`col-lg-${field.col_size}`}>
                                  <div className="form-check custom-checkbox mb-3">
                                    <input
                                      type={field.type}
                                      className="form-check-input"
                                      id={option.label}
                                      {...formik.getFieldProps(option.name)}
                                    />
                                    <label
                                      className="form-check-label"
                                      for={option.label}
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                  {formik.errors[field.name] && (
                                    <div style={{ color: "red" }}>
                                      {formik.errors[field.name]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                    </>
                  ) : (
                    <>
                      <div className={`col-lg-${field.col_size}`}>
                        <div className="row d-flex">
                          <div
                          //  className={`col-lg-${field.col_size}`}
                          >
                            <div className="form-check custom-checkbox mb-3">
                              <input
                                type={field.type}
                                className="form-check-input"
                                id={field.label}
                                {...formik.getFieldProps(field.name)}
                                checked={field.check_box_true}
                              />
                              <label
                                className="form-check-label"
                                for={field.label}
                              >
                                {field.label}
                              </label>
                            </div>
                            {formik.errors[field.name] && (
                              <div style={{ color: "red" }}>
                                {formik.errors[field.name]}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : field.type === "radio" ? (
                <>
                  <label
                    className={`col-lg-${field.label_size} col-form-label fw-bold text-decoration-underline`}
                    htmlFor={field.parent_label}
                  >
                    {field.parent_label}
                  </label>

                  <div className={`d-flex`}>
                    <div
                      className={`col-lg-${field.col_size} form-check custom-checkbox my-3`}
                    >
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.value1}
                        className="form-check-input"
                        id={field.title1}
                        {...formik.getFieldProps(field.name)}
                      />
                      <label
                        className={`col-lg-${field.label_size} col-form-label mx-2`}
                        for={field.title1}
                      >
                        {field.title1}
                      </label>
                    </div>
                    <div
                      className={`col-lg-${field.col_size} form-check custom-checkbox my-3`}
                    >
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.value2}
                        className="form-check-input"
                        id={field.title2}
                        {...formik.getFieldProps(field.name)}
                      />
                      <label
                        className={`col-lg-${field.label_size} col-form-label  mx-2`}
                        for={field.name}
                      >
                        {field.title2}
                      </label>
                    </div>
                  </div>
                </>
              ) : field.type === "password" ? (
                <>
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
                        style={{ position: "relative" }}
                      >
                        <input
                          id={field.name}
                          type={
                            passwordVisible[field.name] ? "text" : field.type
                          }
                          placeholder={field.label}
                          {...formik.getFieldProps(field.name)}
                          className={` form-control`}
                        />
                        <i
                          className={`fa-solid ${
                            passwordVisible[field.name]
                              ? "fa-eye-slash"
                              : "fa-eye"
                          }`}
                          style={{
                            position: "absolute",
                            top: "1.5px",
                            right: "20px",
                            padding: "12.4px 6.6px",
                            borderRadius: "3px",
                          }}
                          onClick={() =>
                            setPasswordVisible((prevState) => ({
                              ...prevState,
                              [field.name]: !prevState[field.name],
                            }))
                          }
                        ></i>
                        {formik.errors[field.name] && (
                          <div style={{ color: "red" }}>
                            {formik.errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "date1" ? (
                <>
                  <div className="col-lg-3">
                    <div className="row d-flex">
                      <div className="col-lg-12 ">
                        <div className="form-check custom-checkbox mb-3">
                          <label className="col-lg-6 " for={field.name}>
                            {field.label}
                          </label>
                          <input
                            type="date"
                            name={field.name}
                            className="form-control"
                            id={field.name}
                            {...formik.getFieldProps(field.name)}
                            readOnly={field.disable}
                            // min={getCurrentDate()}

                            min={
                              field.name === "todate"
                                ? fromDate
                                : getCurrentDate()
                            }
                          />
                        </div>
                        {formik.errors[field.name] && (
                          <div style={{ color: "red" }}>
                            {formik.errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "date" ? (
                <>
                  <div className="col-lg-3">
                    <div className="row d-flex">
                      <div className="col-lg-12 ">
                        <div className="form-check custom-checkbox mb-3">
                          <label className="col-lg-6 " for={field.name}>
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            className="form-control"
                            id={field.name}
                            {...formik.getFieldProps(field.name)}
                            readOnly={field.disable}
                          />
                        </div>
                        {formik.errors[field.name] && (
                          <div style={{ color: "red" }}>
                            {formik.errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "msgbox" ? (
                <>
                  <div className={`col-lg-${field.col_size}`}>
                    <div className="row d-flex">
                      <div
                      // className={`col-lg-${field.col_size}`}
                      >
                        <div className="mb-3">
                          <label
                            className={`col-lg-${field.label_size}`}
                            for={field.name}
                          >
                            {field.label}
                          </label>
                          <textarea
                            className="form-control"
                            rows={field.row_size}
                            id={field.name}
                            name={field.name}
                            {...formik.getFieldProps(field.name)}
                            placeholder={field.label}
                          ></textarea>
                          {formik.errors[field.name] && (
                            <div style={{ color: "red" }}>
                              {formik.errors[field.name]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "test" ? (
                <>
                  <div className="col-lg-3">
                    <div className="row d-flex">
                      <div className="col-lg-12 ">
                        <div className="form-check custom-checkbox mb-3">
                          <input
                            type={field.type}
                            name={field.name}
                            className="form-check-input"
                            id={field.name}
                            {...formik.getFieldProps(field.name)}
                          />
                          <label className="form-check-label" for={field.name}>
                            {field.name}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "placeholder" ? (
                <>
                  <div className={`col-lg-${field.col_size}`}>
                    <div className="mb-3 row flex-column">
                      <label
                        className={`col-lg-${field.label_size}`}
                        htmlFor={field.name}
                      >
                        {field.label}
                        <span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          style={{ background: field.disable ? "#eeeeee" : "" }}
                          id={field.name}
                          placeholder={`Ex :- ${field.placeholderdata}`}
                          {...formik.getFieldProps(field.name)}
                          readOnly={field.disable}
                        />
                        <div className="invalid-feedback">
                          Please enter {field.label}
                        </div>
                        {formik.errors[field.name] && (
                          <div style={{ color: "red" }}>
                            {formik.errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : field.type === "file" ? (
                <>
                  <div className={`col-lg-${field.col_size}`}>
                    <div className="row d-flex">
                      {/* <div className={`col-lg-${field.col_size}`}> */}
                      <div className="mb-3">
                        <label
                          className={`col-form-${field.label_size}`}
                          htmlFor={field.name}
                        >
                          {field.label}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          id={field.name}
                          onChange={(e) =>
                            handleFileChange(e, index, field.name)
                          } // Pass the index to the handler
                          className={`form-control`}
                        />
                      </div>
                      <img
                        src={formik.getFieldProps(field.name).value}
                        name={field.name}
                        id={field.name}
                        alt={`Preview ${index}`}
                        className={`col-lg-11 ms-3
                                  // ${field.label_size}
                                   mb-3 border border-2`}
                        style={{
                          height: formik.getFieldProps(field.name).value
                            ? "150px"
                            : "",
                          width: "95%",
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`col-lg-${field.col_size}`}>
                    <div className="mb-3 row flex-column">
                      <label
                        className={`col-lg-${field.label_size}`}
                        htmlFor={field.name}
                      >
                        {field.label}
                        <span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          style={{ background: field.disable ? "#eeeeee" : "" }}
                          id={field.name}
                          placeholder={`Enter ${field.label}`}
                          {...formik.getFieldProps(field.name)}
                          readOnly={field.disable}
                        />
                        <div className="invalid-feedback">
                          Please enter {field.label}
                        </div>
                        {formik.errors[field.name] && (
                          <div style={{ color: "red" }}>
                            {formik.errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ))}
        </div>
        {additional_field}
        <div className="form-group row">
          {removebtn && (
            <a
              className="btn btn-primary col-md-6"
              type="button"
              onClick={Removeimg}
            >
              Remove Image
            </a>
          )}

         {hidebtn ? null: <button
            className={`btn btn-primary ${
              removebtn ? "col-md-6" : "col-md-2"
            } ${location.pathname === "resetpassword" ? "col-md-11" : ""}`}
            type="submit"
          >
            {btn_name}
          </button>}
        </div>
      </div>
    </form>
  );
};

export default ReusableForm;
