import React, { useState } from 'react';
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import * as valid_err from '../../../Utils/Common_Messages';
import Formikform1 from '../../../Components/ExtraComponents/Form/Formik_form1';
import { useNavigate } from 'react-router-dom';
import { Email_regex, Mobile_regex } from '../../../Utils/Common_regex';
import { useDispatch, useSelector } from 'react-redux';
import { Adjust_Month_To_Company } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice';
import toast from 'react-hot-toast';
import ToastButton from '../../../Components/ExtraComponents/Alert_Toast';

const Adjust_Month = ({ showModal, setshowModal, showPanelName }) => {

  const dispatch = useDispatch();
  const SuperAdmin_Email = JSON.parse(localStorage.getItem('user_details')).Email;

  const formik = useFormik({
    initialValues: {
      month: null,
    },
    validate: (values) => {
      const errors = {};
      if (!values.month) {
        errors.month = valid_err.USERNAME_ERROR;
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      const req = {
        month: values.month,
        db_url: showPanelName.db_url,
        db_name: showPanelName.db_name,
        key: showPanelName.key,
        id: showPanelName.id,
        Name: SuperAdmin_Email.split('@')[0],
      };

      try {
        
        const response = await dispatch(Adjust_Month_To_Company(req)).unwrap();
        if (response.status === false) {
          toast.error(response.msg);
        } else if (response.status) {
          toast.success(response.msg);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else if (!response.status) {
          toast.error(response.msg);
        }
      } catch (error) {
   
        toast.error('Failed to add month. Please try again.');
      } finally {
        setSubmitting(false); // Reset submitting state regardless of success or failure
      }
    },
  });

  const fields = [{ name: 'month', label: 'Month', type: 'text', label_size: 12, col_size: 12, disable: false }];

  return (
    <div>
      <Modal
        isOpen={showModal}
        size="md"
        title="Adjust Month"
        hideBtn={true}
        handleClose={() => setshowModal(false)}
      >
        <h6 className="my-3">You Are Adjust Month <b>{showPanelName.panel_name}</b></h6>
        <Formikform1
          fieldtype={fields.filter((field) => !field.showWhen || field.showWhen(formik.values))}
          formik={formik}
          btn_name="Adjust Month"
          disabled={formik.isSubmitting}
        />
      </Modal>
      <ToastButton />
    </div>
  );
};

export default Adjust_Month;
