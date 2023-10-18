import React, { useState } from 'react'
import $ from "jquery";


const Logo = ({ ShowSidebar }) => {

    const [togglesidebar, settogglesidebar] = useState(false)
    const ShowSidebar123 = () => {
        settogglesidebar(!togglesidebar)

    }

    if (togglesidebar) {
        $('#root').addClass("menu-toggle")
    } else {
        $('#root').removeClass("menu-toggle")
    }



    return (
        <div>   <div className="nav-header">
            <span className="brand-logo">
                <img className="logo-abbr" src="" alt="logo" />
            </span>


            <div className="nav-control bg-primary"
                //  onClick={ShowSidebar}
                onClick={() => ShowSidebar123()}


            >
                <div className="hamburger ">
                    <span className="line" />
                    <span className="line" />
                    <span className="line" />
                </div>
            </div>
        </div>



        </div>
    )
}

export default Logo