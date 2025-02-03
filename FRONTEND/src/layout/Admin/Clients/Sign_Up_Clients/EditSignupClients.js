import React, { useState } from "react";
import Theme_Content from "../../../../Components/Dashboard/Content/Theme_Content";
import Loader from "../../../../Utils/Loader";
import Formikform from "../../../../Components/ExtraComponents/Form/Formik_form";
import { useFormik } from "formik";

const EditSignupClient = () => {
  const [Addsubadmin, setAddsubadmin] = useState({
    loading: false,
    data: [],
  });

  const fields = [
    { name: "username", label: "Username", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "mobile", label: "Mobile", type: "text" },
    { name: "password", label: "Password", type: "password" },
  ];

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      mobile: "",
      password: "",
    },

    onSubmit: async (values) => {
      const req = {};
    },
  });

  return (
    <>
      {Addsubadmin.loading ? (
        <Loader />
      ) : (
        <>
          <Theme_Content
            Page_title="Edit Signup Clients"
            button_title="Back"
            route="/admin/signupclients"
          >
            <Formikform
              fieldtype={fields.filter((field) => !field.showWhen)}
              formik={formik}
              btn_name="Edit Signup Client"
            />
          </Theme_Content>
        </>
      )}
    </>
  );
};

export default EditSignupClient;
