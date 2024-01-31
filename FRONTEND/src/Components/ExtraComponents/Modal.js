import React from 'react'
import { Modal, Button } from 'react-bootstrap';



const Modal_Component = ({ isOpen, handleClose, Submit_Function, Submit_Function_2, disabled_submit, Submit_Cancel_Function, cancel_btn, title, btn_name, btn_2, btn_name_2, backdrop, size, hideBtn, ...rest }) => {


     
    return (
        <div>
            <Modal show={isOpen} centered size={size} backdrop={backdrop} onHide={handleClose}>
                <Modal.Header closeButton className={`${title === "Verify OTP" ? 'border-0' : ""}`}  >
                    <Modal.Title  >{title}</Modal.Title >
                </Modal.Header>
                <Modal.Body>{rest.children}</Modal.Body>
                <Modal.Footer className={`${title === "Verify OTP" ? 'border-0' : ""}`}>

                    {cancel_btn ?
                        <button type="submit" className="btn btn-danger " onClick={() => Submit_Cancel_Function()}>
                            Cancel
                        </button> : ""}


                    {hideBtn === true ? "" :
                        <Button type="submit" className="btn btn-primary " disabled={disabled_submit} onClick={()=> Submit_Function()}>
                            {btn_name}
                        </Button>}



                    {btn_2 === true ?
                        <Button type="submit" className="btn btn-primary " disabled={disabled_submit} onClick={() => Submit_Function_2()}>
                            {btn_name_2}
                        </Button> : ""
                    }

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Modal_Component