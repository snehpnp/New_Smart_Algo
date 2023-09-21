/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import { Link } from 'react-router-dom';


const Dashboard1 = ({ data }) => {
  let arr = [
    {
      index: 1,
      name: "Total  Client",
      value: data.data && data.data.total_client,
      icon: 'la la-users',
      route: "/admin/allclients"
    },
    {
      index: 2,
      name: "Admin Clients",
      value: data.data && data.data.admin_client,
      icon: 'la la-users',
      route: "/admin/allclients"
    },
    {
      index: 3,
      name: "Sub-Admin Clients",
      value: data.data && data.data.subadmin_client,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    },
    {
      index: 4,
      name: "Total Live Account",
      value: data.data && data.data.total_live,
      icon: 'la la-users',
      route: '/admin/allclients?filter=2'
    },
    {
      index: 5,
      name: "Active  Live Account",
      value: data.data && data.data.total_active_live,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    },
    {
      index: 6,
      name: "Expired Live Account",
      value: data.data && data.data.total_expired_live,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    },

    {
      index: 7,
      name: "Total Demo Account",
      value: data.data && data.data.total_demo,
      icon: 'la la-users',
      route: "/admin/allclients?filter=1"
    },
    {
      index: 8,
      name: "Active Demo Account",
      value: data.data && data.data.total_active_demo,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    },
    {
      index: 9,
      name: "Expired Demo Account",
      value: data.data && data.data.total_expired_demo,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    },
    {
      index: 10,
      name: "2 Days Only Account",
      value: data.data && data.data.total_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=0"
    },
    {
      index: 11,
      name: "2 Days Only Account",
      value: data.data && data.data.total_active_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=0"
    },
    {
      index: 12,
      name: "2 Days Only Account",
      value: data.data && data.data.total_expired_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=0"
    },
    {
      index: 13,
      name: "Total Licence",
      value: data.data && data.data.all_licence,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    }, {
      index: 14,
      name: "Remaining  Licence",
      value: data.data && data.data.remaining_licence,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    }, {
      index: 15,
      name: "Used  Licence",
      value: data.data && data.data.used_licence,
      icon: 'la la-users',
      route: "/admin/subadminclients"
    },
    {
      index: 16,
      name: "Total Subadmin",
      value: data.data && data.data.total_Subadmin,
      icon: 'la la-users',
      route: "/admin/allsubadmins"
    },
  ]
  return <>

    <div className="theme-10-dashboard">
      <div className="row">
        {arr.map((item, index) => {
          return <>
            <div className="col-xl-3 col-lg-3 col-xxl-3 col-md-4">
              <div className="card widget-stat border-0 sixth-dashboard-card">
                <div className="card-header border-0 pb-0">
                  <div className="media w-100">
                    <span className="me-3 bg-primary">
                      <i className="la la-users  text-white" />
                    </span>
                    <div className="media-body text-end">
                      <p className="mb-1">{item.name}</p>
                      <h3 className="">{item.value}</h3>
                      <h6><Link href="#" className="" to={item.route}>
                          <i className="fa-regular fa-eye pe-1" ></i>View</Link></h6>
                    </div>
                  </div>
                </div>
                <div className=" text-center">
                  <img
                    src="../assets/images/dash_icon/dash-6-icon.png"
                    className=""
                  />
                </div>
              </div>
            </div>
          </>
        })}
      </div>
    </div>
  </>
}


export default Dashboard1




