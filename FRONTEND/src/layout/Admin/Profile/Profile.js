import React from "react";
import Profile_theme from "../../../Components/Dashboard/Content/Profile_theme";
import { useFormik } from 'formik';
import Formikform from "../../../../src/Components/ExtraComponents/Form/Formik_form"
// import * as  valid_err from "../../../Utils/Common_Messages "Components/ExtraComponents/Form/Formik_form


const Profile = () =>{
    const fields = [
        { name: 'oldPassword', label: 'Old Password', type: 'password' },
        { name: 'newPassword', label: 'New Password', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
    ]
    const formik = useFormik({
        initialValues: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',    
        },
        validate: (values) => {
          const errors = {};
          if (!values.oldPassword) {
            // return("Old Password");
          }
          if (!values.newPassword) {
            // return("Old Password");
          }
          if (!values.confirmPassword) {
            // return("Old Password");
          }     
          return errors;
        },
        onSubmit: async (values) => {
    
          const req = {
 
          }
    
        }
      });
    
    return(
        <>
        <Profile_theme >
        <Formikform fieldtype={fields.filter(field => !field.showWhen )} formik={formik} btn_name="Submit" />
        </Profile_theme>
        </>
    )
}
export default Profile;