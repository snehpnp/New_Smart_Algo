/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modify_Details } from '../../../ReduxStore/Slice/Users/BrokerUpdateSlice';
import { useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';

import ToastButton from "../../../Components/ExtraComponents/Alert_Toast";


const Modify = ({ UserDetails }) => {



useEffect(() => {
    data()
}, [UserDetails])

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

       
    };


    // GET ALL GROUP SERVICES NAME
    const data = async () => {
        if (UserDetails !== undefined) {
            setSelectedOptions({
                web_url: UserDetails && UserDetails.web_url,
                // qty_type: UserDetails.data && UserDetails.data.qty_type,
                signals_execution_type: UserDetails && UserDetails.signals_execution_type,
            })
        }


    }






    return (
        <div>
            <div className="row d-flex">
                <div className="my-2">
                    <h4>Web Login</h4>
                    <div className="d-flex">
                        <div className="col-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="web_url"
                                    id="admin"
                                    value="1" // Set the actual value here
                                    checked={selectedOptions && selectedOptions.web_url === "1"}
                                    onChange={(e) => handleRadioChange(e)}
                                    disabled={isgotodashboard}
                                />
                                <label className="form-check-label" htmlFor="admin">
                                    Admin
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="web_url"
                                    id="admin"
                                    disabled={isgotodashboard}

                                    value="2" // Set the actual value here
                                    checked={selectedOptions && selectedOptions.web_url === "2"}
                                    onChange={(e) => handleRadioChange(e)}
                                />
                                <label className="form-check-label" htmlFor="individual">
                                    Individual
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
               
                <div className="my-2">
                    <h4>Signals Execution Type</h4>
                    <div className="d-flex mt-2">
                        <div className="col-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input font"
                                    type="radio"
                                    name="signals_execution_type"
                                    id="webExecution"
                                    value='1'
                                    disabled={isgotodashboard}

                                    checked={selectedOptions && selectedOptions.signals_execution_type === "1"}

                                    onChange={(e) => handleRadioChange(e)}

                                />
                                <label className="form-check-label" htmlFor="webExecution">
                                    Web
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="signals_execution_type"
                                    id="appExecution"
                                    value='2'
                                    disabled={isgotodashboard}

                                    checked={selectedOptions && selectedOptions.signals_execution_type === "2"}

                                    onChange={(e) => handleRadioChange(e)}
                                />
                                <label className="form-check-label" htmlFor="appExecution">
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
                <button className="btn btn-primary mt-3" onClick={handleFinalStep}
                
                disabled={isgotodashboard}
                
                >
                    Continue
                </button>
            )}

            <ToastButton />

        </div>
    );
};

export default Modify;
