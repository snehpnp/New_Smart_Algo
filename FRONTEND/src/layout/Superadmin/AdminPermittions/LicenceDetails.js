import React, { useEffect, useState } from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';


import axios from 'axios';


const LicenceDetails = ({ showModal, setshowModal, id }) => {

    const [showLicenceDetails, setshowLicenceDetails] = useState('')


    const data = async () => {

        if (showModal) {

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: id.db_url + 'get/dashboard/count',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (response.status) {
                        setshowLicenceDetails(
                            response.data.totalCount
                        );
                    }
                })
                .catch((error) => {
                    return;
                });



        }
    }

    useEffect(() => {
        data()
    }, [id])

    return (
        <div>
            <Modal isOpen={showModal} size="md" title="Licence Details" hideBtn={true}
                handleClose={() => setshowModal(false)}
            >

                {showLicenceDetails && (<table className="table table-responsive-sm table-bordered ">
                    <thead className='bg-primary'>
                        <tr className='p-0'>
                            <th>#</th>
                            <th>Name</th>
                            <th>Status</th>

                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <th>1</th>
                            <td>Total Licence</td>
                            <td>{showLicenceDetails && showLicenceDetails.all_licence || 0}</td>
                        </tr>
                        <tr>
                            <th>2</th>
                            <td>Used Licence</td>
                            <td>{showLicenceDetails && showLicenceDetails.used_licence}</td>
                        </tr>
                        <tr>
                            <th>3</th>
                            <td>Remaining Licence</td>
                            <td>{showLicenceDetails && showLicenceDetails.remaining_licence || 0}</td>
                        </tr>
                        <tr>
                            <th>4</th>
                            <td>Total Live Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_live_client}</td>
                        </tr>
                        <tr>
                            <th>5</th>
                            <td>Active Live Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_active_live}</td>
                        </tr>
                        <tr>
                            <th>6</th>
                            <td>Expired Live Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_expired_live}</td>
                        </tr>
                        <tr>
                            <th>7</th>
                            <td>Total Demo Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_demo_client}</td>
                        </tr>           <tr>
                            <th>8</th>
                            <td>Active Demo Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_active_demo}</td>
                        </tr>           <tr>
                            <th>9</th>
                            <td>Expired Demo Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_expired_demo}</td>
                        </tr>
                        <tr>
                            <th>10</th>
                            <td>Total 2'Days Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_two_days}</td>
                        </tr>           <tr>
                            <th>11</th>
                            <td>Active 2'Days Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_active_two_days}</td>
                        </tr>           <tr>
                            <th>12</th>
                            <td>Expired 2'Days Account</td>
                            <td>{showLicenceDetails && showLicenceDetails.total_expired_two_days}</td>
                        </tr>

                    </tbody>
                </table>)
                }


            </Modal >
        </div>
    )
}

export default LicenceDetails