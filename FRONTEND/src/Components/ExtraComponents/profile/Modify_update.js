/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modify_Details } from '../../../ReduxStore/Slice/Users/BrokerUpdateSlice';
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const Modify = ({ UserDetails }) => {






    const dispatch = useDispatch();

    const user_id = JSON.parse(localStorage.getItem("user_details")).user_id;
    const AdminToken = JSON.parse(localStorage.getItem("user_details")).token;

    const user_role = JSON.parse(localStorage.getItem("user_role"));

    const gotodashboard = JSON.parse(localStorage.getItem('user_details_goTo'))
    const isgotodashboard = JSON.parse(localStorage.getItem('gotodashboard'))


    const [selectedOptions, setSelectedOptions] = useState({
        web_url: '',
        // qty_type: '',
        signals_execution_type: '',
    });




    const handleRadioChange = (e) => {
        let name = e.target.name
        let value = e.target.value
        let checked = e.target.checked

        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [name]: value,
        }));
    };

    const handleFinalStep = async () => {

        await dispatch(Modify_Details({ user_id: user_id, AdminToken: AdminToken, req: selectedOptions }))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    toast.success(response.msg);
                } else {
                    toast.error(response.msg);
                }
            });

        // Perform the final step with selected options
        // You can implement your logic here
    };


    // GET ALL GROUP SERVICES NAME
    const data = async () => {
        if (UserDetails.data !== undefined) {
            setSelectedOptions({
                web_url: UserDetails.data && UserDetails.data.web_url,
                // qty_type: UserDetails.data && UserDetails.data.qty_type,
                signals_execution_type: UserDetails.data && UserDetails.data.signals_execution_type,
            })
        }


    }


    useEffect(() => {
        data()
    }, [UserDetails.data])





    return (
        <div>
            <div className="row d-flex">
                <div className="my-2">
                    <h4>Web Login</h4>
                    <div className="d-flex">
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="web_url"
                                    id="admin"
                                    value="1" // Set the actual value here
                                    checked={selectedOptions && selectedOptions.web_url === "1"}
                                    onChange={(e) => handleRadioChange(e)}
                                />
                                <label class="form-check-label" for="admin">
                                    Admin
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="web_url"
                                    id="admin"
                                    value="2" // Set the actual value here
                                    checked={selectedOptions && selectedOptions.web_url === "2"}
                                    onChange={(e) => handleRadioChange(e)}
                                />
                                <label class="form-check-label" for="individual">
                                    Individual
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="my-2">
                    <h4>Qty Type</h4>
                    <div className="d-flex">
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="qty_type"
                                    id="adminQty"
                                    value='1'
                                    checked={selectedOptions && selectedOptions.qty_type === "1"}

                                    onChange={(e) => handleRadioChange(e)}

                                />
                                <label class="form-check-label" for="adminQty">
                                    Admin
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="qty_type"
                                    id="individualQty"
                                    value='2'
                                    checked={selectedOptions && selectedOptions.qty_type === "2"}


                                    onChange={(e) => handleRadioChange(e)}

                                />
                                <label class="form-check-label" for="individualQty">
                                    Individual
                                </label>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="my-2">
                    <h4>Signals Execution Type</h4>
                    <div className="d-flex mt-2">
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    class="form-check-input font"
                                    type="radio"
                                    name="signals_execution_type"
                                    id="webExecution"
                                    value='1'
                                    checked={selectedOptions && selectedOptions.signals_execution_type === "1"}

                                    onChange={(e) => handleRadioChange(e)}

                                />
                                <label class="form-check-label" for="webExecution">
                                    Web
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="signals_execution_type"
                                    id="appExecution"
                                    value='2'
                                    checked={selectedOptions && selectedOptions.signals_execution_type === "2"}

                                    onChange={(e) => handleRadioChange(e)}
                                />
                                <label class="form-check-label" for="appExecution">
                                    App
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {gotodashboard ? (
                ""
            ) : (
                <button className="btn btn-primary mt-3" onClick={handleFinalStep}>
                    Continue
                </button>
            )}

            <ToastButton />

        </div>
    );
};

export default Modify;
