var axios = require('axios');

var data = {uid:"Z54928",actid:"Z54928",ret:"NET"}
                
var raw = "jData="+JSON.stringify(data)+"&jKey="+"fcf032a4f79bd000aa67cd92081e86fe8694a3c35e7d15637479758bea95d6a3"

var config = {
method: 'post',
url: 'https://go.mynt.in/NorenWClientTP/PositionBook',
headers: { 
    'Content-Type': 'application/x-www-form-urlencoded',
},
data : raw
};

axios(config)
    .then(function(response_position) {
console.log("response_position",response_position.data);
    })
    .catch(function (error) {
        console.log("error",error);
    });