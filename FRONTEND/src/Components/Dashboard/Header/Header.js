/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Logo from "./Logo"
import DropDown from "../../ExtraComponents/DropDown"
import Notification from '../../ExtraComponents/Notification'


const Header = ({ ChatBox }) => {

    return (
        <div>
            <Logo />
            <div className="header">
                <div className="header-content">
                    <nav className="navbar navbar-expand">
                        <div className="collapse navbar-collapse justify-content-between">
                            <div className="header-left">
                                <div className="headaer-title">
                                    <h1 className="font-w600 mb-0">Dashboard</h1>
                                </div>
                            </div>
                            <ul className="navbar-nav header-right">
                                {/*  For Show Notification Box */}
                                <Notification />

                                {/*  For Show Chat Box */}
                                <li className="nav-item dropdown notification_dropdown" onClick={() => ChatBox()}>
                                    <a className="nav-link bell-link nav-action" >
                                        <svg
                                            width={28}
                                            height={28}
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M14.8257 17.5282C14.563 17.6783 14.2627 17.7534 14 17.7534C13.7373 17.7534 13.437 17.6783 13.1743 17.5282L0 9.49598V20.193C0 22.4826 1.83914 24.3217 4.12869 24.3217H23.8713C26.1609 24.3217 28 22.4826 28 20.193V9.49598L14.8257 17.5282Z"
                                                fill="#737B8B"
                                            />
                                            <path
                                                d="M23.8713 3.67829H4.12863C2.17689 3.67829 0.525417 5.06703 0.112549 6.90617L13.9999 15.3887L27.8873 6.90617C27.4745 5.06703 25.823 3.67829 23.8713 3.67829Z"
                                                fill="#737B8B"
                                            />
                                        </svg>
                                        <span className="badge light text-white bg-primary rounded-circle" />
                                    </a>
                                </li>
                                <li className="nav-item dropdown header-profile">

                                    {/* </li>
                                <li> */}
                                    <DropDown />
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div></div>
    )
}

export default Header