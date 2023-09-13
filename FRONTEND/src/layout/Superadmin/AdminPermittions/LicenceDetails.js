import React from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';

const LicenceDetails = ({ showModal, setshowModal }) => {

    return (
        <div>   <Modal isOpen={showModal} size="md" title="Licence Details" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >

            <table className="table table-responsive-sm ">
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
                        <td>Total Licence</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td>Used Licence</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td>Remaining Licence</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <th>4</th>
                        <td>Active Live Account</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <th>5</th>
                        <td>Expired Live Account</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <th>6</th>
                        <td>Total Demo Account</td>
                        <td>100</td>
                    </tr>           <tr>
                        <th>7</th>
                        <td>Active Demo Account</td>
                        <td>100</td>
                    </tr>           <tr>
                        <th>8</th>
                        <td>Expired Demo Account</td>
                        <td>100</td>
                    </tr>

                </tbody>
            </table>



        </Modal ></div>
    )
}

export default LicenceDetails