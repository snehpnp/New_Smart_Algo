const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbTradeTools = client.db(process.env.DB_TRADETOOLS);
const dbTest = client.db(process.env.DB_NAME);
const db_GET_VIEW = client.db(process.env.DB_NAME);
const get_open_position_view = db_GET_VIEW.collection('open_position');
const aliceblueView = db_GET_VIEW.collection('aliceblueView');
const token_chain = db_GET_VIEW.collection('token_chain');
const stock_live_price = db_GET_VIEW.collection('stock_live_price');
const open_position = db_GET_VIEW.collection('open_position');
const open_position_excute = db_GET_VIEW.collection('open_position_excute');
const dashboard_data = db_GET_VIEW.collection('dashboard_data');




module.exports = {
    categorie: require("./categorie.model"),
    company_information: require("./company_information.model"),
    role: require("./role.model"),
    services: require("./services.model"),
    theme_list: require("./theme_list.model"),
    user_logs: require("./user_logs.model"),
    user: require("./user.model"),
    UserSignUp : require('./usersignup.model'),
    serviceGroupName: require("./serviceGroupName.model"),
    serviceGroup_services_id: require("./serviceGroup_services_id.model"),
    strategy: require('./strategy.model'),
    strategy_client: require('./strategy_client.model'),
    panel_model: require('./all_panels.model'),
    Subadmin_Permission: require('./subadmin_permision.model'),
    groupService_User: require('./group_services_client.model'),
    client_services: require('./client_service.model'),
    Alice_token: require('./Alice_token.model'),
    Signals: require('./Signals.model'),
    MainSignals: require('./Main_signals.model'),
    api_create_info: require('./api_create_info.model'),
    BrokerResponse: require('./broker_response.model'),
    count_licenses: require('./count_licens.model'),
    HelpCenter: require('./HelpCenter.model'),

    UserMakeStrategy: require('./UserMakeStrategy.model'),
    user_activity_logs: require('./User_activity.model'),
    Broker_information: require('./Broker_information.model'),
    Messagebrodcast_data: require('./Messagebrodcast.model'),
    live_price: require('./Live_price.model'),
    Admin_Permission: require('./admin_permision.model'),
    option_chain_symbols: require('./Get_Option_Chain_Symboll.model'),
    timeFrame: require('./timeFrame.model'),
    Superadmin_History: require('./superadmin_history.model'),
    source : require('./source.model'),
    comparators : require('./comparators.model'),
    aliceblueView:aliceblueView,
    OldMainSignals : require('./OldMainSignals.model'),
    OldSignals : require('./Old_signal.modal'),
    token_chain:token_chain,
    stock_live_price:stock_live_price,
    open_position:open_position,
    open_position_excute:open_position_excute,
    dbTradeTools:dbTradeTools,
    dbTest:dbTest,
    Store_all_redis_key : require('./Store_all_redis_key.model'),
    Faq_Data : require('./Faq.model'),
    userReedeem_modal : require('./User_reedeem'),
    position_data_store : require('./position_data_store.model'),
    user_fund_logs:require('./fund_change_logs.model'),
    dashboard_data:dashboard_data




};
