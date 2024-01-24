import React, { useEffect, useState } from 'react'
import Modal from '../../../Components/ExtraComponents/Modal';
import { GET_PANEL_INFORMATIONS } from '../../../ReduxStore/Slice/Superadmin/SuperAdminSlice'
import { useDispatch, useSelector } from "react-redux";



const LicenceDetails = ({ showModal, setshowModal, id }) => {

    const [showLicenceDetails, setshowLicenceDetails] = useState('')


    const dispatch = useDispatch()

    const data = async () => {

        if (showModal) {
            await dispatch(GET_PANEL_INFORMATIONS(id)).unwrap()
                .then((response) => {

                    if (response.status) {
                        setshowLicenceDetails(
                            response.data.totalCount
                        );
                    }
                })
        }
    }

    useEffect(() => {
        data()
    }, [id])

    return (
        <div>   <Modal isOpen={showModal} size="md" title="Licence Details" hideBtn={true}
            handleClose={() => setshowModal(false)}
        >

            <table className="table table-responsive-sm table-bordered ">
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
                        <td>{showLicenceDetails && showLicenceDetails.all_licence}</td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td>Used Licence</td>
                        <td>{showLicenceDetails && showLicenceDetails.used_licence}</td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td>Remaining Licence</td>
                        <td>{showLicenceDetails && showLicenceDetails.remaining_licence}</td>
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
            </table>



        </Modal ></div>
    )
}

export default LicenceDetails