
module.exports = function (app) {
    // Auth Route
    app.use(require("./Auth/login.route"));
 

    // SuperAdmin Route
    app.use(require("./SuperAdmin/theme_list.route"));
    app.use(require("./SuperAdmin/panel.route"));
    app.use(require("./SuperAdmin/Permission.route"));
    app.use(require("./SuperAdmin/SuperAdmin"));



    // Admin Route
    app.use(require("./Admin/user.route"));
    app.use(require("./Admin/servicegroup.route"));
    app.use(require("./Admin/signals.route"));
    app.use(require("./Admin/tradehistory.route"));
    app.use(require("./Admin/dashboard.route"));
    app.use(require("./Admin/helpcenter.route "));
    app.use(require("./Admin/License.route"));
    app.use(require("./Admin/License.route"));

    // SUBADMIN ROUTES
    app.use(require("./Subadmin/subadmin.route"));
    app.use(require("./Subadmin/user.route"));

    // USER ROUTES
    app.use(require("./User/user.route"));

    app.use(require("./Strategy/strategy.route"));


    // BROKER ACCESS TOKEN
    app.use(require("./Brokerassecc_token/broker_access_toke.route"));

    
    // MAKE STRATEGY ROUTE
     app.use(require("./MakeStartegy/makestrategy.route"));

};