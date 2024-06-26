// const jwt = require("jsonwebtoken");

// verifyToken = (req, res, next) => {
//     let token = req.headers["x-access-token"];
//     if (!token) {
//         return res.status(403).send({
//             message: "No token provided!"
//         });
//     }
//     jwt.verify(token, process.env.SECRET, (err, decoded) => {
//         console.log("errr", err)

//         if (err) {
//             return res.status(401).send({
//                 message: "Unauthorized!"
//             });
//         }
//         req.userId = decoded._id;
//         next();
//     });
// };

// module.exports = { verifyToken }



const jwt = require("jsonwebtoken");
const db = require("../Models");
const User_model = db.user;

verifyToken = async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.send({
            status: false,
            message: "No token provided!",
            data: [],

        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await User_model.findById(decoded.id).select("web_login_token app_login_token");

        if (!user || user.web_login_token !== token) {
            return res.send({
                status: false,
                msg: "Unauthorized!",
                data: [],
            });
        }

        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.send({
            status: false,
            msg: "Unauthorized!",
            data: [],
        });
    }
};

module.exports = { verifyToken };