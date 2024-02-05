

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
            // {
            //     'id': 3,
            //     "name": 'SignUp - Clients',
            //     "route": "/admin/signupclients",
            // },
            {
                'id': 4,
                "name": 'Expired-Clients',
                "route": "/admin/expiredclients",
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
                "name": 'In-Active Clients',
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
                "route": "/admin/tradehistory?type=admin",
            },
            {
                'id': 3,
                "name": 'Client Trade',
                "route": "/admin/tradehistory?type=client",
            },
            {
                'id': 4,
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
        "name": 'Option Chain',
        "Icon": "Link2",
        "Data": [
            {
                'id': 1,
                "name": 'Option Chain',
                "route": "/admin/optionchain",
            },
            {
                'id': 2,
                "name": 'Open Position',
                "route": "/admin/openposition",

            },
        ]
    },
    {
        'id': 7,
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
        'id': 8,
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
        'id': 10,
        "name": 'Make Strategy',
        "Icon": "Boxes",
        "Data": [

            {
                'id': 1,
                "name": 'Create Strategy',
                "route": "/admin/createstrategy",

            },
            {
                'id': 2,
                "name": 'All Strategies',
                "route": "/admin/AllMakeStrategy",

            },
        ]
    },
    {
        'id': 11,
        "name": 'Broker Information',
        "Icon": "Info",
        "route": "/admin/brokerinfo",
        "Data": []
    },

    {
        'id': 12,
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
    {
        'id': 13,
        "name": 'SignUp Clients',
        "Icon": "Users",
        "route": "/admin/signupclient",
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
        'id': 3,
        "name": 'All Permissions',
        "Icon": "Vote",
        "route": "/super/permitions",
        "Data": []
    },
    {
        'id': 4,
        "name": 'History',
        "Icon": "FolderClock",
        "route": "/super/history",
        "Data": []
    },
    {
        'id': 5,
        "name": 'Select Theme',
        "Icon": "Paintbrush",
        "route": "/super/selecttheme",
        "Data": []
    },
    {
        'id': 6,
        "name": 'Api Create Info',
        "route": "/super/apicreateinfo",
        "Icon": "WalletCards",
        "Data": []
    },
    {
        'id': 7,
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
    // {
    //     'id': 3,
    //     "name": 'All Services',
    //     "Icon": "Wrench",
    //     "route": "/subadmin/services",
    //     "Data": []
    // },
    // {
    //     'id': 4,
    //     "name": 'Group Services',
    //     "Icon": "Frame",
    //     "route": "/subadmin/groupservices",
    //     "Data": []
    // },
    {
        'id': 5,
        "name": 'Trade History',
        "Icon": "CandlestickChart",
        "route": "/subadmin/tradehistory",
        "Data": []

    },
    // {
    //     'id': 6,
    //     "name": 'Trading Status',
    //     "Icon": "Activity",
    //     "route": "/subadmin/tradingstatus",
    //     "Data": []
    // },
    {
        'id': 7,
        "name": 'Api Create Info',
        "Icon": "WalletCards",
        "route": "/subadmin/apicreateinfo",
        "Data": []
    },
    {
        'id': 8,
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
        'id': 6,
        "name": 'Api Create Info',
        "Icon": "WalletCards",
        "route": "/client/apicreateinfo",
        "Data": []
    },
    {
        'id': 7,
        "name": 'Help Center',
        "Icon": "HelpingHand",
        "route": "/client/helpcenter",
        "Data": []
    },
    {
        'id': 8,
        "name": 'Strategy Desc.',
        "Icon": "ScatterChart",
        "route": "/client/strategydesc",
        "Data": []
    },
    // {
    //     'id': 9,
    //     "name": 'Option Chain',
    //     "Icon": "Link2",
    //     "route": "/admin/optionchain",
    //     "Data": []
    // },
]