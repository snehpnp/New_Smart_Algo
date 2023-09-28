var data = {
    name: 'licence',
        label: 'Licence',
            type: 'select',
                options: UserData.data.data !== undefined && UserData.data.data[0].license_type === "2" ? [
                    { label: 'Live', value: '2' },

                ] : UserData.data.data !== undefined && UserData.data.data[0].license_type === "0" ? [

                    { label: '2 Days', value: '0' },

                    { label: 'Live', value: '2' },

                ] : [

                    
                        { label: '2 Days', value: '0' },

                        { label: 'Demo', value: '1' },

                        { label: 'Live', value: '2' },

                    ],

                    , label_size: 12, col_size: 6, disable: false
                ]
    
    }