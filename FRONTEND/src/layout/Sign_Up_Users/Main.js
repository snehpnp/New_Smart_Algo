import React from 'react'
import FormWizard from "react-form-wizard-component";
import 'react-form-wizard-component/dist/style.css';
const Main = () => {

    const handleComplete = () => {
        console.log("Form completed!");
        // Handle form completion logic here
    };
    const tabChanged = ({
        prevIndex,
        nextIndex,
    }) => {
        console.log("prevIndex", prevIndex);
        console.log("nextIndex", nextIndex);
    };



    return (
        <div> <div class="vh-100">
            <div className="authincation h-100">
                <div className="container h-100">
                    <div className="row justify-content-center h-100 align-items-center">
                        <div className="col-md-12">
                            <div className="authincation-content">
                                <div className="row no-gutters">
                                    <div className="col-xl-12">
                                        <div className="auth-form">
                                            <div className="text-center mb-3">
                                                <a href="#a"> logo </a>
                                            </div>
                                            <h4 className="text-center mb-4">Sign-Up  your account</h4>

                                            <FormWizard
                                                shape="circle"
                                                color="#e74c3c"
                                                onComplete={handleComplete}
                                                onTabChange={tabChanged}
                                            >
                                                <FormWizard.TabContent title="Personal details" icon="ti-user">
                                                    {/* Add your form inputs and components for the frst step */}
                                                    <h1>First Tab</h1>
                                                    <p>Some content for the first tab</p>
                                                </FormWizard.TabContent>
                                                <FormWizard.TabContent title="Additional Info" icon="ti-settings">
                                                    <h1>Second Tab</h1>
                                                    <p>Some content for the second tab</p>
                                                </FormWizard.TabContent>
                                                <FormWizard.TabContent title="Last step" icon="ti-check">
                                                    <h1>Last Tab</h1>
                                                    <p>Some content for the last tab</p>
                                                </FormWizard.TabContent>
                                                <FormWizard.TabContent title="Last step" icon="ti-check">
                                                    <h1>Last Tab</h1>
                                                    <p>Some content for the last tab</p>
                                                </FormWizard.TabContent>
                                                <FormWizard.TabContent title="Last step" icon="ti-check">
                                                    <h1>Last Tab</h1>
                                                    <p>Some content for the last tab</p>
                                                </FormWizard.TabContent>
                                            </FormWizard>
                                            {/* add style */}


                                            {/* <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style> */}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div ></div >
    )
}

export default Main