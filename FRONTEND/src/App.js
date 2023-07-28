/* eslint-disable react/jsx-pascal-case */
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <>
//   <div id="preloader">
//     <div className="lds-ripple">
//       <div />
//       <div />
//     </div>
//   </div>
//   {/********************
//   Preloader end
//     *********************/}
//   {/***********************************
//   Main wrapper start
//     ************************************/}
//   <div id="main-wrapper">
//     {/***********************************
//       Nav header start
//   ************************************/}
//     <div className="nav-header">
//       <a href="index.html" className="brand-logo">
//         <svg
//           className="logo-abbr"
//           width={57}
//           height={57}
//           viewBox="0 0 57 57"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <rect width={57} height={57} rx={14} fill="#FFD482" />
//           <path
//             className="logo-k"
//             d="M33.8661 45.3198L34.016 45.5H34.2504H42H43.0867L42.3797 44.6747L29.6972 29.8694L42.0311 15.3234L42.7292 14.5H41.6497H34.2504H34.015L33.8651 14.6814L23.6296 27.0631V15V14.5H23.1296H17H16.5V15V45V45.5H17H23.1296H23.6296V45V33.016L33.8661 45.3198Z"
//             fill="#2D3134"
//             stroke="#2D3134"
//           />
//           <path
//             d="M49.609 37.1129L49.6065 37.1153L45.8935 40.7348L46.7704 45.847L46.7705 45.8478C46.8764 46.468 46.622 47.0949 46.113 47.4658L49.609 37.1129ZM49.609 37.1129C50.0552 36.6749 50.222 36.0196 50.0254 35.4164L49.0746 35.7263L50.0254 35.4164C49.8302 34.8175 49.3123 34.3807 48.6885 34.2897L48.6878 34.2896L43.5562 33.5445L41.2613 28.8938C41.2613 28.8938 41.2612 28.8938 41.2612 28.8938C40.9426 28.248 40.2969 28 39.7756 28C39.2543 28 38.6085 28.248 38.2899 28.8938L35.995 33.5445L30.8633 34.2896L30.8626 34.2897C30.2377 34.3808 29.721 34.8192 29.526 35.4156C29.3292 36.0177 29.4952 36.6758 29.9435 37.1142L29.9447 37.1154L33.6583 40.7342L32.7814 45.8463L32.7813 45.8471M49.609 37.1129L32.7813 45.8471M32.7813 45.8471C32.6755 46.4673 32.9299 47.0942 33.4388 47.4652M32.7813 45.8471L33.4388 47.4652M33.4388 47.4652C33.9498 47.8383 34.6282 47.8867 35.1863 47.5918C35.1868 47.5915 35.1873 47.5913 35.1878 47.591L39.7756 45.1795L44.3657 47.5925L33.4385 47.4649C33.4386 47.465 33.4387 47.4651 33.4388 47.4652ZM45.1374 47.7835C45.4783 47.7835 45.822 47.6782 46.1129 47.4659L44.3668 47.5931C44.6093 47.7208 44.8745 47.7835 45.1374 47.7835Z"
//             fill="url(#paint0_linear_33_278)"
//             stroke="#FFD482"
//             strokeWidth={2}
//           />
//           <defs>
//             <linearGradient
//               id="paint0_linear_33_278"
//               x1="39.7756"
//               y1={29}
//               x2="39.7756"
//               y2="46.7835"
//               gradientUnits="userSpaceOnUse"
//             >
//               <stop offset={2} stopColor="#FF9D43" />
//               <stop offset={1} stopColor="#F66F4D" />
//             </linearGradient>
//           </defs>
//         </svg>
//         <svg
//           className="brand-title"
//           width={110}
//           height={33}
//           viewBox="0 0 110 33"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M0.5 31.6275V32.1275H1H6.77194H7.27194V31.6275V23.2943L14.1312 31.9383L14.2813 32.1275H14.5228H22.0264H23.1389L22.4002 31.2955L12.5506 20.2017L22.3203 9.02737L23.0452 8.19826H21.9439H14.4404H14.1979L14.0477 8.3887L7.27194 16.9828V1V0.5H6.77194H1H0.5V1V31.6275ZM41.0678 10.605C39.5233 9.04976 37.1689 7.82577 34.0231 7.82577C27.8956 7.82577 23.0924 12.6836 23.0924 20.0801C23.0924 27.4655 27.8854 32.5 33.9819 32.5C37.0937 32.5 39.5015 31.2757 41.0678 29.6684V31.6275V32.1275H41.5678H47.381H47.881V31.6275V8.69826V8.19826H47.381H41.5678H41.0678V8.69826V10.605ZM84.4701 31.6275V32.1275H84.9701H90.7421H91.2421V31.6275V18.1762C91.2421 14.9065 90.2393 12.3172 88.4732 10.5442C86.7078 8.77197 84.2313 7.86715 81.3833 7.86715C78.175 7.86715 75.2441 9.42776 73.5593 11.8096C71.8164 9.22484 68.9104 7.86715 65.5104 7.86715C63.0449 7.86715 60.8509 8.72757 59.2903 10.1773V8.69826V8.19826H58.7903H53.0183H52.5183V8.69826V31.6275V32.1275H53.0183H58.7903H59.2903V31.6275V18.9626C59.2903 17.2319 59.769 15.9839 60.5522 15.1706C61.3334 14.3592 62.479 13.9166 63.9438 13.9166C65.3637 13.9166 66.4889 14.3571 67.2612 15.1685C68.0361 15.9825 68.5148 17.2319 68.5148 18.9626V31.6275V32.1275H69.0148H74.7868H75.2868V31.6275V18.9626C75.2868 17.2319 75.7655 15.9832 76.5445 15.1695C77.3213 14.3582 78.4567 13.9166 79.8991 13.9166C81.319 13.9166 82.4441 14.3571 83.2165 15.1685C83.9913 15.9825 84.4701 17.2319 84.4701 18.9626V31.6275ZM109 14.9513H109.5V14.4513V8.36715V7.86715H109C106.248 7.86715 104.04 8.96175 102.491 10.7325V8.69826V8.19826H101.991H96.2193H95.7193V8.69826V31.6275V32.1275H96.2193H101.991H102.491V31.6275V20.2043C102.491 18.0564 102.992 16.782 103.792 16.0317C104.598 15.2759 105.812 14.9513 107.475 14.9513H109ZM41.0678 20.1629C41.0678 22.221 40.387 23.7769 39.3706 24.8161C38.3515 25.858 36.9676 26.4092 35.5073 26.4092C32.71 26.4092 29.988 24.1688 29.988 20.0801C29.988 18.0245 30.6774 16.4904 31.6924 15.4715C32.7111 14.4488 34.0859 13.9166 35.5073 13.9166C36.9676 13.9166 38.3515 14.4678 39.3706 15.5097C40.387 16.5488 41.0678 18.1048 41.0678 20.1629Z"
//             fill="#2D3134"
//             stroke="#2D3134"
//           />
//         </svg>
//       </a>
//       <div className="nav-control">
//         <div className="hamburger">
//           <span className="line" />
//           <span className="line" />
//           <span className="line" />
//         </div>
//       </div>
//     </div>
//     {/***********************************
//       Nav header end
//   ************************************/}
//     {/***********************************
//       Chat box start
//   ************************************/}
//     <div className="chatbox">
//       <div className="chatbox-close" />
//       <div className="custom-tab-1">
//         <ul className="nav nav-tabs">
//           <li className="nav-item">
//             <a className="nav-link" data-bs-toggle="tab" href="#notes">
//               Notes
//             </a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link" data-bs-toggle="tab" href="#alerts">
//               Alerts
//             </a>
//           </li>
//           <li className="nav-item">
//             <a className="nav-link active" data-bs-toggle="tab" href="#chat">
//               Chat
//             </a>
//           </li>
//         </ul>
//         <div className="tab-content">
//           <div className="tab-pane fade active show" id="chat" role="tabpanel">
//             <div className="card mb-sm-3 mb-md-0 contacts_card dz-chat-user-box">
//               <div className="card-header chat-list-header text-center">
//                 <a href="javascript:void(0);">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <rect
//                         fill="#000000"
//                         x={4}
//                         y={11}
//                         width={16}
//                         height={2}
//                         rx={1}
//                       />
//                       <rect
//                         fill="#000000"
//                         opacity="0.3"
//                         transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
//                         x={4}
//                         y={11}
//                         width={16}
//                         height={2}
//                         rx={1}
//                       />
//                     </g>
//                   </svg>
//                 </a>
//                 <div>
//                   <h6 className="mb-1">Chat List</h6>
//                   <p className="mb-0">Show All</p>
//                 </div>
//                 <a href="javascript:void(0);">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <rect x={0} y={0} width={24} height={24} />
//                       <circle fill="#000000" cx={5} cy={12} r={2} />
//                       <circle fill="#000000" cx={12} cy={12} r={2} />
//                       <circle fill="#000000" cx={19} cy={12} r={2} />
//                     </g>
//                   </svg>
//                 </a>
//               </div>
//               <div
//                 className="card-body contacts_body p-0 dz-scroll  "
//                 id="DZ_W_Contacts_Body"
//               >
//                 <ul className="contacts">
//                   <li className="name-first-letter">A</li>
//                   <li className="active dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/1.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon" />
//                       </div>
//                       <div className="user_info">
//                         <span>Archie Parker</span>
//                         <p>Kalid is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/2.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Alfie Mason</span>
//                         <p>Taherah left 7 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/3.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon" />
//                       </div>
//                       <div className="user_info">
//                         <span>AharlieKane</span>
//                         <p>Sami is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/4.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Athan Jacoby</span>
//                         <p>Nargis left 30 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="name-first-letter">B</li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/5.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Bashid Samim</span>
//                         <p>Rashid left 50 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/1.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon" />
//                       </div>
//                       <div className="user_info">
//                         <span>Breddie Ronan</span>
//                         <p>Kalid is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/2.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Ceorge Carson</span>
//                         <p>Taherah left 7 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="name-first-letter">D</li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/3.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon" />
//                       </div>
//                       <div className="user_info">
//                         <span>Darry Parker</span>
//                         <p>Sami is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/4.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Denry Hunter</span>
//                         <p>Nargis left 30 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="name-first-letter">J</li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/5.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Jack Ronan</span>
//                         <p>Rashid left 50 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/1.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon" />
//                       </div>
//                       <div className="user_info">
//                         <span>Jacob Tucker</span>
//                         <p>Kalid is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/2.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>James Logan</span>
//                         <p>Taherah left 7 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/3.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon" />
//                       </div>
//                       <div className="user_info">
//                         <span>Joshua Weston</span>
//                         <p>Sami is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="name-first-letter">O</li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/4.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Oliver Acker</span>
//                         <p>Nargis left 30 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="dz-chat-user">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont">
//                         <img
//                           src="../assets/images/avatar/5.jpg"
//                           className="rounded-circle user_img"
//                           alt=""
//                         />
//                         <span className="online_icon offline" />
//                       </div>
//                       <div className="user_info">
//                         <span>Oscar Weston</span>
//                         <p>Rashid left 50 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <div className="card chat dz-chat-history-box d-none">
//               <div className="card-header chat-list-header text-center">
//                 <a href="javascript:void(0);" className="dz-chat-history-back">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <polygon points="0 0 24 0 24 24 0 24" />
//                       <rect
//                         fill="#000000"
//                         opacity="0.3"
//                         transform="translate(15.000000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-15.000000, -12.000000) "
//                         x={14}
//                         y={7}
//                         width={2}
//                         height={10}
//                         rx={1}
//                       />
//                       <path
//                         d="M3.7071045,15.7071045 C3.3165802,16.0976288 2.68341522,16.0976288 2.29289093,15.7071045 C1.90236664,15.3165802 1.90236664,14.6834152 2.29289093,14.2928909 L8.29289093,8.29289093 C8.67146987,7.914312 9.28105631,7.90106637 9.67572234,8.26284357 L15.6757223,13.7628436 C16.0828413,14.136036 16.1103443,14.7686034 15.7371519,15.1757223 C15.3639594,15.5828413 14.7313921,15.6103443 14.3242731,15.2371519 L9.03007346,10.3841355 L3.7071045,15.7071045 Z"
//                         fill="#000000"
//                         fillRule="nonzero"
//                         transform="translate(9.000001, 11.999997) scale(-1, -1) rotate(90.000000) translate(-9.000001, -11.999997) "
//                       />
//                     </g>
//                   </svg>
//                 </a>
//                 <div>
//                   <h6 className="mb-1">Chat with Khelesh</h6>
//                   <p className="mb-0 text-success">Online</p>
//                 </div>
//                 <div className="dropdown">
//                   <a
//                     href="javascript:void(0);"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       xmlnsXlink="http://www.w3.org/1999/xlink"
//                       width="18px"
//                       height="18px"
//                       viewBox="0 0 24 24"
//                       version="1.1"
//                     >
//                       <g
//                         stroke="none"
//                         strokeWidth={1}
//                         fill="none"
//                         fillRule="evenodd"
//                       >
//                         <rect x={0} y={0} width={24} height={24} />
//                         <circle fill="#000000" cx={5} cy={12} r={2} />
//                         <circle fill="#000000" cx={12} cy={12} r={2} />
//                         <circle fill="#000000" cx={19} cy={12} r={2} />
//                       </g>
//                     </svg>
//                   </a>
//                   <ul className="dropdown-menu dropdown-menu-start">
//                     <li className="dropdown-item">
//                       <i className="fa fa-user-circle text-primary me-2" /> View
//                       profile
//                     </li>
//                     <li className="dropdown-item">
//                       <i className="fa fa-users text-primary me-2" /> Add to
//                       friends
//                     </li>
//                     <li className="dropdown-item">
//                       <i className="fa fa-plus text-primary me-2" /> Add to
//                       group
//                     </li>
//                     <li className="dropdown-item">
//                       <i className="fa fa-ban text-primary me-2" /> Block
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div
//                 className="card-body msg_card_body dz-scroll"
//                 id="DZ_W_Contacts_Body3"
//               >
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     Hi, how are you samim?
//                     <span className="msg_time">8:40 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-4">
//                   <div className="msg_cotainer_send">
//                     Hi Khalid i am good tnx how about you?
//                     <span className="msg_time_send">8:55 AM, Today</span>
//                   </div>
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/2.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     I am good too, thank you for your chat template
//                     <span className="msg_time">9:00 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-4">
//                   <div className="msg_cotainer_send">
//                     You are welcome
//                     <span className="msg_time_send">9:05 AM, Today</span>
//                   </div>
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/2.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     I am looking for your next templates
//                     <span className="msg_time">9:07 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-4">
//                   <div className="msg_cotainer_send">
//                     Ok, thank you have a good day
//                     <span className="msg_time_send">9:10 AM, Today</span>
//                   </div>
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/2.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     Bye, see you
//                     <span className="msg_time">9:12 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     Hi, how are you samim?
//                     <span className="msg_time">8:40 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-4">
//                   <div className="msg_cotainer_send">
//                     Hi Khalid i am good tnx how about you?
//                     <span className="msg_time_send">8:55 AM, Today</span>
//                   </div>
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/2.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     I am good too, thank you for your chat template
//                     <span className="msg_time">9:00 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-4">
//                   <div className="msg_cotainer_send">
//                     You are welcome
//                     <span className="msg_time_send">9:05 AM, Today</span>
//                   </div>
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/2.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     I am looking for your next templates
//                     <span className="msg_time">9:07 AM, Today</span>
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mb-4">
//                   <div className="msg_cotainer_send">
//                     Ok, thank you have a good day
//                     <span className="msg_time_send">9:10 AM, Today</span>
//                   </div>
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/2.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-start mb-4">
//                   <div className="img_cont_msg">
//                     <img
//                       src="../assets/images/avatar/1.jpg"
//                       className="rounded-circle user_img_msg"
//                       alt=""
//                     />
//                   </div>
//                   <div className="msg_cotainer">
//                     Bye, see you
//                     <span className="msg_time">9:12 AM, Today</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-footer type_msg">
//                 <div className="input-group">
//                   <textarea
//                     className="form-control overflow-hidden"
//                     placeholder="Type your message..."
//                     defaultValue={""}
//                   />
//                   <div className="input-group-append">
//                     <button type="button" className="btn btn-primary">
//                       <i className="fa fa-location-arrow" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="tab-pane fade" id="alerts" role="tabpanel">
//             <div className="card mb-sm-3 mb-md-0 contacts_card">
//               <div className="card-header chat-list-header text-center">
//                 <a href="javascript:void(0);">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <rect x={0} y={0} width={24} height={24} />
//                       <circle fill="#000000" cx={5} cy={12} r={2} />
//                       <circle fill="#000000" cx={12} cy={12} r={2} />
//                       <circle fill="#000000" cx={19} cy={12} r={2} />
//                     </g>
//                   </svg>
//                 </a>
//                 <div>
//                   <h6 className="mb-1">Notications</h6>
//                   <p className="mb-0">Show All</p>
//                 </div>
//                 <a href="javascript:void(0);">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <rect x={0} y={0} width={24} height={24} />
//                       <path
//                         d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
//                         fill="#000000"
//                         fillRule="nonzero"
//                         opacity="0.3"
//                       />
//                       <path
//                         d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
//                         fill="#000000"
//                         fillRule="nonzero"
//                       />
//                     </g>
//                   </svg>
//                 </a>
//               </div>
//               <div
//                 className="card-body contacts_body p-0 dz-scroll"
//                 id="DZ_W_Contacts_Body1"
//               >
//                 <ul className="contacts">
//                   <li className="name-first-letter">SEVER STATUS</li>
//                   <li className="active">
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont primary">KK</div>
//                       <div className="user_info">
//                         <span>David Nester Birthday</span>
//                         <p className="text-primary">Today</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="name-first-letter">SOCIAL</li>
//                   <li>
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont success">RU</div>
//                       <div className="user_info">
//                         <span>Perfection Simplified</span>
//                         <p>Jame Smith commented on your status</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li className="name-first-letter">SEVER STATUS</li>
//                   <li>
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont primary">AU</div>
//                       <div className="user_info">
//                         <span>AharlieKane</span>
//                         <p>Sami is online</p>
//                       </div>
//                     </div>
//                   </li>
//                   <li>
//                     <div className="d-flex bd-highlight">
//                       <div className="img_cont info">MO</div>
//                       <div className="user_info">
//                         <span>Athan Jacoby</span>
//                         <p>Nargis left 30 mins ago</p>
//                       </div>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//               <div className="card-footer" />
//             </div>
//           </div>
//           <div className="tab-pane fade" id="notes">
//             <div className="card mb-sm-3 mb-md-0 note_card">
//               <div className="card-header chat-list-header text-center">
//                 <a href="javascript:void(0);">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <rect
//                         fill="#000000"
//                         x={4}
//                         y={11}
//                         width={16}
//                         height={2}
//                         rx={1}
//                       />
//                       <rect
//                         fill="#000000"
//                         opacity="0.3"
//                         transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
//                         x={4}
//                         y={11}
//                         width={16}
//                         height={2}
//                         rx={1}
//                       />
//                     </g>
//                   </svg>
//                 </a>
//                 <div>
//                   <h6 className="mb-1">Notes</h6>
//                   <p className="mb-0">Add New Nots</p>
//                 </div>
//                 <a href="javascript:void(0);">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     xmlnsXlink="http://www.w3.org/1999/xlink"
//                     width="18px"
//                     height="18px"
//                     viewBox="0 0 24 24"
//                     version="1.1"
//                   >
//                     <g
//                       stroke="none"
//                       strokeWidth={1}
//                       fill="none"
//                       fillRule="evenodd"
//                     >
//                       <rect x={0} y={0} width={24} height={24} />
//                       <path
//                         d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
//                         fill="#000000"
//                         fillRule="nonzero"
//                         opacity="0.3"
//                       />
//                       <path
//                         d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
//                         fill="#000000"
//                         fillRule="nonzero"
//                       />
//                     </g>
//                   </svg>
//                 </a>
//               </div>
//               <div
//                 className="card-body contacts_body p-0 dz-scroll"
//                 id="DZ_W_Contacts_Body2"
//               >
//                 <ul className="contacts">
//                   <li className="active">
//                     <div className="d-flex bd-highlight">
//                       <div className="user_info">
//                         <span>New order placed..</span>
//                         <p>10 Aug 2020</p>
//                       </div>
//                       <div className="ms-auto">
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-primary btn-xs sharp me-1"
//                         >
//                           <i className="fas fa-pencil-alt" />
//                         </a>
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-danger btn-xs sharp"
//                         >
//                           <i className="fa fa-trash" />
//                         </a>
//                       </div>
//                     </div>
//                   </li>
//                   <li>
//                     <div className="d-flex bd-highlight">
//                       <div className="user_info">
//                         <span>Youtube, a video-sharing website..</span>
//                         <p>10 Aug 2020</p>
//                       </div>
//                       <div className="ms-auto">
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-primary btn-xs sharp me-1"
//                         >
//                           <i className="fas fa-pencil-alt" />
//                         </a>
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-danger btn-xs sharp"
//                         >
//                           <i className="fa fa-trash" />
//                         </a>
//                       </div>
//                     </div>
//                   </li>
//                   <li>
//                     <div className="d-flex bd-highlight">
//                       <div className="user_info">
//                         <span>john just buy your product..</span>
//                         <p>10 Aug 2020</p>
//                       </div>
//                       <div className="ms-auto">
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-primary btn-xs sharp me-1"
//                         >
//                           <i className="fas fa-pencil-alt" />
//                         </a>
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-danger btn-xs sharp"
//                         >
//                           <i className="fa fa-trash" />
//                         </a>
//                       </div>
//                     </div>
//                   </li>
//                   <li>
//                     <div className="d-flex bd-highlight">
//                       <div className="user_info">
//                         <span>Athan Jacoby</span>
//                         <p>10 Aug 2020</p>
//                       </div>
//                       <div className="ms-auto">
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-primary btn-xs sharp me-1"
//                         >
//                           <i className="fas fa-pencil-alt" />
//                         </a>
//                         <a
//                           href="javascript:void(0);"
//                           className="btn btn-danger btn-xs sharp"
//                         >
//                           <i className="fa fa-trash" />
//                         </a>
//                       </div>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     {/***********************************
//       Chat box End
//   ************************************/}
//     {/***********************************
//       Header start
//   ************************************/}
//     <div className="header">
//       <div className="header-content">
//         <nav className="navbar navbar-expand">
//           <div className="collapse navbar-collapse justify-content-between">
//             <div className="header-left">
//               <div className="headaer-title">
//                 <h1 className="font-w600 mb-0">Dashboard</h1>
//               </div>
//             </div>
//             <ul className="navbar-nav header-right">
//               <li>
//                 <div className="nav-item ms-auto">
//                   <div className="input-group search-area2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Search here"
//                     />
//                     <span className="input-group-text">
//                       <a href="javascript:void(0)">
//                         <svg
//                           width={24}
//                           height={24}
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M9.65925 19.3102C11.8044 19.3102 13.8882 18.5945 15.5806 17.2764L21.9653 23.6611C22.4423 24.1218 23.2023 24.1086 23.663 23.6316C24.1123 23.1663 24.1123 22.4287 23.663 21.9635L17.2782 15.5787C20.5491 11.3682 19.7874 5.3033 15.5769 2.0324C11.3663 -1.23851 5.30149 -0.476829 2.03058 3.73371C-1.24033 7.94425 -0.478646 14.0091 3.73189 17.2801C5.42702 18.5969 7.51269 19.3113 9.65925 19.3102ZM4.52915 4.52727C7.36245 1.69391 11.9561 1.69386 14.7895 4.52717C17.6229 7.36047 17.6229 11.9542 14.7896 14.7875C11.9563 17.6209 7.36261 17.6209 4.52925 14.7876C4.5292 14.7876 4.5292 14.7876 4.52915 14.7875C1.69584 11.9749 1.67915 7.39791 4.49181 4.56461C4.50424 4.55213 4.51667 4.5397 4.52915 4.52727Z"
//                             fill="#717579"
//                           />
//                         </svg>
//                       </a>
//                     </span>
//                   </div>
//                 </div>
//               </li>
//               <li className="nav-item dropdown notification_dropdown">
//                 <a
//                   className="nav-link nav-action"
//                   href="javascript:void(0);"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                 >
//                   <svg
//                     width={28}
//                     height={28}
//                     viewBox="0 0 28 28"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M10.4524 25.6682C11.0605 27.0357 12.409 28 14.0005 28C15.592 28 16.9405 27.0357 17.5487 25.6682C16.4265 25.7231 15.2594 25.76 14.0005 25.76C12.7417 25.76 11.5746 25.723 10.4524 25.6682Z"
//                       fill="#737B8B"
//                     />
//                     <path
//                       d="M26.3532 19.74C24.877 17.8785 22.3996 14.2195 22.3996 10.64C22.3996 7.09073 20.1193 3.89758 16.7996 2.72382C16.7593 1.21406 15.5183 0 14.0007 0C12.482 0 11.2422 1.21406 11.2018 2.72382C7.88101 3.89758 5.6007 7.09073 5.6007 10.64C5.6007 14.2207 3.1244 17.8785 1.64712 19.74C1.15433 20.3616 1.00197 21.1825 1.24058 21.9363C1.47354 22.6721 2.05367 23.2422 2.79288 23.4595C4.08761 23.8415 6.20997 24.2715 9.44682 24.491C10.8479 24.5851 12.3543 24.64 14.0008 24.64C15.646 24.64 17.1525 24.5851 18.5535 24.491C21.7915 24.2715 23.9128 23.8415 25.2086 23.4595C25.9478 23.2422 26.5268 22.6722 26.7598 21.9363C26.9983 21.1825 26.8449 20.3616 26.3532 19.74Z"
//                       fill="#737B8B"
//                     />
//                   </svg>
//                   <span className="badge light text-white bg-primary rounded-circle" />
//                 </a>
//                 <div className="dropdown-menu dropdown-menu-end">
//                   <div
//                     id="DZ_W_Notification1"
//                     className="widget-media dz-scroll p-3"
//                     style={{ height: 380 }}
//                   >
//                     <ul className="timeline">
//                       <li>
//                         <div className="timeline-panel">
//                           <div className="media me-2">
//                             <img
//                               alt="image"
//                               width={50}
//                               src="../assets/images/avatar/1.jpg"
//                             />
//                           </div>
//                           <div className="media-body">
//                             <h6 className="mb-1">Dr sultads Send you Photo</h6>
//                             <small className="d-block">
//                               29 July 2020 - 02:26 PM
//                             </small>
//                           </div>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="timeline-panel">
//                           <div className="media me-2 media-info">KG</div>
//                           <div className="media-body">
//                             <h6 className="mb-1">
//                               Resport created successfully
//                             </h6>
//                             <small className="d-block">
//                               29 July 2020 - 02:26 PM
//                             </small>
//                           </div>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="timeline-panel">
//                           <div className="media me-2 media-success">
//                             <i className="fa fa-home" />
//                           </div>
//                           <div className="media-body">
//                             <h6 className="mb-1">Reminder : Treatment Time!</h6>
//                             <small className="d-block">
//                               29 July 2020 - 02:26 PM
//                             </small>
//                           </div>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="timeline-panel">
//                           <div className="media me-2">
//                             <img
//                               alt="image"
//                               width={50}
//                               src="../assets/images/avatar/1.jpg"
//                             />
//                           </div>
//                           <div className="media-body">
//                             <h6 className="mb-1">Dr sultads Send you Photo</h6>
//                             <small className="d-block">
//                               29 July 2020 - 02:26 PM
//                             </small>
//                           </div>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="timeline-panel">
//                           <div className="media me-2 media-danger">KG</div>
//                           <div className="media-body">
//                             <h6 className="mb-1">
//                               Resport created successfully
//                             </h6>
//                             <small className="d-block">
//                               29 July 2020 - 02:26 PM
//                             </small>
//                           </div>
//                         </div>
//                       </li>
//                       <li>
//                         <div className="timeline-panel">
//                           <div className="media me-2 media-primary">
//                             <i className="fa fa-home" />
//                           </div>
//                           <div className="media-body">
//                             <h6 className="mb-1">Reminder : Treatment Time!</h6>
//                             <small className="d-block">
//                               29 July 2020 - 02:26 PM
//                             </small>
//                           </div>
//                         </div>
//                       </li>
//                     </ul>
//                   </div>
//                   <a className="all-notification" href="javascript:void(0);">
//                     See all notifications <i className="ti-arrow-end" />
//                   </a>
//                 </div>
//               </li>
//               <li className="nav-item dropdown notification_dropdown">
//                 <a
//                   className="nav-link bell-link nav-action "
//                   href="javascript:void(0);"
//                 >
//                   <svg
//                     width={28}
//                     height={28}
//                     viewBox="0 0 28 28"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M14.8257 17.5282C14.563 17.6783 14.2627 17.7534 14 17.7534C13.7373 17.7534 13.437 17.6783 13.1743 17.5282L0 9.49598V20.193C0 22.4826 1.83914 24.3217 4.12869 24.3217H23.8713C26.1609 24.3217 28 22.4826 28 20.193V9.49598L14.8257 17.5282Z"
//                       fill="#737B8B"
//                     />
//                     <path
//                       d="M23.8713 3.67829H4.12863C2.17689 3.67829 0.525417 5.06703 0.112549 6.90617L13.9999 15.3887L27.8873 6.90617C27.4745 5.06703 25.823 3.67829 23.8713 3.67829Z"
//                       fill="#737B8B"
//                     />
//                   </svg>
//                   <span className="badge light text-white bg-primary rounded-circle" />
//                 </a>
//               </li>
//               <li className="nav-item dropdown header-profile">
//                 <div
//                   id="datepicker"
//                   className="input-group date dz-calender"
//                   data-date-format="mm-dd-yyyy"
//                 >
//                   <span className="input-group-addon d-flex align-items-center">
//                     <svg
//                       width={18}
//                       height={18}
//                       viewBox="0 0 18 18"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M14.8337 3.16667H14.0003V1.50001C14.0003 1.27899 13.9125 1.06703 13.7563 0.910749C13.6 0.754469 13.388 0.666672 13.167 0.666672C12.946 0.666672 12.734 0.754469 12.5777 0.910749C12.4215 1.06703 12.3337 1.27899 12.3337 1.50001V3.16667H5.66699V1.50001C5.66699 1.27899 5.5792 1.06703 5.42292 0.910749C5.26663 0.754469 5.05467 0.666672 4.83366 0.666672C4.61265 0.666672 4.40068 0.754469 4.2444 0.910749C4.08812 1.06703 4.00033 1.27899 4.00033 1.50001V3.16667H3.16699C2.50395 3.16667 1.86807 3.43006 1.39923 3.8989C0.930384 4.36775 0.666992 5.00363 0.666992 5.66667V6.5H17.3337V5.66667C17.3337 5.00363 17.0703 4.36775 16.6014 3.8989C16.1326 3.43006 15.4967 3.16667 14.8337 3.16667Z"
//                         fill="#F66F4D"
//                       />
//                       <path
//                         d="M0.666992 14.8333C0.666992 15.4964 0.930384 16.1322 1.39923 16.6011C1.86807 17.0699 2.50395 17.3333 3.16699 17.3333H14.8337C15.4967 17.3333 16.1326 17.0699 16.6014 16.6011C17.0703 16.1322 17.3337 15.4964 17.3337 14.8333V8.16666H0.666992V14.8333Z"
//                         fill="#F66F4D"
//                       />
//                     </svg>
//                   </span>
//                   <input className="form-control" type="text" readOnly="" />
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </div>
//     </div>
//     {/***********************************
//       Header end ti-comment-alt
//   ************************************/}
//     {/***********************************
//       Sidebar start
//   ************************************/}
//     <div className="deznav">
//       <div className="deznav-scroll">
//         <div className=" dropdown header-bx">
//           <a
//             className="nav-link header-profile2 position-relative"
//             href="javascript:void(0);"
//             role="button"
//             data-bs-toggle="dropdown"
//           >
//             <div className="header-img position-relative">
//               <img src="../assets/images/header-img/pic-1.jpg" alt="header-img" />
//               <svg
//                 className="header-circle"
//                 width={130}
//                 height={130}
//                 viewBox="0 0 130 130"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M130 65C130 100.899 100.899 130 65 130C29.1015 130 0 100.899 0 65C0 29.1015 29.1015 0 65 0C100.899 0 130 29.1015 130 65ZM4.99306 65C4.99306 98.1409 31.8591 125.007 65 125.007C98.1409 125.007 125.007 98.1409 125.007 65C125.007 31.8591 98.1409 4.99306 65 4.99306C31.8591 4.99306 4.99306 31.8591 4.99306 65Z"
//                   fill="#FFD482"
//                 />
//                 <path
//                   d="M65 2.49653C65 1.11774 66.1182 -0.00500592 67.496 0.0479365C76.3746 0.389105 85.0984 2.54751 93.1247 6.39966C101.902 10.6123 109.621 16.7428 115.711 24.3385C121.802 31.9341 126.108 40.8009 128.312 50.284C130.516 59.7671 130.562 69.6242 128.446 79.1274C126.33 88.6305 122.106 97.5369 116.087 105.189C110.067 112.841 102.406 119.043 93.6677 123.337C84.9299 127.631 75.3391 129.907 65.6037 129.997C56.7012 130.08 47.8858 128.333 39.7012 124.875C38.4312 124.338 37.895 122.847 38.48 121.598C39.065 120.35 40.5495 119.817 41.8213 120.35C49.3273 123.493 57.4027 125.08 65.5573 125.004C74.5449 124.921 83.399 122.819 91.4656 118.855C99.5322 114.891 106.605 109.166 112.162 102.102C117.72 95.0375 121.619 86.8153 123.572 78.0421C125.526 69.269 125.484 60.1691 123.449 51.4145C121.414 42.6598 117.438 34.4741 111.816 27.4619C106.193 20.4497 99.0674 14.7901 90.9643 10.9011C83.6123 7.3726 75.6263 5.38343 67.4958 5.04499C66.1182 4.98764 65 3.87533 65 2.49653Z"
//                   fill="var(--primary)"
//                 />
//               </svg>
//               <div className="header-edit position-absolute">
//                 <svg
//                   width={20}
//                   height={20}
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M3.02526 12.5567L7.44727 16.9762L16.2481 8.17043L11.8261 3.75092L3.02526 12.5567Z"
//                     fill="#fff"
//                   />
//                   <path
//                     d="M19.6341 3.01762L16.9827 0.366211C16.7401 0.123594 16.4227 0.00160156 16.1051 0H16.0919C15.7743 0.00160156 15.4573 0.123594 15.2153 0.366211L13.4453 2.13383L17.8665 6.55262L19.6342 4.785C19.8768 4.54238 19.9988 4.22539 20.0004 3.90781V3.89461C19.9987 3.57719 19.8767 3.2602 19.6341 3.01762Z"
//                     fill="#fff"
//                   />
//                   <path
//                     d="M0 20L5.745 18.6738L1.32379 14.255L0 20Z"
//                     fill="#fff"
//                   />
//                 </svg>
//               </div>
//             </div>
//             <div className="header-content">
//               <h2 className="font-w500">Alex Geovanny</h2>
//               <span className="font-w400">demo@mail.com</span>
//             </div>
//           </a>
//         </div>
//         <ul className="metismenu" id="menu">
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-025-dashboard" />
//               <span className="nav-text">Dashboard</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="index.html">Dashboard Light</a>
//               </li>
//               <li>
//                 <a href="index-2.html">Dashboard Dark</a>
//               </li>
//               <li>
//                 <a href="guest-list.html">Guest List</a>
//               </li>
//               <li>
//                 <a href="guest-details.html">Guest Details</a>
//               </li>
//               <li>
//                 <a href="concierge.html">Concierge</a>
//               </li>
//               <li>
//                 <a href="room.html">Rooms</a>
//               </li>
//               <li>
//                 <a href="review.html">Reviews</a>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-050-info" />
//               <span className="nav-text">Apps</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="app-profile.html">Profile</a>
//               </li>
//               <li>
//                 <a href="post-details.html">Post Details</a>
//               </li>
//               <li>
//                 <a
//                   className="has-arrow"
//                   href="javascript:void()"
//                   aria-expanded="false"
//                 >
//                   Email
//                 </a>
//                 <ul aria-expanded="false">
//                   <li>
//                     <a href="email-compose.html">Compose</a>
//                   </li>
//                   <li>
//                     <a href="email-inbox.html">Inbox</a>
//                   </li>
//                   <li>
//                     <a href="email-read.html">Read</a>
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                 <a href="app-calender.html">Calendar</a>
//               </li>
//               <li>
//                 <a
//                   className="has-arrow"
//                   href="javascript:void()"
//                   aria-expanded="false"
//                 >
//                   Shop
//                 </a>
//                 <ul aria-expanded="false">
//                   <li>
//                     <a href="ecom-product-grid.html">Product Grid</a>
//                   </li>
//                   <li>
//                     <a href="ecom-product-list.html">Product List</a>
//                   </li>
//                   <li>
//                     <a href="ecom-product-detail.html">Product Details</a>
//                   </li>
//                   <li>
//                     <a href="ecom-product-order.html">Order</a>
//                   </li>
//                   <li>
//                     <a href="ecom-checkout.html">Checkout</a>
//                   </li>
//                   <li>
//                     <a href="ecom-invoice.html">Invoice</a>
//                   </li>
//                   <li>
//                     <a href="ecom-customers.html">Customers</a>
//                   </li>
//                 </ul>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-041-graph" />
//               <span className="nav-text">Charts</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="chart-flot.html">Flot</a>
//               </li>
//               <li>
//                 <a href="chart-morris.html">Morris</a>
//               </li>
//               <li>
//                 <a href="chart-chartjs.html">Chartjs</a>
//               </li>
//               <li>
//                 <a href="chart-chartist.html">Chartist</a>
//               </li>
//               <li>
//                 <a href="chart-sparkline.html">Sparkline</a>
//               </li>
//               <li>
//                 <a href="chart-peity.html">Peity</a>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-086-star" />
//               <span className="nav-text">Bootstrap</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="ui-accordion.html">Accordion</a>
//               </li>
//               <li>
//                 <a href="ui-alert.html">Alert</a>
//               </li>
//               <li>
//                 <a href="ui-badge.html">Badge</a>
//               </li>
//               <li>
//                 <a href="ui-button.html">Button</a>
//               </li>
//               <li>
//                 <a href="ui-modal.html">Modal</a>
//               </li>
//               <li>
//                 <a href="ui-button-group.html">Button Group</a>
//               </li>
//               <li>
//                 <a href="ui-list-group.html">List Group</a>
//               </li>
//               <li>
//                 <a href="ui-card.html">Cards</a>
//               </li>
//               <li>
//                 <a href="ui-carousel.html">Carousel</a>
//               </li>
//               <li>
//                 <a href="ui-dropdown.html">Dropdown</a>
//               </li>
//               <li>
//                 <a href="ui-popover.html">Popover</a>
//               </li>
//               <li>
//                 <a href="ui-progressbar.html">Progressbar</a>
//               </li>
//               <li>
//                 <a href="ui-tab.html">Tab</a>
//               </li>
//               <li>
//                 <a href="ui-typography.html">Typography</a>
//               </li>
//               <li>
//                 <a href="ui-pagination.html">Pagination</a>
//               </li>
//               <li>
//                 <a href="ui-grid.html">Grid</a>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-045-heart" />
//               <span className="nav-text">Plugins</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="uc-select2.html">Select 2</a>
//               </li>
//               <li>
//                 <a href="uc-nestable.html">Nestedable</a>
//               </li>
//               <li>
//                 <a href="uc-noui-slider.html">Noui Slider</a>
//               </li>
//               <li>
//                 <a href="uc-sweetalert.html">Sweet Alert</a>
//               </li>
//               <li>
//                 <a href="uc-toastr.html">Toastr</a>
//               </li>
//               <li>
//                 <a href="map-jqvmap.html">Jqv Map</a>
//               </li>
//               <li>
//                 <a href="uc-lightgallery.html">Light Gallery</a>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a href="widget-basic.html" className="" aria-expanded="false">
//               <i className="flaticon-013-checkmark" />
//               <span className="nav-text">Widget</span>
//             </a>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-072-printer" />
//               <span className="nav-text">Forms</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="form-element.html">Form Elements</a>
//               </li>
//               <li>
//                 <a href="form-wizard.html">Wizard</a>
//               </li>
//               <li>
//                 <a href="form-ckeditor.html">CkEditor</a>
//               </li>
//               <li>
//                 <a href="form-pickers.html">Pickers</a>
//               </li>
//               <li>
//                 <a href="form-validation.html">Form Validate</a>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-043-menu" />
//               <span className="nav-text">Table</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="table-bootstrap-basic.html">Bootstrap</a>
//               </li>
//               <li>
//                 <a href="table-datatable-basic.html">Datatable</a>
//               </li>
//             </ul>
//           </li>
//           <li>
//             <a
//               className="has-arrow "
//               href="javascript:void()"
//               aria-expanded="false"
//             >
//               <i className="flaticon-022-copy" />
//               <span className="nav-text">Pages</span>
//             </a>
//             <ul aria-expanded="false">
//               <li>
//                 <a href="page-login.html">Login</a>
//               </li>
//               <li>
//                 <a href="page-register.html">Register</a>
//               </li>
//               <li>
//                 <a
//                   className="has-arrow"
//                   href="javascript:void()"
//                   aria-expanded="false"
//                 >
//                   Error
//                 </a>
//                 <ul aria-expanded="false">
//                   <li>
//                     <a href="page-error-400.html">Error 400</a>
//                   </li>
//                   <li>
//                     <a href="page-error-403.html">Error 403</a>
//                   </li>
//                   <li>
//                     <a href="page-error-404.html">Error 404</a>
//                   </li>
//                   <li>
//                     <a href="page-error-500.html">Error 500</a>
//                   </li>
//                   <li>
//                     <a href="page-error-503.html">Error 503</a>
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                 <a href="page-lock-screen.html">Lock Screen</a>
//               </li>
//               <li>
//                 <a href="empty-page.html">Empty Page</a>
//               </li>
//             </ul>
//           </li>
//         </ul>
//         <div className="copyright">
//           <h6>
//             Kamr Hotel Admin Dashboard{" "}
//             <span className="fs-14 font-w400">© 2022 All Rights Reserved</span>
//           </h6>
//           <p className="fs-12 mb-4">
//             Made with <span className="heart" /> by DexignLab
//           </p>
//         </div>
//       </div>
//     </div>
//     {/***********************************
//       Sidebar end
//   ************************************/}
//     {/***********************************
//       Content body start
//   ************************************/}
//     <div className="content-body">
//       {/* row */}
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-xl-12">
//             <div className="col-xl-12 card h-auto">
//               <div className="card-body">
//                 <div className="row align-items-center">
//                   <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                     <div className="income-data d-flex align-items-center justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                       <span className=" income-icon style-1 me-4">
//                         <svg
//                           width={30}
//                           height={30}
//                           viewBox="0 0 30 30"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M20.4764 0.97345C20.4255 0.974639 20.3747 0.978331 20.3241 0.984696C19.9555 1.02962 19.6167 1.20961 19.3732 1.48989C19.1297 1.77018 18.9988 2.13096 19.0057 2.50219V29.4991C19.0077 29.8041 19.1026 30.1012 19.2778 30.3509C19.453 30.6006 19.7001 30.7909 19.9862 30.8966C20.2723 31.0022 20.5838 31.0183 20.8792 30.9424C21.1746 30.8665 21.4398 30.7023 21.6395 30.4718L30.6425 19.9748C30.7704 19.8249 30.8676 19.6513 30.9284 19.4639C30.9893 19.2765 31.0126 19.079 30.9971 18.8825C30.9816 18.6861 30.9276 18.4946 30.8381 18.319C30.7486 18.1435 30.6254 17.9875 30.4755 17.8595C30.3257 17.7316 30.1521 17.6344 29.9647 17.5735C29.7773 17.5127 29.5797 17.4893 29.3833 17.5048C29.1869 17.5204 28.9954 17.5745 28.8199 17.664C28.6443 17.7535 28.4882 17.8766 28.3602 18.0265L21.994 25.4444V2.50219C21.9976 2.30152 21.9608 2.10206 21.8859 1.91585C21.811 1.72965 21.6995 1.56043 21.5579 1.41809C21.4164 1.27576 21.2478 1.16328 21.062 1.08729C20.8763 1.01131 20.6771 0.973336 20.4764 0.975699L20.4764 0.97345ZM11.453 1.00736C11.2441 1.01319 11.0388 1.0627 10.8501 1.15252C10.6614 1.24234 10.4935 1.37054 10.3573 1.52899L1.3661 12.026C1.22021 12.1722 1.10608 12.3469 1.03084 12.5392C0.955604 12.7315 0.920883 12.9374 0.928852 13.1437C0.936821 13.3501 0.98731 13.5526 1.07716 13.7385C1.167 13.9245 1.29427 14.0897 1.45099 14.2242C1.60771 14.3587 1.79051 14.4595 1.98794 14.52C2.18537 14.5806 2.39318 14.5997 2.59835 14.5763C2.80352 14.5528 3.00163 14.4871 3.18029 14.3835C3.35895 14.2799 3.51429 14.1407 3.6366 13.9743L10.0028 6.55623V29.4988C9.99838 29.6986 10.0339 29.8972 10.1073 30.0831C10.1807 30.2689 10.2905 30.4383 10.4302 30.5812C10.5699 30.724 10.7368 30.8374 10.921 30.9149C11.1052 30.9924 11.303 31.0324 11.5028 31.0324C11.7026 31.0324 11.9005 30.9924 12.0847 30.9149C12.2689 30.8374 12.4357 30.724 12.5754 30.5812C12.7152 30.4383 12.8249 30.2689 12.8983 30.0831C12.9717 29.8972 13.0072 29.6986 13.0028 29.4988V2.50167C13.0021 2.30093 12.9611 2.10237 12.8823 1.91775C12.8035 1.73314 12.6884 1.56607 12.5439 1.42674C12.3993 1.28741 12.2283 1.17853 12.041 1.1065C11.8536 1.03447 11.6536 1.00089 11.453 1.00753V1.00736Z"
//                             fill="#fff"
//                           />
//                         </svg>
//                       </span>
//                       <div>
//                         <h2 className="font-w600 mb-0 income-value">$45,945</h2>
//                         <span className=" fs-6 font-w500">Total incomes</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                     <div className="d-flex align-items-end justify-content-xl-start justify-content-between mb-xl-0 mb-3">
//                       <div id="NewCustomers" />
//                       <div className=" ms-3">
//                         <h6 className="fs-18 font-w600 mb-0 text-success">
//                           +2.4%
//                         </h6>
//                         <span className="fs-14 font-w400">Than last week</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                     <div className="card trading mb-sm-0 mb-3">
//                       <div className="card-body">
//                         <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2 ps-lg-0">
//                           <div>
//                             <h3 className="font-w600 fs-2 mb-0 text-white">
//                               845
//                             </h3>
//                             <span className="fs-6 font-w500 text-white">
//                               New Guest
//                             </span>
//                           </div>
//                           <span className="income-icon style-2">
//                             <svg
//                               width={34}
//                               height={24}
//                               viewBox="0 0 34 24"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 d="M33.5 22.5C33.5 22.8978 33.342 23.2793 33.0607 23.5606C32.7794 23.8419 32.3978 24 32 24H14C13.6022 24 13.2206 23.8419 12.9393 23.5606C12.658 23.2793 12.5 22.8978 12.5 22.5C12.5 20.113 13.4482 17.8238 15.136 16.136C16.8239 14.4482 19.1131 13.5 21.5 13.5H24.5C26.8869 13.5 29.1761 14.4482 30.864 16.136C32.5518 17.8238 33.5 20.113 33.5 22.5ZM23 0C21.8133 0 20.6533 0.351893 19.6666 1.01118C18.6799 1.67047 17.9108 2.60754 17.4567 3.7039C17.0026 4.80025 16.8838 6.00665 17.1153 7.17053C17.3468 8.33442 17.9182 9.40352 18.7574 10.2426C19.5965 11.0817 20.6656 11.6532 21.8295 11.8847C22.9933 12.1162 24.1997 11.9974 25.2961 11.5433C26.3925 11.0891 27.3295 10.3201 27.9888 9.33341C28.6481 8.34672 29 7.18668 29 5.99999C29 4.4087 28.3679 2.88257 27.2426 1.75736C26.1174 0.63214 24.5913 0 23 0ZM9.5 0C8.31331 0 7.15327 0.351893 6.16658 1.01118C5.17988 1.67047 4.41085 2.60754 3.95672 3.7039C3.5026 4.80025 3.38378 6.00665 3.61529 7.17053C3.8468 8.33442 4.41824 9.40352 5.25736 10.2426C6.09647 11.0817 7.16557 11.6532 8.32946 11.8847C9.49334 12.1162 10.6997 11.9974 11.7961 11.5433C12.8925 11.0891 13.8295 10.3201 14.4888 9.33341C15.1481 8.34672 15.5 7.18668 15.5 5.99999C15.5 4.4087 14.8679 2.88257 13.7426 1.75736C12.6174 0.63214 11.0913 0 9.5 0ZM9.5 22.5C9.49777 20.9244 9.80818 19.364 10.4133 17.9093C11.0183 16.4545 11.9061 15.1342 13.025 14.025C12.1093 13.6793 11.1388 13.5014 10.16 13.5H8.84C6.62931 13.504 4.5103 14.3839 2.94711 15.9471C1.38391 17.5103 0.503965 19.6293 0.5 21.84V22.5C0.5 22.8978 0.658035 23.2793 0.93934 23.5606C1.22064 23.8419 1.60218 24 2 24H9.77C9.59537 23.519 9.50406 23.0117 9.5 22.5Z"
//                                 fill="#FFFFFF"
//                               />
//                             </svg>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                     <div className="card booking mb-0">
//                       <div className="card-body">
//                         <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
//                           <div>
//                             <h3 className="font-w600 fs-2 mb-0">195</h3>
//                             <span className="fs-6 font-w500">Rooms</span>
//                           </div>
//                           <span className="income-icon style-3">
//                             <svg
//                               width={28}
//                               height={28}
//                               viewBox="0 0 28 28"
//                               fill="none"
//                               xmlns="http://www.w3.org/2000/svg"
//                             >
//                               <path
//                                 d="M20.0734 0C15.6988 0 12.1485 3.54844 12.1485 7.92443C12.1485 9.14474 12.4477 10.2895 12.9391 11.3213L0.516482 23.7488C-0.172161 24.4374 -0.172161 25.5504 0.516482 26.239L1.76163 27.4841C2.09101 27.8152 2.53822 28 3.00678 28C3.47341 28 3.92084 27.8152 4.25193 27.4841L7.02037 24.7158L9.551 27.2516C9.88209 27.581 10.3292 27.7658 10.7962 27.7658C11.2648 27.7658 11.7119 27.5827 12.0413 27.2516L12.6649 26.6284C13.3535 25.9398 13.3535 24.8269 12.6649 24.1382L10.1306 21.6024L16.6763 15.0566C17.7118 15.5497 18.853 15.8489 20.0751 15.8489C24.453 15.8489 28 12.3004 28 7.92443C28 3.54844 24.4533 0 20.0734 0ZM20.0734 12.3269C17.6448 12.3269 15.6706 10.3509 15.6706 7.92443C15.6706 5.49796 17.6448 3.52197 20.0734 3.52197C22.502 3.52197 24.4761 5.49796 24.4761 7.92443C24.4761 10.3509 22.502 12.3269 20.0734 12.3269Z"
//                                 fill="var(--primary)"
//                               />
//                             </svg>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-5 mb-4">
//               <div className="d-flex align-items-center justify-content-between mb-sm-0 mb-2">
//                 <h2 className="font-w500">Popular Rooms</h2>
//                 <div className="swiper-pagination style-1 room-swiper-pagination" />
//               </div>
//               <div className="swiper front-view-slider">
//                 <div className="swiper-wrapper">
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/image2.png" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-success">AVAILABLE</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">404 Brrom Str, Fl2</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-1.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-primary">Booked</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">235 Cream, G32</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-2.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-success">AVAILABLE</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">992 Green, HF</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-3.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-success">AVAILABLE</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           914 White Cream
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-4.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-primary">Booked</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">172 Grey 22F, JF</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-5.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-primary">Booked</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">235 Cream, G32</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-6.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-primary">Booked</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">235 Cream, G32</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-7.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-primary">Booked</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">235 Cream, G32</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="swiper-slide">
//                     <div className="popular-rooms">
//                       <img src="../assets/images/roomgrid-img/pic-8.jpg" alt="image" />
//                       <div className="content">
//                         <span className="badge badge-primary">Booked</span>
//                         <h3 className="font-w500 text-white pt-3 pb-2 m-0">
//                           <a href="javascript:void(0);">235 Cream, G32</a>
//                         </h3>
//                         <span className="font-w400 text-white">Type 234</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-xl-6">
//                 <div className="card">
//                   <div className="card-header border-0 pb-0 flex-wrap">
//                     <h3 className="mb-1">Guest Activity</h3>
//                     <div className="card-action coin-tabs mt-3 mt-sm-0">
//                       <ul className="nav nav-tabs" role="tablist">
//                         <li className="nav-item">
//                           <a
//                             className="nav-link"
//                             data-bs-toggle="tab"
//                             href="#month"
//                             role="tab"
//                             aria-selected="false"
//                           >
//                             Month
//                           </a>
//                         </li>
//                         <li className="nav-item">
//                           <a
//                             className="nav-link active"
//                             data-bs-toggle="tab"
//                             href="#weekly"
//                             role="tab"
//                             aria-selected="true"
//                           >
//                             Weekly
//                           </a>
//                         </li>
//                         <li className="nav-item">
//                           <a
//                             className="nav-link"
//                             data-bs-toggle="tab"
//                             href="#day"
//                             role="tab"
//                             aria-selected="false"
//                           >
//                             Day
//                           </a>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="card-body pb-2">
//                     <div className="d-flex align-items-center mb-5">
//                       <div className="d-flex align-items-center flex-lg-wrap me-5 flex-wrap">
//                         <span className="me-3 d-flex align-items-center">
//                           <svg
//                             className="me-2"
//                             width={12}
//                             height={13}
//                             viewBox="0 0 12 13"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <rect
//                               y="0.716797"
//                               width={12}
//                               height={12}
//                               rx={4}
//                               fill="var(--primary)"
//                             />
//                           </svg>
//                           Check In
//                         </span>
//                         <h4 className="mb-0">457 Guest</h4>
//                       </div>
//                       <div className="d-flex align-items-center flex-lg-wrap flex-wrap">
//                         <span className=" squre me-3 d-flex align-items-center">
//                           <svg
//                             className="me-2"
//                             width={12}
//                             height={13}
//                             viewBox="0 0 12 13"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <rect
//                               y="0.716797"
//                               width={12}
//                               height={12}
//                               rx={4}
//                               fill="#ff9d43"
//                             />
//                           </svg>
//                           Check Out
//                         </span>
//                         <h4 className="mb-0">157 Guest</h4>
//                       </div>
//                     </div>
//                     <div className="tab-content">
//                       <div className="tab-pane fade show active" id="month">
//                         <div
//                           id="reservationChart"
//                           className="reservationChart"
//                         />
//                       </div>
//                       <div className="tab-pane fade" id="weekly">
//                         <div
//                           id="reservationChart1"
//                           className="reservationChart"
//                         />
//                       </div>
//                       <div className="tab-pane fade" id="day">
//                         <div
//                           id="reservationChart2"
//                           className="reservationChart"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                 <div className="card availability line">
//                   <div className="card-header border-0">
//                     <h3>Rooms Availability</h3>
//                   </div>
//                   <div className="card-body pb-2">
//                     <div id="pieChart1" />
//                     <div className="d-flex justify-content-between pt-3 pt-sm-5 flex-wrap">
//                       <span>
//                         <span className="pills-lable bg-dark me-2" />
//                         Available
//                       </span>
//                       <h4>66 Rooms</h4>
//                     </div>
//                     <div className="d-flex justify-content-between flex-wrap">
//                       <span>
//                         <span className="pills-lable me-2" />
//                         Sold Out
//                       </span>
//                       <h4>129 Rooms</h4>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
//                 <div className="card">
//                   <div className="card-header border-0 pb-0">
//                     <h3 className="mb-0">Visitor</h3>
//                   </div>
//                   <div className="card-body pt-2 pb-2">
//                     <h2 className="text">12,456</h2>
//                     <div id="columnChart" className="crd-coloum" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-xl-3">
//                 <div className="card">
//                   <div className="card-header border-0 pb-0">
//                     <h3>Guest List</h3>
//                     <a
//                       href="javascript:void(0);"
//                       className="btn btn-primary light btn-sm"
//                     >
//                       More
//                     </a>
//                   </div>
//                   <div className="card-body">
//                     <div
//                       className="flex-column d-block nav-pills gap dz-scroll"
//                       id="Customerslist1"
//                     >
//                       <div className="d-flex guest-list mb-4">
//                         <img src="../assets/images/img1.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Jordyn George</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                       <div className="d-flex guest-list mb-4">
//                         <img src="../assets/images/img2.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Marilyn Bator</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                       <div className="d-flex guest-list mb-4">
//                         <img src="../assets/images/img3.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Jaxson Rosser</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                       <div className="d-flex guest-list mb-4">
//                         <img src="../assets/images/img4.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Davis Culhane</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                       <div className="d-flex guest-list mb-4">
//                         <img src="../assets/images/img5.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Lydia Westervelt</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                       <div className="d-flex guest-list mb-4">
//                         <img src="../assets/images/img5.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Lydia Westervelt</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                       <div className="d-flex guest-list">
//                         <img src="../assets/images/img5.jpg" alt="image" />
//                         <div>
//                           <h4 className="m-0">Lydia Westervelt</h4>
//                           <span className="text-primary">#GS-2234</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-xl-9">
//                 <div className="card">
//                   <div className="card-header border-0 pb-0 flex-wrap">
//                     <h3>Customer Reviews</h3>
//                     <div className="d-flex">
//                       <select className="form-control default-select style-1 me-3 ms-0 border">
//                         <option>Sort by Newest</option>
//                         <option>Oldest</option>
//                         <option>Newest</option>
//                       </select>
//                       <a
//                         href="javascript:void(0);"
//                         className="btn btn-primary light text-nowrap"
//                       >
//                         View more
//                       </a>
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col-xl-4 col-sm-5">
//                         <div
//                           className="nav review-tab flex-column d-block nav-pills gap dz-scroll mb-3"
//                           id="Customerslist2"
//                         >
//                           <a
//                             href="#v-pills-bella"
//                             data-bs-toggle="pill"
//                             className="nav-link active show"
//                           >
//                             <div className="d-flex guest-list">
//                               <img src="../assets/images/review1.jpg" alt="image" />
//                               <div>
//                                 <h4 className="m-0">Bella Morgan</h4>
//                                 <span>24min ago</span>
//                               </div>
//                             </div>
//                           </a>
//                           <a
//                             href="#v-pills-louis"
//                             data-bs-toggle="pill"
//                             className="nav-link"
//                           >
//                             <div className="d-flex guest-list">
//                               <img src="../assets/images/review2.jpg" alt="image" />
//                               <div>
//                                 <h4 className="m-0">Louis Pattinson</h4>
//                                 <span>24min ago</span>
//                               </div>
//                             </div>
//                           </a>
//                           <a
//                             href="#v-pills-hans"
//                             data-bs-toggle="pill"
//                             className="nav-link"
//                           >
//                             <div className="d-flex guest-list">
//                               <img src="../assets/images/review3.jpg" alt="image" />
//                               <div>
//                                 <h4 className="m-0">Hans Takeshi</h4>
//                                 <span>24min ago</span>
//                               </div>
//                             </div>
//                           </a>
//                           <a
//                             href="#v-pills-demian"
//                             data-bs-toggle="pill"
//                             className="nav-link"
//                           >
//                             <div className="d-flex guest-list">
//                               <img src="../assets/images/review4.jpg" alt="image" />
//                               <div>
//                                 <h4 className="m-0">Demian Sarumaha</h4>
//                                 <span>24min ago</span>
//                               </div>
//                             </div>
//                           </a>
//                           <a
//                             href="#v-pills-morgan"
//                             data-bs-toggle="pill"
//                             className="nav-link"
//                           >
//                             <div className="d-flex guest-list">
//                               <img src="../assets/images/review1.jpg" alt="image" />
//                               <div>
//                                 <h4 className="m-0">Bella Morgan</h4>
//                                 <span>24min ago</span>
//                               </div>
//                             </div>
//                           </a>
//                           <a
//                             href="#v-pills-morgan1"
//                             data-bs-toggle="pill"
//                             className="nav-link"
//                           >
//                             <div className="d-flex guest-list">
//                               <img src="../assets/images/review1.jpg" alt="image" />
//                               <div>
//                                 <h4 className="m-0">Bella Morgan</h4>
//                                 <span>24min ago</span>
//                               </div>
//                             </div>
//                           </a>
//                         </div>
//                       </div>
//                       <div className="col-xl-8 col-sm-7">
//                         <div className="tab-content">
//                           <div
//                             id="v-pills-bella"
//                             className="tab-pane r-tab fade active show"
//                           >
//                             <h3 className="font-w500">
//                               I love that room service
//                             </h3>
//                             <ul className="star-review">
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                             </ul>
//                             <p className="review-para mt-xl-4 mt-md-3 mt-sm-2 mt-2">
//                               We were totally refreshed and rejuvenated for the
//                               whole of next year and it was due to the relaxing
//                               stay at the hotel. The hotel is absolutely
//                               marvelous! We liked absolutely everything,
//                               starting from the breakfast through to the perfect
//                               room service including the cleanliness and extra
//                               services such as
//                             </p>
//                             <div className="mb-sm-2">
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm "
//                               >
//                                 Great Service
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm mx-xl-3 mx-md-0"
//                               >
//                                 Recomended
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm "
//                               >
//                                 Best Price
//                               </a>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-between flex-md-wrap flex-sm-wrap flex-wrap mt-3 mt-sm-5 pt-xl-5 pt-lg-0 mb-0 mb-sm-0">
//                               <div className="d-flex guest-list mb-xl-0 mb-md-2 mb-sm-2 mb-2">
//                                 <img src="../assets/images/review1.jpg" alt="image" />
//                                 <div>
//                                   <h4 className="m-0">Bella Morgan</h4>
//                                   <span>24min ago</span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-success border-0 me-sm-3 me-0"
//                                 >
//                                   Accept
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM8.7898 15.0484L4.4107 10.6694L6.06781 9.01227L8.86648 11.8109L14.485 6.70344L16.062 8.43723L8.7898 15.0484Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-primary border-0"
//                                 >
//                                   Reject
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM14.9719 13.8148L13.3148 15.4719L10 12.1571L6.68523 15.4719L5.02812 13.8148L8.34289 10.5L5.02812 7.18523L6.68523 5.52812L10 8.84289L13.3148 5.52812L14.9719 7.18523L11.6571 10.5L14.9719 13.8148Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                           <div
//                             id="v-pills-louis"
//                             className="tab-pane r-tab fade"
//                           >
//                             <h3>I love that room service</h3>
//                             <ul className="star-review">
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                             </ul>
//                             <p className="review-para mt-xl-4 mt-md-3 mt-sm-2 mt-2">
//                               We were totally refreshed and rejuvenated for the
//                               whole of next year and it was due to the relaxing
//                               stay at the hotel. The hotel is absolutely
//                               marvelous! We liked absolutely everything,
//                               starting from the breakfast through to the perfect
//                               room service including the cleanliness and extra
//                               services such as
//                             </p>
//                             <div className="mb-sm-2">
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Great Service
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm mx-xl-3 mx-md-0"
//                               >
//                                 Recomended
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm "
//                               >
//                                 Best Price
//                               </a>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-between flex-md-wrap flex-sm-wrap flex-wrap mt-3 mt-sm-5 pt-xl-5 pt-lg-0 mb-3 mb-sm-0">
//                               <div className="d-flex guest-list mb-xl-0 mb-md-2 mb-sm-2 mb-2">
//                                 <img src="../assets/images/review2.jpg" alt="image" />
//                                 <div>
//                                   <h4 className="m-0">Louis Pattinson</h4>
//                                   <span>24min ago</span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-success border-0 me-sm-3 me-0"
//                                 >
//                                   Accept
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM8.7898 15.0484L4.4107 10.6694L6.06781 9.01227L8.86648 11.8109L14.485 6.70344L16.062 8.43723L8.7898 15.0484Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-primary border-0"
//                                 >
//                                   Reject
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM14.9719 13.8148L13.3148 15.4719L10 12.1571L6.68523 15.4719L5.02812 13.8148L8.34289 10.5L5.02812 7.18523L6.68523 5.52812L10 8.84289L13.3148 5.52812L14.9719 7.18523L11.6571 10.5L14.9719 13.8148Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                           <div
//                             id="v-pills-hans"
//                             className="tab-pane r-tab fade"
//                           >
//                             <h3>I love that room service</h3>
//                             <ul className="star-review">
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                             </ul>
//                             <p className="review-para mt-xl-4 mt-md-3 mt-sm-2 mt-2">
//                               We were totally refreshed and rejuvenated for the
//                               whole of next year and it was due to the relaxing
//                               stay at the hotel. The hotel is absolutely
//                               marvelous! We liked absolutely everything,
//                               starting from the breakfast through to the perfect
//                               room service including the cleanliness and extra
//                               services such as
//                             </p>
//                             <div className="mb-sm-2">
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Great Service
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm mx-xl-3 mx-md-0"
//                               >
//                                 Recomended
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Best Price
//                               </a>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-between flex-md-wrap flex-sm-wrap flex-wrap mt-3 mt-sm-5 pt-xl-5 pt-lg-0 mb-0 mb-sm-0">
//                               <div className="d-flex guest-list mb-xl-0 mb-md-2 mb-sm-2 mb-2">
//                                 <img src="../assets/images/review3.jpg" alt="image" />
//                                 <div>
//                                   <h4 className="m-0">Hans Takeshi</h4>
//                                   <span>24min ago</span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-success border-0 me-sm-3 me-0"
//                                 >
//                                   Accept
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM8.7898 15.0484L4.4107 10.6694L6.06781 9.01227L8.86648 11.8109L14.485 6.70344L16.062 8.43723L8.7898 15.0484Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-primary border-0"
//                                 >
//                                   Reject
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM14.9719 13.8148L13.3148 15.4719L10 12.1571L6.68523 15.4719L5.02812 13.8148L8.34289 10.5L5.02812 7.18523L6.68523 5.52812L10 8.84289L13.3148 5.52812L14.9719 7.18523L11.6571 10.5L14.9719 13.8148Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                           <div
//                             id="v-pills-demian"
//                             className="tab-pane r-tab fade"
//                           >
//                             <h3>I love that room service</h3>
//                             <ul className="star-review">
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                             </ul>
//                             <p className="review-para mt-xl-4 mt-md-3 mt-sm-2 mt-2">
//                               We were totally refreshed and rejuvenated for the
//                               whole of next year and it was due to the relaxing
//                               stay at the hotel. The hotel is absolutely
//                               marvelous! We liked absolutely everything,
//                               starting from the breakfast through to the perfect
//                               room service including the cleanliness and extra
//                               services such as
//                             </p>
//                             <div className="mb-sm-2">
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Great Service
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm mx-xl-3 mx-md-0"
//                               >
//                                 Recomended
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Best Price
//                               </a>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-between flex-md-wrap flex-sm-wrap flex-wrap mt-3 mt-sm-5 pt-xl-5 pt-lg-0 mb-0 mb-sm-0">
//                               <div className="d-flex guest-list  mb-xl-0 mb-md-2 mb-sm-2 mb-2">
//                                 <img src="../assets/images/review4.jpg" alt="image" />
//                                 <div>
//                                   <h4 className="m-0">Demian Sarumaha</h4>
//                                   <span>24min ago</span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-success border-0 me-sm-3 me-0"
//                                 >
//                                   Accept
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM8.7898 15.0484L4.4107 10.6694L6.06781 9.01227L8.86648 11.8109L14.485 6.70344L16.062 8.43723L8.7898 15.0484Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-danger border-0"
//                                 >
//                                   Reject
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM14.9719 13.8148L13.3148 15.4719L10 12.1571L6.68523 15.4719L5.02812 13.8148L8.34289 10.5L5.02812 7.18523L6.68523 5.52812L10 8.84289L13.3148 5.52812L14.9719 7.18523L11.6571 10.5L14.9719 13.8148Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                           <div
//                             id="v-pills-morgan"
//                             className="tab-pane r-tab fade"
//                           >
//                             <h3>I love that room service</h3>
//                             <ul className="star-review">
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                             </ul>
//                             <p className="review-para mt-xl-4 mt-md-3 mt-sm-2 mt-2">
//                               We were totally refreshed and rejuvenated for the
//                               whole of next year and it was due to the relaxing
//                               stay at the hotel. The hotel is absolutely
//                               marvelous! We liked absolutely everything,
//                               starting from the breakfast through to the perfect
//                               room service including the cleanliness and extra
//                               services such as
//                             </p>
//                             <div>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Great Service
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm mx-xl-3 mx-md-0"
//                               >
//                                 Recomended
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm "
//                               >
//                                 Best Price
//                               </a>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-between flex-md-wrap flex-sm-wrap flex-wrap mt-3 mt-sm-5 pt-xl-5 pt-lg-0 mb-0 mb-sm-0">
//                               <div className="d-flex guest-list mb-xl-0 mb-md-2 mb-sm-2 mb-2">
//                                 <img src="../assets/images/review1.jpg" alt="image" />
//                                 <div>
//                                   <h4 className="m-0">Bella Morgan</h4>
//                                   <span>24min ago</span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-success border-0 me-sm-3 me-0"
//                                 >
//                                   Accept
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM8.7898 15.0484L4.4107 10.6694L6.06781 9.01227L8.86648 11.8109L14.485 6.70344L16.062 8.43723L8.7898 15.0484Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-primary border-0"
//                                 >
//                                   Reject
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM14.9719 13.8148L13.3148 15.4719L10 12.1571L6.68523 15.4719L5.02812 13.8148L8.34289 10.5L5.02812 7.18523L6.68523 5.52812L10 8.84289L13.3148 5.52812L14.9719 7.18523L11.6571 10.5L14.9719 13.8148Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                           <div
//                             id="v-pills-morgan1"
//                             className="tab-pane r-tab fade"
//                           >
//                             <h3>I love that room service</h3>
//                             <ul className="star-review">
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                               <li>
//                                 <i className="fas fa-star" />
//                               </li>
//                             </ul>
//                             <p className="review-para mt-xl-4 mt-md-3 mt-sm-2 mt-2">
//                               We were totally refreshed and rejuvenated for the
//                               whole of next year and it was due to the relaxing
//                               stay at the hotel. The hotel is absolutely
//                               marvelous! We liked absolutely everything,
//                               starting from the breakfast through to the perfect
//                               room service including the cleanliness and extra
//                               services such as
//                             </p>
//                             <div className="mb-sm-2">
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Great Service
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm mx-xl-3 mx-md-0"
//                               >
//                                 Recomended
//                               </a>
//                               <a
//                                 href="javascript:void(0);"
//                                 className="btn btn-dark light border-0 mb-2 btn-sm"
//                               >
//                                 Best Price
//                               </a>
//                             </div>
//                             <div className="d-flex align-items-center justify-content-between flex-md-wrap flex-sm-wrap flex-wrap mt-3 mt-sm-5 pt-xl-5 pt-lg-0 mb-0 mb-sm-0">
//                               <div className="d-flex guest-list mb-xl-0 mb-md-2 mb-sm-2 mb-2">
//                                 <img src="../assets/images/review1.jpg" alt="image" />
//                                 <div>
//                                   <h4 className="m-0">Bella Morgan</h4>
//                                   <span>24min ago</span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-success border-0 me-sm-3 me-0"
//                                 >
//                                   Accept
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM8.7898 15.0484L4.4107 10.6694L6.06781 9.01227L8.86648 11.8109L14.485 6.70344L16.062 8.43723L8.7898 15.0484Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                                 <a
//                                   href="javascript:void(0);"
//                                   className="btn btn-primary border-0"
//                                 >
//                                   Reject
//                                   <svg
//                                     className="ms-2"
//                                     width={20}
//                                     height={21}
//                                     viewBox="0 0 20 21"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                   >
//                                     <path
//                                       d="M10 0.5C4.50742 0.5 0 5.00742 0 10.5C0 15.9926 4.50742 20.5 10 20.5C15.4926 20.5 20 15.9926 20 10.5C20 5.00742 15.4926 0.5 10 0.5ZM14.9719 13.8148L13.3148 15.4719L10 12.1571L6.68523 15.4719L5.02812 13.8148L8.34289 10.5L5.02812 7.18523L6.68523 5.52812L10 8.84289L13.3148 5.52812L14.9719 7.18523L11.6571 10.5L14.9719 13.8148Z"
//                                       fill="white"
//                                     />
//                                   </svg>
//                                 </a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     {/***********************************
//       Content body end
//   ************************************/}
//     {/***********************************
//       Footer start
//   ************************************/}
//     <div className="footer">
//       <div className="copyright">
//         <p>
//           Copyright © Designed &amp; Developed by{" "}
//           <a href="https://dexignlab.com/" target="_blank">
//             DexignLab
//           </a>{" "}
//           2022
//         </p>
//       </div>
//     </div>
//     {/***********************************
//       Footer end
//   ************************************/}
//     {/***********************************
//      Support ticket button start
//   ************************************/}
//     {/***********************************
//      Support ticket button end
//   ************************************/}
//   </div>
//   {/***********************************
//   Main wrapper end
//     ************************************/}
// </>

