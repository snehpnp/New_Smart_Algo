const Subadmin_Permission = require("./subadmin_permision.model");

module.exports = {
    categorie : require("./categorie.model"),
    company_information: require("./company_information.model"),
    role: require("./role.model"),
    services: require("./services.model"),
    theme_list: require("./theme_list.model"),
    user_logs: require("./user_logs.model"),
    user : require("./user.model"),
    serviceGroupName : require("./serviceGroupName.model"),
    serviceGroup_services_id : require("./serviceGroup_services_id.model"),
    strategy :require('./strategy.model'),
    panel_model :require('./all_panels.model'),
    Subadmin_Permission :require('./subadmin_permision.model')
};
 