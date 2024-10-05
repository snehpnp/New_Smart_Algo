/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form1";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Content from "../../../../Components/Dashboard/Content/Content";
import toast from "react-hot-toast";
import ToastButton from "../../../../Components/ExtraComponents/Alert_Toast";
import { Add_Plans } from "../../../../ReduxStore/Slice/Admin/GroupServiceSlice";

const AddStraegyNormal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

  const formik = useFormik({
    initialValues: {
      Name: "",
      Title: "",
      MonthlyPrice: "",
      QuarterlyPrice: "",
      HalfYearlyPrice: "",
      YearlyPrice: "",
      Description: "",
    },
    validate: (values) => {
      const errors = {};

      // Validating 'Name'
      if (!values.Name) {
        errors.Name = "Strategy Name is required";
      }

      // Validating 'Title'
      if (!values.Title) {
        errors.Title = "Strategy Title is required";
      }

      // Validating 'Description'
      if (!values.Description) {
        errors.Description = "Strategy Description is required";
      }

      // Validating 'MonthlyPrice'
      if (!values.MonthlyPrice) {
        errors.MonthlyPrice = "Monthly Price is required";
      } else if (isNaN(values.MonthlyPrice)) {
        errors.MonthlyPrice = "Monthly Price must be a number";
      }

      // Validating 'QuarterlyPrice'
      if (values.QuarterlyPrice && isNaN(values.QuarterlyPrice)) {
        errors.QuarterlyPrice = "Quarterly Price must be a number";
      }

      // Validating 'HalfYearlyPrice'
      if (values.HalfYearlyPrice && isNaN(values.HalfYearlyPrice)) {
        errors.HalfYearlyPrice = "Half-Yearly Price must be a number";
      }

      // Validating 'YearlyPrice'
      if (values.YearlyPrice && isNaN(values.YearlyPrice)) {
        errors.YearlyPrice = "Yearly Price must be a number";
      }

      return errors;
    },

    onSubmit: async (values) => {
      const req = {
        name: values.Name,
        title: values.Title,
        description: values.Description,
        image:"https://cdn.pixabay.com/photo/2024/05/31/05/24/trading-8799817_640.png",
        prices: {
          monthly: values.MonthlyPrice,
          quarterly: values.QuarterlyPrice,
          halfYearly: values.HalfYearlyPrice,
          yearly: values.YearlyPrice,
        },
      };

      await dispatch(Add_Plans({ req: req, token: AdminToken }))
        .unwrap()
        .then((response) => {
          if (response.status === 409) {
            toast.error(response.data.msg);
          } else if (response.status) {
            toast.success(response.msg);
            setTimeout(() => {
              navigate("/admin/plans");
            }, 1000);
          }
        });
    },
  });

  const fields = [
    {
      name: "Name",
      label: "Name",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "Title",
      label: "Title",
      type: "text",
      label_size: 12,
      col_size: 6,
      disable: false,
    },
    {
      name: "MonthlyPrice",
      label: "Monthly Price",
      type: "text",
      label_size: 12,
      col_size: 3,
      disable: false,
    },
    {
      name: "QuarterlyPrice",
      label: "Quarterly Price",
      type: "text",
      label_size: 12,
      col_size: 3,
      disable: false,
    },
    {
      name: "HalfYearlyPrice",
      label: "Half-Yearly Price",
      type: "text",
      label_size: 12,
      col_size: 3,
      disable: false,
    },
    {
      name: "YearlyPrice",
      label: "Yearly Price",
      type: "text",
      label_size: 6,
      col_size: 3,
      disable: false,
    },
    {
      name: "Description",
      label: "Description",
      type: "msgbox",
      row_size: 4,
      label_size: 6,
      col_size: 12,
      disable: false,
    },
  ];

  return (
    <>
      <Content Page_title="Add Plan" button_title="Back" route="/admin/plans">
        <Formikform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Add Plan"
          title="addplan"
          isDisabled={!formik.isValid || formik.isSubmitting}
        />
        <ToastButton />
      </Content>
    </>
  );
};

export default AddStraegyNormal;
