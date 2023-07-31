import React from 'react'
import { Modal, Button } from 'react-bootstrap';


const Modal_Component = ({ isOpen, handleClose , Submit_Function, title,  btn_name  , backdrop , size , ...rest}) => {
    return (
        <div>
            <Modal show={isOpen} handleClose={!handleClose} centered size={size} backdrop={backdrop}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{rest.children}</Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-primary" onClick={Submit_Function}>
                        {btn_name}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Modal_Component