//   );
// }

// export default App;

import Main_Router from './Routes/Route'

import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './Routes/Route';
import Login from './layout/Auth/Login';
import Wraper from './Components/Dashboard/Wraper/Wraper';
import html2canvas from 'html2canvas';


const App = () => {
  const pageRef = useRef(null);




  const captureScreenshot = () => {

    // console.log("pageRef.current", pageRef.current);
    // const options = {
    //   width: document.documentElement.scrollWidth, // Set custom width
    //   height: document.documentElement.scrollHeight, // Set custom height
    // };

    // // Set the window size and scroll position to match the content size
    // // window.resizeTo(width, height);
    // window.scrollTo(0, 0);

    // // Capture the screenshot
    // html2canvas(pageRef.current, options).then(canvas => {
    //   // Convert canvas to an image and download it
    //   const screenshot = canvas.toDataURL('image/png');
    //   const link = document.createElement('a');
    //   link.href = screenshot;
    //   link.download = 'screenshot.png';
    //   link.click();
    // })
  };



  return (
    <div >
      {/* <div ref={pageRef} > */}
        <Main_Router />
      {/* </div> */}
      {/* <button className='d-flex mx-auto' style={{ marginTop: '70px' }} onClick={captureScreenshot}>123Capture Screenshot</button> */}

    </div>
  )
}

export default App





