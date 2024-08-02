const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
    
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded._id;
        next();
    });
};

module.exports = { verifyToken }

// const { logger, getIPAddress } = require('../Helper/logger.helper')

// const jwt = require("jsonwebtoken");
// const db = require("../Models");
// const User_model = db.user;
// const user_logs = db.user_logs;


// verifyToken = async (req, res, next) => {
//     let token = req.headers["x-access-token"];

//     if (!token) {
//         return res.send({
//             status: false,
//             msg: "No token provided!",
//             data: [],

//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET);
//         const user = await User_model.find({_id:decoded.id,Role:"USER"}).select("web_login_token app_login_token");

//         if(user.length !== 0 ){

//             if (!user || user[0].web_login_token !== token) {

//                 const user_login = new user_logs({
//                     user_Id: user[0]._id,
//                     login_status: "Panel off due to another login.",
//                     role: "USER",
//                     device: "",
//                     system_ip: getIPAddress()
//                 })
//                 await user_login.save();
//                 return res.send({
//                     status: false,
//                     msg: "Unauthorized!",
//                     data: [],
//                 });
//             }
//         }

//         req.userId = decoded.id;
//         next();
//     } catch (err) {
//         return res.send({
//             status: false,
//             msg: "Unauthorized!",
//             data: [],
//         });
//     }
// };

// module.exports = { verifyToken };