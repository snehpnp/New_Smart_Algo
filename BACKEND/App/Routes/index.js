
module.exports = function (app) {
// Auth Route
app.use(require("./Auth/login.route"));

// SuperAdmin Route
app.use(require("./SuperAdmin/theme_list.router"));

// Admin Route
app.use(require("./Admin/user.route"));



};