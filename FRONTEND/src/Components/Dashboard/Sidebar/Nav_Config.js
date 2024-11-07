export const admin_sidebar = [
    {
        id: 1,
        name: 'Dashboard',
        Icon: 'LayoutDashboard',
        route: '/admin/dashboard',
        Data: []
    },
    {
        id: 2,
        name: 'Clients',
        Icon: 'Users',
        Data: [
            {
                id: 21,
                name: 'Add Client',
                route: '/admin/client/add',
            },
            {
                id: 22,
                name: 'Clients',
                route: '/admin/allclients',
            },
            {
                id: 23,
                name: 'Expired-Clients',
                route: '/admin/expiredclients',
            },
            {
                id: 24,
                name: 'SignUp Clients',
                route: '/admin/signupclient',
            },
            {
                id: 25,
                name: 'Star Clients',
                route: '/admin/allstarclients',
            }
        ]
    },
    {
        id: 3,
        name: 'Sub Admin',
        Icon: 'Users',
        Data: [
            {
                id: 31,
                name: 'All Sub Admins',
                route: '/admin/allsubadmins',
            },
            {
                id: 32,
                name: 'In-Active Clients',
                route: '/admin/subadminclients',
            }
        ]
    },
    {
        id: 4,
        name: 'Trade Details',
        Icon: 'FolderClock',
        Data: [
            {
                id: 41,
                name: 'Signals',
                route: '/admin/signals',
            },
            {
                id: 42,
                name: 'Trade History',
                route: '/admin/tradehistory?type=admin',
            },
            {
                id: 42,
                name: 'Order History',
                route: '/admin/tradehistory1?type=admin',
            },
            {
                id: 43,
                name: 'Client Trade',
                route: '/admin/tradehistory?type=client',
            },
            {
                id: 44,
                name: 'Trading Status',
                route: '/admin/tradingstatus',
            },
            {
                id: 45,
                name: '7 Days Entry',
                route: '/admin/sevendaysentry',
            }
        ]
    },
    {
        id: 5,
        name: 'Script Mgmt',
        Icon: 'Wrench',
        Data: [
            {
                id: 51,
                name: 'All Services',
                route: '/admin/allservices',
            },
            {
                id: 52,
                name: 'Group Services',
                route: '/admin/groupservices',
            },
            {
                id: 53,
                name: 'Strategies',
                route: '/admin/strategies',
            },
            {
                id: 53,
                name: 'Plans',
                route: '/admin/plans',
            }
        ]
    },
    {
        id: 6,
        name: 'Open position',
        Icon: 'Link2',
        Data: [
            {
                id: 61,
                name: 'Option Chain',
                route: '/admin/optionchain',
            },
            {
                id: 62,
                name: 'Open Position',
                route: '/admin/openposition',
            }
        ]
    },
    {
        id: 8,
        name: 'License',
        Icon: 'Copyright',
        Data: [
            {
                id: 721,
                name: 'Transaction License',
                route: '/admin/allLicence',
            },
            {
                id: 722,
                name: 'Expired License',
                route: '/admin/expiredlicence',
            }
        ]
    },
    {
        id: 73,
        name: 'Make Strategy',
        Icon: 'Boxes',
        Data: [
            {
                id: 731,
                name: 'Create Strategy',
                route: '/admin/createstrategy',
            },
            {
                id: 732,
                name: 'All Strategies',
                route: '/admin/AllMakeStrategy',
            }
        ]
    },
    {
        id: 7,
        name: 'More',
        Icon: 'MoreHorizontal',
        Data: [

            {
                id: 711,
                name: 'Help Center',
                route: '/admin/helpcenter',
            },
            {
                id: 712,
                name: 'Message Broadcast',
                route: '/admin/msgbroadcast',
            },
            {
                id: 713,
                name: 'Api Create Info',
                Icon: 'WalletCards',
                route: '/admin/apicreateinfo',
                Data: []
            },
            {
                id: 714,
                name: 'Broker Information',
                Icon: 'Info',
                route: '/admin/brokerinfo',
                Data: []
            },
            {
                id: 715,
                name: 'Faq',
                Icon: 'Info',
                route: '/admin/faq',
                Data: []
            },




        ]
    }

];


