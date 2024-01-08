import React, { useState, useEffect } from 'react'
import { theme_arr } from "../CreateTheme/Data"
import axios from "axios"
import $ from "jquery";
import * as Config from "../../../../Utils/Config";




const ThemeSelection = () => {

    const [toggleSelection, setToggleSelection] = useState(false)
    const [ThemeData, setThemeData] = useState([])

    const Role = JSON.parse(localStorage.getItem("user_details")).Role

    const AddClassName = (id) => {
        localStorage.setItem("theme_id", id)


        axios.post(`${Config.base_url}find_one/theme`, { _id: id }).then((res) => {

            let themedata = res.data.data[0]

            // console.log("themedata", themedata);
            // let abc = $('body').attr('class')
            // $('body').attr('data-dashboard', `${abc}-dashboard`);

            $('body').removeClass('theme-1 theme-2 theme-3 theme-4 theme-5 theme-6 theme-7 theme-8 theme-9  theme-10');
            $('body').addClass(themedata.dashboard)

            $('body').attr('data-dashboard', `${themedata.dashboard}-dashboard`);


            $('body').attr('data-theme-version', themedata.theme_version);
            $('body').attr('data-primary', themedata.primary_col);
            $('body').attr('data-nav-headerbg', themedata.nav_head_col);
            $('body').attr('data-headerbg', themedata.header_col);
            $('body').attr('data-sibebarbg', themedata.sidebar_col);


            if ($('body').attr('data-sidebar-style') === 'overlay') {
                $('body').attr('data-sidebar-style', 'full');
                $('body').attr('data-layout', themedata.layout);
                return;
            }
            $('body').attr('data-layout', themedata.layout);


            if ($('body').attr('data-layout') === "horizontal") {
                if (themedata.sidebar === "overlay") {
                    alert("Sorry! Overlay is not possible in Horizontal layout.");
                    return;
                }
            }

            if ($('body').attr('data-layout') === "vertical") {
                if ($('body').attr('data-container') === "boxed" && themedata.sidebar === "full") {
                    alert("Sorry! Full menu is not available in Vertical Boxed layout.");
                    return;
                }

                if (themedata.sidebar === "modern" && $('body').attr('data-sidebar-position') === "fixed") {
                    alert("Sorry! Modern sidebar layout is not available in the fixed position. Please change the sidebar position into Static.");
                    return;
                }
            }

            $('body').attr('data-sidebar-style', themedata.sidebar);
            if ($('body').attr('data-sidebar-style') === 'icon-hover') {
                $('.deznav').on('hover', function () {
                    $('#main-wrapper').addClass('iconhover-toggle');
                }, function () {
                    $('#main-wrapper').removeClass('iconhover-toggle');
                });
            }

            if (themedata.sidebar === "mini") {
                $(this).find("ul").stop()
            }




            $('body').attr('data-header-position', themedata.header_position);
            $('body').attr('data-sibebarbg', themedata.sidebar_col);
            $('body').attr('data-typography', themedata.body_font);

            if (themedata.container === "boxed") {
                if ($('body').attr('data-layout') === "vertical" && $('body').attr('data-sidebar-style') === "full") {
                    $('body').attr('data-sidebar-style', 'overlay');
                    $('body').attr('data-container', themedata.container);
                    setTimeout(function () {
                        $(window).trigger('resize');
                    }, 200);
                    return;
                }
            }
            $('body').attr('data-container', themedata.container);


        }).catch((err) => {
            console.log("error", err);
        })
    }


    const GetAllThemes = () => {
        if (Role === "SUPERADMIN") {

            axios.get(`${Config.smartAlogUrl}getall/theme`).then((res) => {
                setThemeData(res.data.data)
            }).catch((err) => {
                console.log("error", err);
            })
        }
    }

    useEffect(() => {
        GetAllThemes()
    }, [])

   

    return (
        <div><div className={`dz-demo-panel ${toggleSelection ? 'show' : ""}`}>
            <div className="bg-close" />
            <span data-toggle="tooltip" data-placement="left" title="Change Theme"
            >
                <span
                    className="dz-demo-trigger"
                    onClick={() => setToggleSelection(!toggleSelection)}
                >
                    <span>
                        <i className="las la-tint" />
                    </span>
                </span>
            </span>
            <div className="dz-demo-inner">
                <button
                    // href="javascript:void(0);"
                    className="btn btn-primary btn-sm px-2 py-1 mb-3"
                    onClick="deleteAllCookie()"
                >
                    Delete All Cookie
                </button>
                <div className="dz-demo-header">
                    <h4>Select A Demo</h4>
                    <span className="dz-demo-close"
                  
                    >
                        <span>
                            <i className="las la-times" />
                        </span>
                    </span>
                </div>
                <div className="dz-demo-content">
                    <div className="dz-wrapper">
                        {/* {theme_arr && theme_arr.map((item) => { */}
                        {ThemeData && ThemeData.map((item) => {
                            return <>
                                <div key={item._id} className="overlay-bx dz-demo-bx">
                                    <div className="overlay-wrapper">
                                        <img
                                            src={item.image}
                                            alt={item.value}
                                            className="w-100"
                                        />
                                    </div>
                                    <div className="overlay-layer">
                                        <button
                                            // href="javascript:void(0);"
                                            data-theme={item.key}
                                            className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                            onClick={() => AddClassName(item._id)}
                                        >
                                            {item.theme_name}
                                        </button>
                                    </div>
                                </div>
                                <h5 className="text-black mb-2">  {item.theme_name}</h5>
                                <hr />
                            </>
                        })}

                        {/* <div className="overlay-bx dz-demo-bx">
                            <div className="overlay-wrapper">
                                <img
                                    src="../assets/images/demo/pic2.jpg"
                                    alt=""
                                    className="w-100"
                                />
                            </div>
                            <div className="overlay-layer">
                                <button
                                    //      href="javascript:void(0);"
                                    data-theme={2}
                                    className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                    onClick={() => AddClassName(2)}

                                >
                                    Demo 2
                                </button>
                            </div>
                        </div>
                        <h5 className="text-black mb-2">Demo 2</h5>
                        <hr />
                        <div className="overlay-bx dz-demo-bx">
                            <div className="overlay-wrapper ">
                                <img
                                    src="../assets/images/demo/pic3.jpg"
                                    alt=""
                                    className="w-100"
                                />
                            </div>
                            <div className="overlay-layer">
                                <button
                                    //       href="javascript:void(0);"
                                    data-theme={3}
                                    className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                    onClick={() => AddClassName(3)}

                                >
                                    Demo 3
                                </button>
                            </div>
                        </div>
                        <h5 className="text-black mb-2">Demo 3</h5>
                        <hr />
                        <div className="overlay-bx dz-demo-bx">
                            <div className="overlay-wrapper">
                                <img
                                    src="../assets/images/demo/pic4.jpg"
                                    alt=""
                                    className="w-100"
                                />
                            </div>
                            <div className="overlay-layer">
                                <button
                                    //   href="javascript:void(0);"
                                    data-theme={4}
                                    className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                    onClick={() => AddClassName(4)}

                                >
                                    Demo 4
                                </button>
                            </div>
                        </div>
                        <h5 className="text-black mb-2">Demo 4</h5>
                        <hr />
                        <div className="overlay-bx dz-demo-bx">
                            <div className="overlay-wrapper">
                                <img
                                    src="../assets/images/demo/pic5.jpg"
                                    alt=""
                                    className="w-100"
                                />
                            </div>
                            <div className="overlay-layer">
                                <button
                                    //   href="javascript:void(0);"
                                    data-theme={5}
                                    className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                    onClick={() => AddClassName(5)}

                                >
                                    Demo 5
                                </button>
                            </div>
                        </div>
                        <h5 className="text-black mb-2">Demo 5</h5>
                        <div className="overlay-bx dz-demo-bx">
                            <div className="overlay-wrapper">
                                <img
                                    src="../assets/images/demo/pic6.jpg"
                                    alt=""
                                    className="w-100"
                                />
                            </div>
                            <div className="overlay-layer">
                                <button
                                    //  href="javascript:void(0);"
                                    data-theme={6}
                                    className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                    onClick={() => AddClassName(6)}

                                >
                                    Demo 6
                                </button>
                            </div>
                        </div>
                        <h5 className="text-black mb-2">Demo 6</h5>
                        <div className="overlay-bx dz-demo-bx">
                            <div className="overlay-wrapper">
                                <img
                                    src="../assets/images/demo/pic6.jpg"
                                    alt=""
                                    className="w-100"
                                />
                            </div>
                            <div className="overlay-layer">
                                <button
                                    //  href="javascript:void(0);"
                                    data-theme={7}
                                    className="btn dz_theme_demo btn-secondary btn-sm mr-2"
                                    onClick={() => AddClassName("Demo7")}

                                >
                                    Demo 7
                                </button>
                            </div>
                        </div>
                        <h5 className="text-black mb-2">Demo 7</h5> */}
                    </div>
                </div>
                <div className="fs-12 pt-3">
                    <span className="text-danger">*Note :</span> This theme switcher is not
                    part of product. It is only for demo. you will get all guideline in
                    documentation. please checkonClick
                    <button
                        // href="javascript:void(0);"
                        className="text-primary">
                        documentation.
                    </button>
                </div>
            </div>
        </div>
        </div>
    )
}


export default ThemeSelection