import React, { useState, useEffect, useRef } from 'react'
import Header from '../Header/Header'
import Footer from "../Footer/Footer"
import Sidebar from '../Sidebar/Sidebar'
import ChatBox from '../../ExtraComponents/ChatBox'
import ThemeSelection from '../ThemeSwitcher/ThemeSelection/ThemeSelection'
import CreateTheme from '../ThemeSwitcher/CreateTheme/CreateTheme'
import $ from "jquery";

const Wraper = () => {
  const roles = JSON.parse(localStorage.getItem('user_role'))
  const themeData = JSON.parse(localStorage.getItem('theme'))

  const [toggleChatBox, setToggleChatBox] = useState(false)
  const [toggleSidebar, setToggleSidebar] = useState(true)

  const ShowChatBox = () => { setToggleChatBox(!toggleChatBox) }
  const ShowSidebar = () => { setToggleSidebar(!toggleSidebar) }


  const SelectTheme = (ThemeVersion, PrimaryColor, NavHeaderColor, HeaderColor, SidebarColor, Layout, Sidebar, HeaderPosition, SidebarPosition, Container, BodyFont) => {
    let themeOptionArr = {
      typography: BodyFont,
      version: ThemeVersion,
      layout: Layout,
      primary: PrimaryColor,
      headerBg: HeaderColor,
      navheaderBg: NavHeaderColor,
      sidebarBg: SidebarColor,
      sidebarStyle: Sidebar,
      sidebarPosition: SidebarPosition,
      headerPosition: HeaderPosition,
      containerLayout: Container,
      panel_name: "smartalgo",
      image: "smartalgo"
    };

  }

  const themesToHide = [
    '.theme-1',
    '.theme-2',
    '.theme-3',
    '.theme-4',
    '.theme-5',
    '.theme-6',
    '.theme-7',
    '.theme-8',
    '.theme-9',
    '.theme-10'
  ];

  themesToHide.forEach(theme => {
    const elements = document.querySelectorAll(`body${theme}`);
    if (elements[0] !== undefined) {
      $('body').attr('data-Dashboard', `${elements[0].classList[0]}-dashboard`);
    }
  });

  $('body').attr('data-typography', themeData && themeData.body_font);

  $('body').attr('data-theme-version', themeData && themeData.theme_version);

  themeData && themeData.header_position === "fixed" && $('body').attr('data-sidebar-style') === "modern" && $('body').attr('data-layout') === "vertical" ?
    alert("Sorry, Modern sidebar layout dosen't support fixed position!") :
    $('body').attr('data-sidebar-position', themeData && themeData.header_position);

  $('body').attr('data-header-position', themeData && themeData.header_position);

  if ($('body').attr('data-sidebar-style') === 'overlay') {
    $('body').attr('data-sidebar-style', 'full');
    $('body').attr('data-layout', themeData && themeData.layout);
    return;
  }
  $('body').attr('data-layout', themeData && themeData.layout);

  if (themeData && themeData.container === "boxed") {
    if ($('body').attr('data-layout') === "vertical" && $('body').attr('data-sidebar-style') === "full") {
      $('body').attr('data-sidebar-style', 'overlay');
      $('body').attr('data-container', themeData && themeData.container);

      setTimeout(function () {
        $(window).trigger('resize');
      }, 200);

      return;
    }
  }
  $('body').attr('data-container', themeData && themeData.container);

  if ($('body').attr('data-layout') === "horizontal") {
    if (themeData && themeData.sidebar === "overlay") {
      alert("Sorry! Overlay is not possible in Horizontal layout.");
      return;
    }
  }

  if ($('body').attr('data-layout') === "vertical") {
    if ($('body').attr('data-container') === "boxed" && themeData && themeData.sidebar === "full") {
      alert("Sorry! Full menu is not available in Vertical Boxed layout.");
      return;
    }

    if (themeData && themeData.sidebar === "modern" && $('body').attr('data-sidebar-position') === "fixed") {
      alert("Sorry! Modern sidebar layout is not available in the fixed position. Please change the sidebar position into Static.");
      return;
    }
  }

  $('body').attr('data-sidebar-style', themeData && themeData.sidebar);

  if ($('body').attr('data-sidebar-style') === 'icon-hover') {
    $('.deznav').on('hover', function () {
      $('#main-wrapper').addClass('iconhover-toggle');
    }, function () {
      $('#main-wrapper').removeClass('iconhover-toggle');
    });
  }

  $('body').attr('data-nav-headerbg', themeData && themeData.nav_head_col);

  $('body').attr('data-headerbg', themeData && themeData.header_col);

  $('body').attr('data-sibebarbg', themeData && themeData.sidebar_col);

  $('body').attr('data-primary', themeData && themeData.primary_col);


  return (
    < >
      <div id="main-wrapper" className={`${toggleSidebar ? "show" : ""}`}
      >
        <Header ChatBox={ShowChatBox} ShowSidebar={ShowSidebar} />
        <Sidebar ShowSidebar={ShowSidebar} />
        {roles === "SUPERADMIN" ? <> <ThemeSelection /> <CreateTheme SelectTheme1={SelectTheme} /> </> : ""}
        {/* <ChatBox toggleChat={toggleChatBox} /> */}
        <Footer />

      </div>



    </>
  )
}

export default Wraper