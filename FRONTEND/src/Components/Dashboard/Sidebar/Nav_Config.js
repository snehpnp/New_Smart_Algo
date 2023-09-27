

export const admin_sidebar = [
    {
        'id': 1,
        "name": 'Dashboard',
        "Icon": "LayoutDashboard",
        "route": "/admin/dashboard",
        "Data": []
    },
    {
        'id': 2,
        "name": 'System',
        "route": "/admin/system",
        "Icon": "Building2",
        "Data": []
    },
    {
        'id': 3,
        "name": 'Clients',
        "Icon": "Users",
        "Data": [
            {
                'id': 1,
                "name": 'Add Client',
                "route": "/admin/client/add",
            },
            {
                'id': 2,
                "name": 'Clients',
                "route": "/admin/allclients",
            },
            {
                'id': 3,
                "name": 'SignUp - Clients',
                "route": "/admin/signupclients",
            },
        ]
    },
    {
        'id': 4,
        "name": 'Sub Admin',
        "Icon": "Users",
        "Data": [
            {
                'id': 1,
                "name": 'All Sub Admins',
                "route": "/admin/allsubadmins",
            },
            {
                'id': 2,
                "name": 'Sub Admin Clients',
                "route": "/admin/subadminclients",
            },
        ]
    },
    {
        'id': 5,
        "name": 'Trade Details',
        "Icon": "FolderClock",
        "Data": [
            {
                'id': 1,
                "name": 'Signals',
                "route": "/admin/signals",
            },
            {
                'id': 2,
                "name": 'Trade History',
                "route": "/admin/tradehistory",
            },
            {
                'id': 3,
                "name": 'Trading Status',
                "route": "/admin/tradingstatus",
            },
            // {
            //     'id': 4,
            //     "name": 'Trade Execution Report',
            //     "route": "/admin/tradeexecution",
            // },
            {
                'id': 5,
                "name": '7 Days Entry',
                "route": "/admin/sevendaysentry",
            },
        ]
    },
    {
        'id': 6,
        "name": 'License',
        "Icon": "Copyright",
        "Data": [
            {
                'id': 1,
                "name": 'Transaction License',
                "route": "/admin/allLicence",
            },
            {
                'id': 2,
                "name": 'Expired License',
                "route": "/admin/expiredlicence",
            },
        ]
    },

    {
        'id': 7,
        "name": 'Script Mgmt',
        "Icon": "Wrench",
        "Data": [
            {
                'id': 1,
                "name": 'All Services',
                "route": "/admin/allservices",

            },
            {
                'id': 2,
                "name": 'Group Services',
                "route": "/admin/groupservices",
            },
            {
                'id': 3,
                "name": "Strategies",
                "route": "/admin/strategies",
            },
        ]
    },
    {
        'id': 8,
        "name": 'Support',
        "Icon": "HelpingHand",
        "Data": [
            {
                'id': 1,
                "name": 'Help Center',
                "route": "/admin/helpcenter",

            },
            {
                'id': 2,
                "name": 'Message Broadcast',
                "route": "/admin/msgbroadcast",

            },
            {
                'id': 3,
                "name": 'Api Create Info',
                "route": "/admin/apicreateinfo",
                "Icon": "WalletCards",
                "Data": []
            },
        ]

    },

    //   {
    //     'id': 9,
    //     "name": 'Reports',
    //     "Icon": "Repeat2",
    //     "route": "/admin/reports",
    //     "Data": []
    // },
    {
        'id': 10,
        "name": 'Release Updates',
        "Icon": "Rocket",
        "route": "/admin/updates",
        "Data": []
    },

]


export const supper_admin_sidebar = [
    {
        'id': 1,
        "name": 'Dashboard',
        "Icon": "LayoutDashboard",
        "route": "/super/dashboard",
        "Data": []
    },
    {
        'id': 2,
        "name": 'All Admins',
        "Icon": "Users",
        "route": "/super/alladmins",
        "Data": []
    },
    {
        'id': 2,
        "name": 'All Permissions',
        "Icon": "Vote",
        "route": "/super/permitions",
        "Data": []
    },
    {
        'id': 3,
        "name": 'History',
        "Icon": "FolderClock",
        "route": "/super/history",
        "Data": []
    },
    {
        'id': 3,
        "name": 'Select Theme',
        "Icon": "Paintbrush",
        "route": "/super/selecttheme",
        "Data": []
    },
    {
        'id': 4,
        "name": 'Support',
        "Icon": "HelpingHand",
        "route": "/super/support",
        "Data": []
    },
]


export const sub_admin_sidebar = [
    {
        'id': 1,
        "name": 'Signals',
        "Icon": "Signal",
        "route": "/subadmin/signals",
        "Data": []
    },
    {
        'id': 2,
        "name": 'All Clients',
        "Icon": "Users",
        "route": "/subadmin/clients",
        "Data": []
    },
    {
        'id': 3,
        "name": 'All Services',
        "Icon": "Wrench",
        "route": "/subadmin/services",
        "Data": []
    },
    {
        'id': 4,
        "name": 'Group Services',
        "Icon": "Frame",
        "route": "/subadmin/groupservices",
        "Data": []
    },
    {
        'id': 5,
        "name": 'Trade History',
        "Icon": "CandlestickChart",
        "route": "/subadmin/tradehistory",
        "Data": []

    },
    {
        'id': 6,
        "name": 'Trading Status',
        "Icon": "Activity",
        "route": "/subadmin/tradingstatus",
        "Data": []
    },
    {
        'id': 7,
        "name": 'Api Create Info',
        "Icon": "WalletCards",
        "route": "/subadmin/apicreateinfo",
        "Data": []
    },
    {
        'id': 7,
        "name": 'Help Center',
        "Icon": "HelpingHand",
        "route": "/subadmin/helpcenter",
        "Data": []
    },
]



export const Client = [
    {
        'id': 1,
        "name": 'Dashboard',
        "Icon": "LayoutDashboard",
        "route": "/client/dashboard",
        "Data": []
    },
    {
        'id': 2,
        "name": 'Signals',
        "Icon": "Signal",
        "route": "/client/signals",
        "Data": []
    },
    {
        'id': 3,
        "name": 'Trade History',
        "Icon": "FolderClock",
        "route": "/client/tradehistory",
        "Data": []
    },
    {

        'id': 4,
        "name": 'Trading Status',
        "Icon": "Activity",
        "route": "/client/tradingstatus",
        "Data": []
    },
    {
        'id': 5,
        "name": 'Broker Response',
        "Icon": "ArrowRightLeft",
        "route": "/client/brokerresponse",
        "Data": []
    },
    {
        'id': 2,
        "name": 'Api Create Info',
        "Icon": "WalletCards",
        "route": "/client/apicreateinfo",
        "Data": []
    },
    {
        'id': 3,
        "name": 'Help Center',
        "Icon": "HelpingHand",
        "route": "/client/helpcenter",
        "Data": []
    },
    {
        'id': 4,
        "name": 'Strategy Desc.',
        "Icon": "ScatterChart",
        "route": "/client/strategydesc",
        "Data": []
    },
]