/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import { Link } from 'react-router-dom';


const Dashboard1 = ({ data }) => {

  let arr = [
    {
      index: 1,
      name: "Total  Client",
      value: data && data.total_client,
      icon: 'la la-users',
      route: "/admin/allclients",
      visible: false
    },
    {
      index: 2,
      name: "Total Active Client",
      value: data && data.total_active_client,
      icon: 'la la-users',
      route: '/admin/allclients?filter=111',
      visible: true

    },
    {
      index: 3,
      name: "Total Expired Client",
      value: data && data.total_expired_client,
      icon: 'la la-users',
      route: "/admin/expiredclients?filter=000",
      visible: true
    },
    {
      index: 4,
      name: "Total Live Client",
      value: data && data.total_live_client,
      icon: 'la la-users',
      route: "/admin/allclients?filter=2",
      visible: true
    },
    {
      index: 5,
      name: "Active Live Client",
      value: data && data.total_active_live,
      icon: 'la la-users',
      route: "/admin/allclients?filter=21",
      visible: true
    },
    {
      index: 6,
      name: "Expired Live Client",
      value: data && data.total_expired_live,
      icon: 'la la-users',
      route: "/admin/allclients?filter=20",
      visible: true
    },
    {
      index: 7,
      name: "Total Demo Client",
      value: data && data.total_demo_client,
      icon: 'la la-users',
      route: "/admin/allclients?filter=1",
      visible: true
    },
    {
      index: 8,
      name: "Active Demo Client",
      value: data && data.total_active_demo,
      icon: 'la la-users',
      route: "/admin/allclients?filter=11",
      visible: true
    },
    {
      index: 9,
      name: "Expired Demo Client",
      value: data && data.total_expired_demo,
      icon: 'la la-users',
      route: "/admin/allclients??filter=10",
      visible: true

    },
    {
      index: 10,
      name: "Total 2 Days Client",
      value: data && data.total_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=0",
      visible: true

    },
    {
      index: 11,
      name: "Active 2 Days Client",
      value: data && data.total_active_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=01",
      visible: true

    },
    {
      index: 12,
      name: "Expired 2 Days Client",
      value: data && data.total_expired_two_days,
      icon: 'la la-users',
      route: "/admin/allclients?filter=00",
      visible: true

    },
    {
      index: 13,
      name: "Total License",
      value: data && data.all_licence,
      icon: 'la la-users',
      route: "/admin/allLicence?filter=0",
      visible: true
    }, {
      index: 14,
      name: "Remaining  License",
      value: data && data.remaining_licence,
      icon: 'la la-users',
      route: "/admin/allLicence",
      visible: false
    }, {
      index: 15,
      name: "Used  License",
      value: data && data.used_licence,
      icon: 'la la-users',
      route: "/admin/allLicence?filter=1",
      visible: true
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




