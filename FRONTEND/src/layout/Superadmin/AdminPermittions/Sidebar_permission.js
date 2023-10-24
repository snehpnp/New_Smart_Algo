import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { useFormik } from 'formik';
import Formikform from "../../../Components/ExtraComponents/Form/Formik_form1"
import { useDispatch } from "react-redux";
import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";
import { Update_Admin_Permissions } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import toast from 'react-hot-toast';


const Sidebar_permission = ({ showModal, setshowModal, showPanelName }) => {
    const dispatch = useDispatch()

    const token = JSON.parse(localStorage.getItem('user_details')).token



    const formik = useFormik({
        initialValues: {
            optionchain: false,
            createstrategy: false,
            tradhistory: false,
        },
        validate: (values) => {

            const errors = {};
            if (!values.username) {
                // errors.username = valid_err.USERNAME_ERROR;
            }


            return errors;
        },
        onSubmit: async (values) => {
            const req = {
                "Option_chain": values.optionchain ? 1 : 0,
                "Create_Strategy": values.createstrategy ? 1 : 0,
                "Trade_History": values.tradhistory ? 1 : 0,
                "db_url": showPanelName.db_url,
                "db_name": showPanelName.db_name,
                "key": showPanelName.key,
            }
            console.log("req", req)


            await dispatch(Update_Admin_Permissions({ req: req, token: token })).unwrap().then((response) => {

                if (response.status === 409) {
                    toast.error(response.data.msg);
                }
                else if (response.status) {
                    toast.success(response.msg);
                }
                else if (!response.status) {
                    toast.error(response.msg);
                }

            })
        }

    });



    const fields = [
        { name: 'optionchain', label: 'Option Chain', type: 'checkbox', label_size: 12, col_size: 6, disable: false },
        { name: 'createstrategy', label: 'Create Strategy', type: 'checkbox', label_size: 12, col_size: 6, disable: false },
        { name: 'tradhistory', label: 'TradHistory', type: 'checkbox', label_size: 12, col_size: 6, disable: false },
    ]

    return (
        <div>   <Modal isOpen={showModal} backdrop="static" size="md" title="
        Sidebar Permission" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
                title="Update"
            />


        </Modal >
            <ToastButton />
        </div>
    )
}

export default Sidebar_permission