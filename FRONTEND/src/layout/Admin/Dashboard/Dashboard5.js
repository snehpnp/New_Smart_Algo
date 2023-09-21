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
    <div className='theme-5-dashboard'>
      <div className='row'>
        {arr.map((item, index) => {
          return <>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card booking mb-0 fifth-dahbaord-card">
                <div className="card-body">
                  <div className="income-data d-flex justify-content-between align-items-center mb-sm-0 mb-2  mb-sm-0 mb-2 ps-lg-0 ">
                    <div>
                      <span className="fs-4 font-w500">{item.name}</span>
                      <h3 className="font-w600 fs-2 mb-0">{item.value}</h3>
                      <Link href="#" className="mb-2" to={item.route}>
                        <i className="fa-regular fa-eye pe-1" ></i>View</Link>
                    </div>
                    <span className="income-icon style-3">
                      <img src='../assets/images/dash_icon/analyze.gif' className='w-100' />
                    </span>
                  </div>
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




