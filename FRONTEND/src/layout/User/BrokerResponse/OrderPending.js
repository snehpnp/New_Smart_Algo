import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import * as  valid_err from "../../../Utils/Common_Messages"
import Formikform1 from "../../../Components/ExtraComponents/Form/Formik_form1"

import { useNavigate } from "react-router-dom";
import { Email_regex, Mobile_regex } from "../../../Utils/Common_regex"
import { useDispatch, useSelector } from "react-redux";

const PendingOrder = ({ showModal, setshowModal, showPanelName }) => {

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
                "licence": values.licence,
            }

            // return

            //   await dispatch(Add_User({ req: req, token: user_token })).unwrap().then((response) => {

            //     if (response.status === 409) {
            //       toast.error(response.data.msg);
            //     }
            //     else if (response.status) {
            //       toast.success(response.msg);
            //       setTimeout(() => {
            //         navigate("/admin/allclients")
            //       }, 1000);
            //     }
            //     else if (!response.status) {
            //       toast.error(response.msg);
            //     }

            //   })
        }
    });






    const fields = [
        { name: 'licence', label: 'Licence', type: 'text', label_size: 12, col_size: 12, disable: true },

    ];

    return (
        <div>   <Modal isOpen={showModal} size="lg" hideClose={true} title={
            <>

                <div className="row">
                    <div className="col-12">
                        <h5>RPOWER</h5>
                    </div>

                    <div className="col-6">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                            <label class="form-check-label" for="flexRadioDefault1">
                                Default radio
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                            <label class="form-check-label" for="flexRadioDefault2">
                                Default  radio
                            </label>
                        </div>
                    </div>
                    <div className="col-6">

                    </div>
                </div>
            </>




        } hideBtn={true}
            handleClose={() => setshowModal(false)}
        >


        </Modal ></div>
    )
}

export default PendingOrder