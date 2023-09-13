import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';

const Sidebar_permission = ({showModal, setshowModal}) => {

    console.log("setshowModal" ,showModal);
    return (
        <div>   <Modal isOpen={showModal} backdrop="static" size="sm" title="
        Sidebar Permission   " hideBtn={true}
            handleClose={() => setshowModal(false)}
        >
            This Is Sidebar_permission Modal
            {/* <Formikform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update Theme"

            title="update_theme"
        /> */}
        </Modal ></div>
    )
}

export default Sidebar_permission