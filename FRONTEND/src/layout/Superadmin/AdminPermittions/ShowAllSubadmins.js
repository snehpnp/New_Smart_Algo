import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';

const ShowAllSubadmins = ({ showModal, setshowModal }) => {
    return (
        <div>
            <Modal isOpen={showModal} backdrop="static" title="Show All Subadmins" hideBtn={true}
                handleClose={() => setshowModal(false)}>
            </Modal>
        </div>
    )
}

export default ShowAllSubadmins