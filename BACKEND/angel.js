const axios = require('axios');

async function fetchData() {
    try {
        const response = await axios.get('https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${YOUR_VALID_TOKEN}`, // Ensure your token is valid
                'X-UserType': 'USER',
                'X-SourceID': 'WEB',
                'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
                'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
                'X-MACAddress': 'MAC_ADDRESS',
                'X-PrivateKey': 'TLip2VV8'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
}

fetchData();
