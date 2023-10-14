import React, { useState } from "react";

const RadioButtons = () => {
    const [selectedOptions, setSelectedOptions] = useState({
        webLogin: null,
        qtyType: null,
        signalsExecutionType: null,
    });

    const handleRadioChange = (e) => {
        let name = e.target.name
        let value = e.target.value

        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [name]: value,
        }));
    };

    const handleFinalStep = () => {
        // Perform the final step with selected options
        console.log("Selected Options:", selectedOptions);
        // You can implement your logic here
    };

    return (
        <div>
            <div className="row d-flex">
                <div className="my-2">
                    <h4>Web Login</h4>
                    <div className="d-flex">
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="webLogin"
                                    id="admin"
                                    value={1}
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
                                    class="form-check-input"
                                    type="radio"
                                    name="webLogin"
                                    id="individual"
                                    value={2}
                                    onChange={(e) => handleRadioChange(e)}

                                />
                                <label class="form-check-label" for="individual">
                                    Individual
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-2">
                    <h4>Qty Type</h4>
                    <div className="d-flex">
                        <div className="col-6">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    name="qtyType"
                                    id="adminQty"
                                    value={1}

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
                                    name="qtyType"
                                    id="individualQty"
                                    value={2}

                                    onChange={(e) => handleRadioChange(e)}

                                />
                                <label class="form-check-label" for="individualQty">
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
                            <div class="form-check">
                                <input
                                    class="form-check-input font"
                                    type="radio"
                                    name="signalsExecutionType"
                                    id="webExecution"
                                    value={1}
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
                                    name="signalsExecutionType"
                                    id="appExecution"
                                    value={2}
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

            <button className="btn btn-primary mt-3" onClick={handleFinalStep}>
                Continue
            </button>
        </div>
    );
};

export default RadioButtons;
