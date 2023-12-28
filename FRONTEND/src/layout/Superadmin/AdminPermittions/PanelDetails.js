import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';

const PanelDetails = ({ showModal, data, setshowModal }) => {

    return (
        <div>
            <Modal isOpen={showModal} size="md" title="Panel Details" hideBtn={true}
                handleClose={() => setshowModal(false)} >

                <table className="table table-responsive-sm  table-bordered">
                    <thead className='bg-primary'>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>1</th>
                            <td>TOTAL LICENCE</td>
                            <td >{data && data.data.licenses} </td>
                        </tr>
                        <tr>
                            <th>2</th>
                            <td>Maintenance Charges</td>
                            <td >
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Amount" />

                            </td>
                        </tr>
                        <tr>
                            <th>3</th>
                            <td>Licence ID Charges</td>
                            <td >
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Amount" />

                            </td>
                        </tr>
                        <tr>
                            <th>4</th>
                            <td>Licence ID Charges</td>
                            <td >
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Amount" />
                            </td>
                        </tr>
                        <tr>
                            <th>5</th>
                            <td>Current Pending</td>
                            <td >
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Amount" />

                            </td>
                        </tr>
                        <tr>
                            <th>6</th>
                            <td>Received</td>
                            <td >
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Amount" />
                            </td>
                        </tr>

                    </tbody>
                </table>
                <button className='btn btn-primary'>
                    Update
                </button>

            </Modal ></div>
    )
}

export default PanelDetails