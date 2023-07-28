/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { primaryColor, Nav_Heaer_Color, Header_Color, Sidebar_Color } from "./Data"
import $ from "jquery";
import Cookies from 'js-cookie';
import axios from 'axios';
import { Tabs, Tab, Button } from 'react-bootstrap';
import CustomModal from '../../../ExtraComponents/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import html2canvas from 'html2canvas';





const CreateTheme = ({ SelectTheme1 }) => {
    const [toggleSelection, setToggleSelection] = useState(false)

    // for theme selection
    const [ThemeVersion, setThemeVersion] = useState("")
    const [ThemeDashboard, setThemeDashboard] = useState("")
    const [PrimaryColor, setPrimaryColor] = useState("")
    const [NavHeaderColor, setNavHeaderColor] = useState("")
    const [HeaderColor, setHeaderColor] = useState("")
    const [SidebarColor, setSidebarColor] = useState("")

    // for header selection
    const [Layout, setLayout] = useState("")
    const [Sidebar, setSidebar] = useState("")
    const [HeaderPosition, setHeaderPosition] = useState("")
    const [SidebarPosition, setSidebarPosition] = useState("")
    // for Container selection
    const [Container, setContainer] = useState("")
    const [BodyFont, setBodyFont] = useState("")

    // for Multistep Form
    const [activeTab, setActiveTab] = useState(1);

    const handleNextTab = () => {
        setActiveTab((prevTab) => prevTab + 1);
    };

    const handlePreviousTab = () => {
        setActiveTab((prevTab) => prevTab - 1);
    };

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);
    };


    // For Show Modal
    const [isModalOpen, setIsModalOpen] = useState(false);


    // For Theme Name

    const [themeName, setThemeName] = useState('');

    SelectTheme1(ThemeVersion, PrimaryColor, NavHeaderColor, HeaderColor, SidebarColor, Layout, Sidebar, HeaderPosition, SidebarPosition, Container, BodyFont)

    // ------------------ for Theme Selection ------------------------

    // for  Version Selection
    const PreviewVersion = (e) => {
        $('body').attr('data-theme-version', e.target.value);
        setThemeVersion(e.target.value);
    }


    const PreviewDashboard = (e) => {

        $('body').attr('data-dashboard', e.target.value);
        $('body').removeClass('theme-1 theme-2 theme-3 theme-4 theme-5 theme-6 theme-7 theme-8 theme-9 theme-10');
        $('body').addClass(e.target.value)


        setThemeDashboard(e.target.value);
    }

    // for  primary Color Selection

    const PreviewPrimaryColor = (e) => {
        $('body').attr('data-primary', e.target.value);
        setPrimaryColor(e.target.value);
    }

    // for  Nav-Header Selection

    const PreviewNavHeaderColor = (e) => {
        $('body').attr('data-nav-headerbg', e.target.value);
        setNavHeaderColor(e.target.value);
    }

    // for  Header Selection

    const PreviewHeaderColor = (e) => {
        $('body').attr('data-headerbg', e.target.value);
        setHeaderColor(e.target.value);
    }

    // for  Sidebar Selection

    const PreviewSIdebarColor = (e) => {
        $('body').attr('data-sibebarbg', e.target.value);
        setSidebarColor(e.target.value);
    }

    //-------------------  for Header selection -------------------

    // for Preview Layout

    const PreviewLayout = (e) => {
        if ($('body').attr('data-sidebar-style') === 'overlay') {
            $('body').attr('data-sidebar-style', 'full');
            $('body').attr('data-layout', e.target.value);
            return;
        }
        $('body').attr('data-layout', e.target.value);
        setLayout(e.target.value);
    }


    // for  Sidebar Selection

    const PreviewSIdebar = (e) => {
        if ($('body').attr('data-layout') === "horizontal") {
            if (e.target.value === "overlay") {
                alert("Sorry! Overlay is not possible in Horizontal layout.");
                return;
            }
        }

        if ($('body').attr('data-layout') === "vertical") {
            if ($('body').attr('data-container') === "boxed" && e.target.value === "full") {
                alert("Sorry! Full menu is not available in Vertical Boxed layout.");
                return;
            }

            if (e.target.value === "modern" && $('body').attr('data-sidebar-position') === "fixed") {
                alert("Sorry! Modern sidebar layout is not available in the fixed position. Please change the sidebar position into Static.");
                return;
            }
        }

        $('body').attr('data-sidebar-style', e.target.value);
        if ($('body').attr('data-sidebar-style') === 'icon-hover') {
            $('.deznav').on('hover', function () {
                $('#main-wrapper').addClass('iconhover-toggle');
            }, function () {
                $('#main-wrapper').removeClass('iconhover-toggle');
            });
        }

        setSidebar(e.target.value);
    }

    // for  Navigation Header  Selection

    const PreviewHeaderPosition = (e) => {
        $('body').attr('data-header-position', e.target.value);
        setHeaderPosition(e.target.value);
    }

    // for  Sidebar Position  Selection

    const PreviewSidebarPosition = (e) => {
        $('body').attr('data-sidebar-position', e.target.value);
        setSidebarPosition(e.target.value);
    }

    // ------------------ for Container selection ------------------------

    // for  Typography Selection

    //  console.log("$('body')", decodeURIComponent(document.cookie));

    const PreviewTypeGraphy = (e) => {
        $('body').attr('data-typography', e.target.value);
        setBodyFont(e.target.value);
    }
    // for  Container Selection

    const PreviewContainer = (e) => {
        if (e.target.value === "boxed") {
            if ($('body').attr('data-layout') === "vertical" && $('body').attr('data-sidebar-style') === "full") {
                $('body').attr('data-sidebar-style', 'overlay');
                $('body').attr('data-container', e.target.value);
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 200);
                return;
            }
        }
        $('body').attr('data-container', e.target.value);
        setContainer(e.target.value);
    }



    const ApplyChanges = async (e) => {

        // return
        setToggleSelection(false)
        setIsModalOpen(!isModalOpen)
    }
    const AddTheme = async (e) => {
        e.preventDefault();

        const element = document.getElementById('root');


        const options = {
            width: document.documentElement.scrollWidth, // Set custom width
            height: document.documentElement.scrollHeight, // Set custom height
        };

        // Set the window size and scroll position to match the content size
        // window.resizeTo(width, height);
        window.scrollTo(0, 0);

        var screenshotUrl

        // Capture the screenshot
        html2canvas(document.documentElement, options).then(canvas => {
            // Convert canvas to an image and download it
            const screenshot = canvas.toDataURL('image/png');
            screenshotUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = screenshot;
            link.download = 'screenshot.png';
            link.click();
        })



        // return
        const req = {
            // typography: BodyFont,
            // version: ThemeVersion,
            // layout: Layout,
            // primary: PrimaryColor,
            // headerBg: HeaderColor,
            // navheaderBg: NavHeaderColor,
            // sidebarBg: SidebarColor,
            // sidebarStyle: Sidebar,
            // sidebarPosition: SidebarPosition,
            // headerPosition: HeaderPosition,
            // containerLayout: Container,
            // panel_name: "smartalgo",
            // image: screenshotUrl,
            // theme_name: themeName,
            // dashboard: ThemeDashboard



            typography: "poppins",
            version: "light",
            layout: "vertical",
            primary: "color_1",
            headerBg: "color_1",
            navheaderBg: "color_1",
            sidebarBg: "color_1",
            sidebarStyle: "full",
            sidebarPosition: "fixed",
            headerPosition: "fixed",
            containerLayout: "full",
            image: "smartalgo",
            theme_name: themeName,
            dashboard: ThemeDashboard
        }







        axios.post("https://api.smartalgo.in:3001/smartalgo/theme_add", req).then((res) => {
            setIsModalOpen(false)
        }).catch((err) => {
            console.log("error", err);
        })
    }


    // let a = 'software.kashialgo.com'
    let a = 'https://backend.fealtyinc.in/'

    const firstDotIndex = a.indexOf(".");
    const firstPart = a.slice(0, firstDotIndex);
    const remainingPart = a.slice(firstDotIndex + 1);


    let panel_name = a.split(".")[2]

    console.log("First part:", firstPart);
    console.log("Remaining part:", remainingPart);



    return (
        <div  >
            <div className={`sidebar-right  ${toggleSelection ? 'show' : ""}`}>
                <div className="bg-overlay" />
                <div className="bg-overlay-close" />
                <span data-toggle="tooltip" data-placement="left" title="Create Theme"
                >  <span className="sidebar-right-trigger wave-effect wave-effect-x"
                    onClick={() => { setToggleSelection(!toggleSelection); }}
                >
                        <span>
                            <i className="fa fa-cog fa-spin" />
                        </span>
                    </span>
                </span>
                <div className="sidebar-right-inner">
                    <h4>
                        Pick your style
                    </h4>
                    <div className="card-tabs" >
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 1 ? 'active show' : ''}`}
                                    href="#tab1"
                                    data-bs-toggle="tab"
                                    onClick={() => handleTabClick(1)}
                                >
                                    Theme
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 2 ? 'active show' : ''}`}
                                    href="#tab2"
                                    data-bs-toggle="tab"
                                    onClick={() => handleTabClick(2)}
                                >
                                    Header
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 3 ? 'active show' : ''}`}
                                    href="#tab3"
                                    data-bs-toggle="tab"
                                    onClick={() => handleTabClick(3)}
                                >
                                    Content
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="tab-content tab-content-default tabcontent-border">
                        <div className={`tab-pane ${activeTab === 1 ? 'active' : ''}`} >
                            <div className="fade tab-pane active show" id="tab1" >
                                <div className="admin-settings">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <p>Background</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="theme_version"
                                                name="theme_version"
                                                onChange={(e) => PreviewVersion(e)}
                                            >
                                                <option value="light">Light</option>
                                                <option value="dark">Dark</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Dashboard Style</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="dashboard_select"
                                                name="dashboard_select"
                                                onChange={(e) => PreviewDashboard(e)}
                                            >
                                                <option value="" selected disabled>Select Dashboard</option>
                                                <option value="theme-1">Dashboard-1</option>
                                                <option value="theme-2">Dashboard-2</option>
                                                <option value="theme-3">Dashboard-3</option>
                                                <option value="theme-4">Dashboard-4</option>
                                                <option value="theme-5">Dashboard-5</option>
                                                <option value="theme-6">Dashboard-6</option>
                                                <option value="theme-7">Dashboard-7</option>
                                                <option value="theme-8">Dashboard-8</option>
                                                <option value="theme-9">Dashboard-9</option>
                                                <option value="theme-10">Dashboard-10</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Primary Color</p>
                                            <div>
                                                {
                                                    primaryColor.map((item) => {
                                                        return <>
                                                            <span
                                                                data-placement="top"
                                                                data-bs-toggle="tooltip"
                                                                title="Color 1"
                                                            >
                                                                <input
                                                                    className="chk-col-primary filled-in"
                                                                    id={item.value}
                                                                    name="primary_bg"
                                                                    type="radio"
                                                                    defaultValue={item.color}
                                                                    onChange={(e) => PreviewPrimaryColor(e)}
                                                                />
                                                                <label
                                                                    htmlFor={item.value}
                                                                    className={item.id === 1 ? "bg-label-pattern" : ""}
                                                                />
                                                            </span>
                                                        </>
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <p>Navigation Header</p>
                                            <div>
                                                {Nav_Heaer_Color.map((item) => {
                                                    return <span>

                                                        <input
                                                            className="chk-col-primary filled-in"
                                                            id={item.value}
                                                            name="navigation_header"
                                                            type="radio"
                                                            defaultValue={item.color}
                                                            onChange={(e) => PreviewNavHeaderColor(e)}

                                                        />
                                                        <label
                                                            htmlFor={item.value}
                                                            className={item.id === 1 ? "bg-label-pattern" : ""}
                                                        />
                                                    </span>
                                                })}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Header</p>
                                            <div>
                                                {Header_Color.map((item) => {
                                                    return <>
                                                        <span>
                                                            <input
                                                                className="chk-col-primary filled-in"
                                                                id={item.value}
                                                                name="header_bg"
                                                                type="radio"
                                                                defaultValue={item.color}
                                                                onChange={(e) => PreviewHeaderColor(e)}

                                                            />
                                                            <label
                                                                htmlFor={item.value}
                                                                className={item.id === 1 ? "bg-label-pattern" : ""}
                                                            />
                                                        </span>

                                                    </>
                                                })}

                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Sidebar</p>
                                            <div>
                                                {Sidebar_Color.map((item) => {
                                                    return <>
                                                        <span>

                                                            <input
                                                                className="chk-col-primary filled-in"
                                                                id={item.value}
                                                                name="sidebar_bg"
                                                                type="radio"
                                                                defaultValue={item.color}
                                                                onChange={(e) => PreviewSIdebarColor(e)}

                                                            />
                                                            <label
                                                                htmlFor={item.value}
                                                                className={item.id === 1 ? "bg-label-pattern" : ""}
                                                            />
                                                        </span>
                                                    </>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className={`tab-pane ${activeTab === 2 ? 'active' : ''}`} >

                            <div className="fade tab-pane" id="tab2">
                                <div className="admin-settings">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <p>Layout</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="theme_layout"
                                                name="theme_layout"
                                                onChange={(e) => PreviewLayout(e)}


                                            >
                                                <option value="vertical">Vertical</option>
                                                <option value="horizontal">Horizontal</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Header position</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="header_position"
                                                name="header_position"
                                                onChange={(e) => PreviewHeaderPosition(e)}


                                            >
                                                <option value="static">Static</option>
                                                <option value="fixed">Fixed</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Sidebar</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="sidebar_style"
                                                name="sidebar_style"
                                                onChange={(e) => PreviewSIdebar(e)}
                                            >
                                                <option value="full">Full</option>
                                                <option value="mini">Mini</option>
                                                <option value="compact">Compact</option>
                                                <option value="modern">Modern</option>
                                                <option value="overlay">Overlay</option>
                                                <option value="icon-hover">Icon-hover</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Sidebar position</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="sidebar_position"
                                                name="sidebar_position"
                                                onChange={(e) => PreviewSidebarPosition(e)}
                                            >
                                                <option value="static">Static</option>
                                                <option value="fixed">Fixed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className={`tab-pane ${activeTab === 3 ? 'active' : ''}`} >

                            <div className="fade tab-pane" id="tab3">
                                <div className="admin-settings">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <p>Container</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="container_layout"
                                                name="container_layout"
                                                onChange={(e) => PreviewContainer(e)}


                                            >
                                                <option value="wide">Wide</option>
                                                <option value="boxed">Boxed</option>
                                                <option value="wide-boxed">Wide Boxed</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <p>Body Font</p>
                                            <select
                                                className="default-select wide form-control"
                                                id="typography"
                                                name="typography"
                                                onChange={(e) => PreviewTypeGraphy(e)}
                                            >
                                                <option value="roboto">Roboto</option>
                                                <option value="poppins">Poppins</option>
                                                <option value="opensans">Open Sans</option>
                                                <option value="HelveticaNeue">HelveticaNeue</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-group">
                            {activeTab !== 1 && (
                                <button className="btn btn-primary" onClick={handlePreviousTab}>
                                    Previous
                                </button>
                            )}
                            {activeTab === 3 && (
                                <button className='btn btn-primary' onClick={(e) => ApplyChanges(e)}>Apply Changes</button>

                            )}
                            {activeTab !== 3 && (
                                <button className="btn btn-primary" onClick={handleNextTab}>
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>


            <CustomModal
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(!isModalOpen)}
                title="Theme Name"
                btn_name="Add Theme"
                content={
                    <>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Theme Name"
                        // className="mb-3"
                        >
                            <Form.Control type="email" placeholder="Theme Name" onChange={(e) => setThemeName(e.target.value)} />
                        </FloatingLabel>
                    </>
                }
                size="sm"
                Submit_Function={(e) => AddTheme(e)}
                backdrop='static'
            />

        </div>
    )
}

export default CreateTheme