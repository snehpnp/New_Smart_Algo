
module.exports = function (app) {
// Auth Route
app.use(require("./Auth/login.route"));

// SuperAdmin Route
app.use(require("./SuperAdmin/theme_list.route"));
app.use(require("./SuperAdmin/panel.route"));


// Admin Route
app.use(require("./Admin/user.route"));
app.use(require("./Admin/servicegroup.route"));

// SUBADMIN ROUTES
app.use(require("./Subadmin/subadmin.route"));




};