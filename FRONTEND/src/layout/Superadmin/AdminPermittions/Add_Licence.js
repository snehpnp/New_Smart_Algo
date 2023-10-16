import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"

import { useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";
import { Add_Licence_To_Company } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'


const Add_Licence = ({ showModal, setshowModal, showPanelName }) => {
    const dispatch = useDispatch()


    const formik = useFormik({
        initialValues: {
            licence: null,


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
                "license": values.license,
                "db_url": showPanelName.db_url,
                "db_name": showPanelName.db_name,
                "key": showPanelName.key,
            }



            await dispatch(Add_Licence_To_Company(req)).unwrap().then((response) => {

                console.log("response", response)
                if (response.status === 409) {
                    // toast.error(response.data.msg);
                }
                else if (response.status) {
                    // toast.success(response.msg);
                    setTimeout(() => {
                        // navigate("/admin/allclients")
                    }, 1000);
                }
                else if (!response.status) {
                    // toast.error(response.msg);
                }

            })
        }
    });






    const fields = [
        { name: 'licence', label: 'Licence', type: 'text', label_size: 12, col_size: 12, disable: false },

    ];

    return (
        <div>   <Modal isOpen={showModal} size="sm" title="Increase Licence" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <h6 className='my-3'>You Are Increasing <b> {showPanelName.panel_name} </b>Licence</h6>
            <Formikform1 fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add Licence"
            />
        </Modal ></div>
    )
}

export default Add_Licence