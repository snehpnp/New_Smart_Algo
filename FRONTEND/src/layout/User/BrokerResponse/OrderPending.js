import React from "react";
import Modal from "../../../Components/ExtraComponents/Modal";
import { useFormik } from "formik";
import * as valid_err from "../../../Utils/Common_Messages";

const PendingOrder = ({ showModal, setshowModal }) => {
  const formik = useFormik({
    initialValues: {
      licence: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.licence) {
        errors.licence = valid_err.USERNAME_ERROR;
      }
      return errors;
    },
    onSubmit: async (values) => {
      const req = {
        licence: values.licence,
      };
      console.log("Form Submitted:", req);
    },
  });

  return (
    <Modal
      isOpen={showModal}
      size="lg"
      hideClose={true}
      title={
        <div className="row">
          <div className="col-12">
            <h5>RPOWER</h5>
          </div>

          <div className="col-6">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label
                className="form-check-label"
                htmlFor="flexRadioDefault1"
              >
                Default radio
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />
              <label
                className="form-check-label"
                htmlFor="flexRadioDefault2"
              >
                Default radio
              </label>
            </div>
          </div>
          <div className="col-6"></div>
        </div>
      }
      hideBtn={true}
      handleClose={() => setshowModal(false)}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-12">
            <label htmlFor="licence" className="form-label">
              Licence
            </label>
            <input
              type="text"
              id="licence"
              name="licence"
              className={`form-control ${
                formik.errors.licence ? "is-invalid" : ""
              }`}
              onChange={formik.handleChange}
              value={formik.values.licence}
              disabled
            />
            {formik.errors.licence && (
              <div className="invalid-feedback">{formik.errors.licence}</div>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formik.isValid}
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PendingOrder;