export const supper_admin_sidebar = [
    {
        id: 1,
        name: 'Dashboard',
        Icon: 'LayoutDashboard',
        route: '/super/dashboard',
        Data: []
    },
    {
        id: 2,
        name: 'All Admins',
        Icon: 'Users',
        route: '/super/alladmins',
        Data: []
    },
    {
        id: 3,
        name: 'All Permissions',
        Icon: 'Vote',
        route: '/super/permitions',
        Data: []
    },
    {
        id: 4,
        name: 'History',
        Icon: 'FolderClock',
        route: '/super/history',
        Data: []
    },
    {
        id: 5,
        name: 'Select Theme',
        Icon: 'Paintbrush',
        route: '/super/selecttheme',
        Data: []
    },
    {
        id: 6,
        name: 'Api Create Info',
        route: '/super/apicreateinfo',
        Icon: 'WalletCards',
        Data: []
    },

    {
        'id': 7,
        "name": 'Faq',
        "Icon": "HelpingHand",
        "route": "/super/update/faq",
        "Data": []
    },

]


export const sub_admin_sidebar = [
    {
        id: 1,
        name: 'Signals',
        Icon: 'Signal',
        route: '/subadmin/signals',
        Data: []
    },
    {
        id: 2,
        name: 'All Clients',
        Icon: 'Users',
        route: '/subadmin/clients',
        Data: []
    },
    {
        id: 3,
        name: 'Trade History',
        Icon: 'CandlestickChart',
        route: '/subadmin/tradehistory',
        Data: []
    },
    {
        id: 4,
        name: 'Api Create Info',
        Icon: 'WalletCards',
        route: '/subadmin/apicreateinfo',
        Data: []
    },
    {
        id: 5,
        name: 'Help Center',
        Icon: 'HelpingHand',
        route: '/subadmin/helpcenter',
        Data: []
    }
];

export const Client = [
    {
        id: 1,
        name: 'Dashboard',
        Icon: 'LayoutDashboard',
        route: '/client/dashboard',
        Data: []
    },
    {
        id: 2,
        name: 'Trade Details',
        Icon: 'Signal',
        Data: [
            {
                id: 1000,
                name: 'Signals',
                Icon: 'Signal',
                route: '/client/signals',
                Data: []
            },
            {
                id: 1001,
                name: 'Trade History',
                Icon: 'FolderClock',
                route: '/client/tradehistory',
                Data: []
            },
        ]
    },
    // {
    //     id: 2,
    //     name: 'Signals',
    //     Icon: 'Signal',
    //     route: '/client/signals',
    //     Data: []
    // },
    // {
    //     id: 3,
    //     name: 'Trade History',
    //     Icon: 'FolderClock',
    //     route: '/client/tradehistory',
    //     Data: []
    // },

    {
        id: 4,
        name: 'Trading Status',
        Icon: 'Activity',
        route: '/client/tradingstatus',
        Data: []
    },
    {
        id: 5,
        name: 'Broker Response',
        Icon: 'ArrowRightLeft',
        route: '/client/brokerresponse',
        Data: []
    },
    {
        id: 6,
        name: 'Api Create Info',
        Icon: 'WalletCards',
        route: '/client/apicreateinfo',
        Data: []
    },
    {
        id: 7,
        name: 'Help Center',
        Icon: 'HelpingHand',
        route: '/client/helpcenter',
        Data: []
    },
    {
        id: 8,
        name: 'Strategy Desc.',
        Icon: 'ScatterChart',
        route: '/client/strategydesc',
        Data: []
    },
    {
        id: 9,
        name: 'faq',
        Icon: 'Info',
        route: '/client/faq',
        Data: []
    },
    {
        id: 9,
        name: 'Plans',
        Icon: 'plan',
        route: '/client/plan',
        Data: []
    },
];

