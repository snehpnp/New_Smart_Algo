module.exports = function (app, connection1) {
    const nodemailer = require('nodemailer');
    var verifyToken = require('./middleware/awtJwt');
    const jwt = require("jsonwebtoken");


    var dateTime = require('node-datetime');
    const bcrypt = require("bcrypt");


    var d = new Date,
        dformat = [d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
        ].join('/') + ' ' + [d.getHours(),
        d.getMinutes(),
        d.getSeconds()
        ].join(':');

    app.get("/admin/client", verifyToken, (req, res) => {
        connection1.query('SELECT id,full_name,email,mobile,username,created_at,start_date,end_date,updated_at,status,status_term,broker,api_key,api_secret,client_code,to_month,trading_type,licence_type,api_type,logouttime,app_id,is_term,admin_id,subadmin_id,web_url,isDeleted,client_key,expiry_status,login_status,subadmin_client_status,twoday_service FROM `client` ORDER BY `id` DESC', (err, result) => {
            res.send({ client: result });
        });
    });
    app.get("/admin/demoClientSubAdmin", verifyToken, (req, res) => {
        connection1.query('SELECT `client`.*,`tbl_users`.`email` as subAdmin_email,`tbl_users`.`name` as subAdmin_name FROM `client` LEFT JOIN `tbl_users` ON `tbl_users`.`userId` = `client`.`subadmin_id`  WHERE `client`.`status_term`="0" AND `client`.`subadmin_id` != "0" ORDER BY `client`.`id` DESC;', (err, result) => {
            res.send({ client: result });
        });
    });
    app.get("/admin/strategy", verifyToken, (req, res) => {
        connection1.query('SELECT * from strategy', (err, result) => {
            res.send({ strategy: result });
        });
    });
    app.get("/admin/sub-admins", verifyToken, (req, res) => {
        connection1.query('SELECT * FROM `tbl_users` Where roleId = "4"', (err, result) => {
            res.send({ subadmins: result });
        });
    });
    app.post("/admin/client", verifyToken, (req, res) => {
        var id = req.body.id;
        connection1.query('SELECT * FROM `client` where `id`=' + id + ';SELECT * FROM `strategy_client` where `client_id`=' + id + ';SELECT * FROM `client_group_service` where `client_id`=' + id + ';', [1, 2, 3], (err, result) => {
            var strategy_array = [];

            result[1].forEach(function (item, index) {
                strategy_array.push(item.strategy)
            });
            res.send({ 'userdata': result[0], 'cstrategy': strategy_array, 'cgroup': result[2] });
        });
    });


    app.post("/admin/strategy/find", verifyToken, (req, res) => {

        var strategy = req.body.strategy;

        connection1.query('SELECT `client`.*,`strategy_client`.* FROM `strategy_client` LEFT JOIN `client` ON strategy_client.client_id =client.id  WHERE `strategy_client`.`strategy`="' + strategy + '"', (err, result) => {

            res.send({ data: result });
        });
    });



    app.post("/admin/client/update", verifyToken, (req, res) => {


        var { CommonEmail } = require(`../Common/SendEmails/CommonEmail.js`);

        var useradata = req.body.data;

        var end_date;
        var start_date;
        var created_at;

        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');

        //  MONTH CONTROLL
        var toMonth
        if (req.body.addmonth == '2-Days') {
            toMonth = 0
        } else {
            toMonth = req.body.addmonth
        }


        const getEndDate = (month) => {
            let CurrentDate = new Date();
            end_date_live_month = new Date(CurrentDate.setMonth(CurrentDate.getMonth() + +month))

            var end_date_live = dateTime.create(end_date_live_month);
            end_date = end_date_live.format('Y-m-d');
            return end_date
        }


        var admin_id = req.body.admin_id;
        var role_id = req.body.role_id;
        var createdBy = req.body.createdBy;


        var status = "1";
        var status_term = "1";
        var subadmin_client_status = "1";


        var subadmin_id;
        if (role_id != 4) {

            subadmin_id = useradata.subadmin_id;
        } else {


            subadmin_id = admin_id;
        }

        var admin_id;
        if (role_id != 4) {
            admin_id = admin_id;
        } else {
            admin_id = createdBy;
        }


        connection1.query('SELECT licence FROM `tbl_users` WHERE userId = "1"', (err, exist_admin_licence) => {

            connection1.query('SELECT SUM(to_month)  FROM `client` WHERE `status_term` = "1"', (err, exist_client_month_count) => {

                connection1.query('SELECT * FROM `client` WHERE `id` = "' + useradata.id + '"', (err, db_exist_service) => {

                    connection1.query('SELECT * FROM `client_service` WHERE `client_id` = "' + useradata.id + '"', (err, clientService) => {
                        const StrategyFirst = req.body.strategy
                        clientService.forEach((item) => {

                            // connection1.query('UPDATE `client_service` SET `strategy`="' + StrategyFirst[1] + '" WHERE `client_id`=' + item.client_id, (err, result) => {

                            //     console.log("err", err);
                            // })
                        })

                    })
                    // console.log("==>", db_exist_service[0]);


                    // Exist Admin Licence And All Count Client Licence
                    var count_exist_licence = parseInt(exist_client_month_count[0].count_exist_licence);
                    var admin_licence = parseInt(exist_admin_licence[0].licence);




                    const getEndDate_copy = (month) => {
                        let end_date1 = db_exist_service[0].end_date;
                        end_date_live_month = new Date(end_date1.setMonth(end_date1.getMonth() + +month))

                        var end_date_live = dateTime.create(end_date_live_month);
                        end_date = end_date_live.format('Y-m-d');
                        return end_date
                    }



                    var is_demo = 0;
                    if (db_exist_service[0].licence_type == 1) {
                        is_demo = 1;
                    }



                    var to_month = 0;
                    if (req.body.data.licence_type == 1) {

                        let created_at1 = db_exist_service[0].created_at;

                        created_at1 = dateTime.create(created_at1);
                        var created_at = created_at1.format('Y-m-d H:M:S');
                        let start_date1 = req.body.start_date;

                        start_date1 = dateTime.create(start_date1);
                        start_date = start_date1.format('Y-m-d');

                        let end_date1 = req.body.end_date;
                        end_date1 = dateTime.create(end_date1);
                        end_date = end_date1.format('Y-m-d');

                    } else if (req.body.data.licence_type == 2) {

                        if (toMonth > 0) {

                            to_month = parseInt(toMonth) + parseInt(useradata.to_month);
                            // to_month = parseInt(req.body.addmonth) + parseInt(useradata.to_month);


                            var todaydate1 = dateTime.create();
                            var todaydate = todaydate1.format('Y-m-d');

                            let end_date1 = db_exist_service[0].end_date;
                            end_date1 = dateTime.create(end_date1);
                            end_date = end_date1.format('Y-m-d');


                            if (end_date < todaydate) {

                                let created_at1 = db_exist_service[0].created_at;
                                created_at1 = dateTime.create(created_at1);
                                created_at = created_at1.format('Y-m-d H:M:S');

                                var start_date1 = dateTime.create();
                                start_date = start_date1.format('Y-m-d');
                                getEndDate(toMonth);

                            } else {

                                let created_at1 = db_exist_service[0].created_at;
                                created_at1 = dateTime.create(created_at1);
                                created_at = created_at1.format('Y-m-d H:M:S');

                                let start_date1 = db_exist_service[0].start_date;
                                start_date1 = dateTime.create(start_date1);
                                start_date = start_date1.format('Y-m-d');

                                getEndDate_copy(toMonth);

                            }

                        } else {

                            to_month = db_exist_service[0].to_month;

                            let created_at1 = db_exist_service[0].created_at;
                            created_at1 = dateTime.create(created_at1);
                            created_at = created_at1.format('Y-m-d H:M:S');

                            let start_date1 = db_exist_service[0].start_date;
                            start_date1 = dateTime.create(start_date1);
                            start_date = start_date1.format('Y-m-d');

                            let end_date1 = db_exist_service[0].end_date;
                            end_date1 = dateTime.create(end_date1);
                            end_date = end_date1.format('Y-m-d');
                        }
                    }


                    if (is_demo == 1) {
                        if (req.body.data.licence_type == 2) {


                            if (req.body.addmonth == '2-Days') {
                                var currentDate = new Date();

                                var start_date_2days = dateTime.create(currentDate);
                                var start_date_2days = start_date_2days.format('Y-m-d');
                                start_date = start_date_2days;

                                var StartDate = new Date(start_date)
                                var UpdateDate = ""
                                var GetDay = StartDate.getDay()
                                if (GetDay == 4) {
                                    UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                                } else if (GetDay == 5) {
                                    UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                                } else if (GetDay == 6) {
                                    UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                                } else if (GetDay == 0) {
                                    UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                                } else if (GetDay > 0 && GetDay < 4) {
                                    UpdateDate = StartDate.setDate(StartDate.getDate() + 2);
                                }


                                var end_date_2days = dateTime.create(UpdateDate);
                                var end_date_2days = end_date_2days.format('Y-m-d');

                                end_date = end_date_2days;

                                if (role_id == 4) {
                                    status = "0";
                                    status_term = "0";
                                    subadmin_client_status = "0";
                                } else {
                                    status = "1";
                                    status_term = "1";
                                    subadmin_client_status = "1";
                                }

                            } else {

                                console.log('ooo');
                                to_month = toMonth;

                                let created_at1 = db_exist_service[0].created_at;
                                created_at1 = dateTime.create(created_at1);
                                created_at = created_at1.format('Y-m-d H:M:S');

                                var start_date1 = dateTime.create();
                                start_date = start_date1.format('Y-m-d');
                                getEndDate(toMonth);
                                if (role_id == 4) {
                                    status = "0";
                                    status_term = "0";
                                    subadmin_client_status = "0";
                                } else {
                                    status = "1";
                                    status_term = "1";
                                    subadmin_client_status = "1";
                                }
                            }
                        }
                    }




                    var id = useradata.id;
                    var group_id = req.body.group;
                    connection1.query('Delete from `client_group_service` Where `client_id`=' + id, (err, result) => {
                        connection1.query('INSERT INTO `client_group_service`  (`client_id`,`group_id`) VALUES ("' + id + '","' + group_id + '")', (err, result) => {

                        });
                    });

                    connection1.query('SELECT `client_service`.*, `services`.`service` as `ser_name`, `client`.`status` as `client_status`, `client`.`full_name` as `client_name`, `client`.`created_at` as `s_date`, `client`.`id` as `client_id`, `categorie`.`segment` as `cat_segment`, `categorie`.`name` as `cat_name` FROM `client_service` LEFT JOIN `services` ON `services`.`id` = `client_service`.`service_id` LEFT JOIN `client` ON `client`.`id` = `client_service`.`client_id` LEFT JOIN `categorie` ON `categorie`.`id` = `services`.`categorie_id` WHERE `client_service`.`client_id` =' + id, (err, dd) => {


                        // Check service id
                        var db_exist_ids = [];
                        dd.forEach(function (item, index) {
                            db_exist_ids.push(item.service_id);
                        });

                        // Check Group service id
                        var db_exist_gids = [];
                        dd.forEach(function (item, index) {
                            db_exist_gids.push(item.service_group_id);
                        });


                        console.log("current", group_id);
                        console.log('db_exist_gids id -', db_exist_gids);
                        // console.log('exist id -', db_exist_ids);
                        // console.log('group service id -', req.body.groupServiceid);

                        function differenceOf2Arrays(array1, array2) {
                            var temp = [];
                            array1 = array1.toString().split(',').map(Number);
                            array2 = array2.toString().split(',').map(Number);

                            for (var i in array1) {
                                if (array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
                            }
                            for (i in array2) {
                                if (array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
                            }
                            return temp.sort((a, b) => a - b);
                        }
                        var shakirdel = differenceOf2Arrays(db_exist_ids, req.body.groupServiceid)
                        // console.log('shakir array -', differenceOf2Arrays(db_exist_ids, req.body.groupServiceid));
                        Array.prototype.remove = function () {
                            var what, a = arguments,
                                L = a.length,
                                ax;
                            while (L && this.length) {
                                what = a[--L];
                                while ((ax = this.indexOf(what)) !== -1) {
                                    this.splice(ax, 1);
                                }
                            }
                            return this;
                        };

                        var add_service = [];
                        // console.log(" req.body.groupServiceid", req.body.groupServiceid);
                        console.log(" req.body.groupServiceid", req.body.group);

                        connection1.query('SELECT * FROM `service_and_group_id` WHERE service_group_id=' + req.body.group, (err, resultGroup) => {
                            // console.log("resultGroup", resultGroup);


                            resultGroup.forEach(function (item, index) {
                                if (db_exist_gids[0] != group_id) {
                                    // if (db_exist_gids != group_id && !db_exist_ids.includes(item)) {
                                    // 
                                    add_service.push(item.service_id);
                                }

                            });
                            console.log('add service - ', add_service);

                            var delete_service = [];
                            db_exist_ids.forEach(function (item, index) {
                                if (db_exist_gids[0] != group_id) {
                                    // if (db_exist_gids != group_id && !req.body.groupServiceid.includes(item)) {

                                    delete_service.push(item);
                                }

                            });
                            // console.log('delete service - ', delete_service);

                            delete_service.forEach(function (item, index) {
                                connection1.query('Delete from `client_service` Where `client_id`=' + id, (err, result) => {
                                    // console.log('Delete from `client_service` Where `client_id`=' + id);
                                });
                            });

                            // var groupServicesId = req.body.groupServiceid
                            // var dataa=[];
                            // groupServicesId.forEach(function(item,index){
                            //   dataa+='("'+item+'","'+id+'","'+group_id+'","'+dformat+'","'+req.body.strategy[0]+'"),';
                            // });

                            var dataa = [];
                            add_service.forEach(function (item, index) {
                                dataa += '("' + item + '","' + id + '","' + group_id + '","' + dformat + '","' + req.body.strategy[1] + '"),';
                            });
                            console.log("dataa", dataa);

                            if (add_service.length > 0) {
                                dataa = dataa.slice(0, -1);
                                connection1.query('INSERT INTO `client_service`  (`service_id`,`client_id`,`service_group_id`,`created_at`,`strategy`) VALUES' + dataa + '', (err, result) => {
                                    console.log(err);
                                    // console.log(result);

                                });
                            }

                        })


                    });



                    connection1.query('SELECT `strategy_client`.* FROM `strategy_client` LEFT JOIN `client` ON `client`.`id` = `strategy_client`.`client_id` WHERE `strategy_client`.`client_id` = ' + id, (err, dss) => {
                        // console.log('okkk shakirs -', dss);

                        var db_exist_startegy = [];
                        dss.forEach(function (item, index) {
                            db_exist_startegy.push(item.strategy);
                        });
                        console.log('exist - strtegy ', db_exist_startegy);


                        var add_startegy = [];
                        req.body.strategy.forEach(function (item, index) {
                            if (!db_exist_startegy.includes(item)) {
                                add_startegy.push(item);
                            }
                        });
                        console.log('add add_startegy - ', add_startegy);



                        var delete_startegy = [];
                        db_exist_startegy.forEach(function (item, index) {
                            if (!req.body.strategy.includes(item)) {
                                delete_startegy.push(item);
                            }

                        });


                        console.log('delete db_exist_startegy - ', delete_startegy);

                        delete_startegy.forEach(function (item, index) {
                            connection1.query('Delete from `strategy_client` Where `strategy`="' + item + '" AND `client_id`=' + id, (err, result) => {

                            });
                        });



                        var dataa11 = [];
                        add_startegy.forEach(function (item, index) {
                            dataa11 += '(' + id + ',"' + item + '","' + dformat + '"),';
                        });


                        if (add_startegy.length > 0) {
                            dataa11 = dataa11.slice(0, -1);
                            connection1.query('INSERT INTO `strategy_client`  (`client_id`,`strategy`,`created_at`) VALUES' + dataa11, (err, result) => {
                                console.log(err);

                            });
                        }


                        if (add_startegy.length > 0) {
                            connection1.query('INSERT INTO `trading_status_client` (`client_id`,`strategy`,`trading`,`created_at`) VALUES ("' + useradata.id + '","' + add_startegy + '","","' + ccdate + '")', (err, result) => { });
                        }


                        if (delete_startegy.length > 0) {
                            console.log("ok", delete_startegy);

                            delete_startegy.forEach(function (item5, inedx) {


                                connection1.query('SELECT * FROM `strategy_client` WHERE `client_id`=' + id + ' ORDER BY id DESC', (err, stgfind) => {
                                    console.log("stgfind", stgfind);

                                    console.log("stgfind", stgfind[0].strategy);

                                    connection1.query('SELECT * FROM `client_service` WHERE `client_id`= ' + id + ' AND `strategy` ="' + item5 + '"', (err, result) => {

                                        console.log("result", result);


                                        result.forEach(function (item6, inedx) {
                                            connection1.query('UPDATE `client_service` SET  `strategy`= "' + stgfind[0].strategy + '" WHERE  `id` =' + item6.id, (err, result2) => {

                                            });
                                        })

                                    });


                                })
                            })
                        }

                    });


                    // Email Edit Check Exist or not
                    if (useradata.email != "") {

                        connection1.query('SELECT * FROM `client` WHERE `email` = "' + useradata.email + '" AND  id != ' + useradata.id, (err, email_result) => {

                            if (email_result.length > 0) {

                                res.send({ status: 'email_error', msg: 'Email is Already Exist...' });

                            } else {
                                connection1.query('UPDATE `client` SET `email`="' + useradata.email + '"WHERE `id`=' + useradata.id, (err, result) => { })
                            }
                        })

                    }




                    var all_client_licence = count_exist_licence + parseInt(toMonth);
                    // console.log('all licence -',all_client_licence);
                    var remainingLicence = admin_licence - count_exist_licence;



                    if (admin_licence < all_client_licence) {

                        res.send({ status: 'false', msg: 'Remaining  (' + remainingLicence + ')  Licence  Available Please Contact Admin ....' });
                    }

                    else {

                        if (req.body.data.licence_type == 2) {
                            var exist_broker = db_exist_service[0].broker;

                            if (exist_broker != useradata.broker) {

                                const email = useradata.email;

                                const editBrokerHtml = req.body.editBrokerHtml;

                                console.log('email ', email);
                                console.log('brokerhtml ', editBrokerHtml);
                                const subjectEmail = "Updated Broker details";
                                CommonEmail(email, subjectEmail, editBrokerHtml);

                            }
                        }




                        console.log('else');
                        connection1.query('UPDATE `client` SET `full_name`="' + useradata.full_name + '",`mobile`="' + useradata.mobile + '",`created_at`="' + created_at + '",`start_date`="' + start_date + '",`end_date`="' + end_date + '",`broker`="' + useradata.broker + '",`api_key`="' + useradata.api_key + '",`api_secret`="' + useradata.api_secret + '",`to_month`="' + to_month + '",`licence_type`="' + useradata.licence_type + '",`app_id`="' + useradata.app_id + '",`client_code`="' + useradata.client_code + '",`api_type`="' + useradata.api_type + '",`subadmin_id`="' + subadmin_id + '",`admin_id`="' + admin_id + '",`status`="' + status + '",`status_term`="' + status_term + '",`subadmin_client_status`="' + subadmin_client_status + '", demat_userid="' + useradata.demat_userid + '" WHERE `id`=' + useradata.id, (err, result) => {
                            // console.log("result", result);
                            console.log('s db_exist_service ', db_exist_service[0].api_key);

                            if (db_exist_service[0].api_key != useradata.api_key) {

                                connection1.query('INSERT INTO `count_broker_apikey`  (`client_id`,`api_key`,`created_at`) VALUES ("' + useradata.id + '","' + useradata.api_key + '","' + ccdate + '")', (err, result) => {

                                });

                            }
                            // End Date
                            if (db_exist_service[0].end_date != end_date) {

                                connection1.query('UPDATE `client` SET `expiry_status`="0"  WHERE `id`=' + useradata.id, (err, result) => {

                                });

                            }




                            // ,`email`="' + useradata.email + '"
                            if (db_exist_service[0].demat_userid != useradata.demat_userid) {

                                connection1.query('INSERT INTO `count_broker_apikey`  (`client_id`,`api_key`,`created_at`) VALUES ("' + useradata.id + '","' + useradata.demat_userid + '","' + ccdate + '")', (err, result) => {

                                });

                            }

                            if (db_exist_service[0].api_secret != useradata.api_secret) {

                                connection1.query('INSERT INTO `count_broker_apikey`  (`client_id`,`api_secret`,`created_at`) VALUES ("' + useradata.id + '","' + useradata.api_secret + '","' + ccdate + '")', (err, result) => {
                                });

                            }

                            if (db_exist_service[0].broker != useradata.broker) {

                                connection1.query('INSERT INTO `count_broker_apikey`  (`client_id`,`broker`,`created_at`) VALUES ("' + useradata.id + '","' + useradata.broker + '","' + ccdate + '")', (err, result) => {
                                });

                            }

                            if (db_exist_service[0].email != useradata.email) {
                                connection1.query('UPDATE `client` SET `email_edit`="1" WHERE `id`=' + useradata.id, (err, result) => {
                                });

                            }


                            console.log("is_demo", is_demo);

                            if (req.body.data.licence_type == 2) {
                                if (req.body.addmonth == '2-Days') {
                                    connection1.query('UPDATE `client` SET `twoday_service`="1" WHERE `id`=' + useradata.id, (err, result) => { })
                                } else {
                                    if (toMonth > 0) {
                                        // if (role_id != 4) {
                                        connection1.query('INSERT INTO `count_licence`  (`client_id`,`licence`,`date_time`) VALUES ("' + useradata.id + '","' + toMonth + '","' + ccdate + '")', (err, res_count) => { });
                                        // }

                                    }
                                }
                            }






                            res.send({ services: result })
                        });
                    }

                });

            });
        });

    });



    // app.get("/admin/client/check", (req, res) => {
    //     // var { CommonEmail } = require(`../Common/SendEmails/CommonEmail.js`);
    //     // const toEmail = 'shakirpnp@gmail.com';
    //     //                     const subjectEmail = "testing .... ";
    //     //                     const htmlEmail = "<p>Dear zinga lala u </p>";
    //     //                     const textEmail = ''
    //     //                     console.log("EmailAyya", CommonEmail(toEmail, subjectEmail, htmlEmail,textEmail,res))
    //     //                     CommonEmail(toEmail, subjectEmail, htmlEmail,textEmail,res);
    //     const transporter = nodemailer.createTransport({
    //         transportMethod: 'SMTP',
    //         host: 'mail.smartalgo.in',
    //         port: 465,
    //         secure: true,
    //         auth: {
    //             user: 'info@smartalgo.in',
    //             pass: 'wJSEknKJS44M8Vq6'
    //         }
    //     });
    //     // send email
    //     transporter.sendMail({
    //         from: 'info@smartalgo.in',
    //         to: 'shakirpnp@gmail.com',
    //         subject: 'Test Email Subject',
    //         html: '<h1>Example HTML Message Body</h1>'
    //     });
    // })




    app.post("/admin/client/add", verifyToken, (req, res) => {
        var { CommonEmail } = require(`../Common/SendEmails/CommonEmail.js`);
        var useradata = req.body.data;
        console.log("req.body.addmonth ", req.body.addmonth);
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');
        console.log("req.body.start_date", ccdate);

        var toMonth
        if (req.body.addmonth == '2-Days') {
            toMonth = 0
        } else {
            toMonth = req.body.addmonth
        }
        console.log('toMonth -', toMonth);

        var end_date
        var start_date

        var prefix_key

        connection1.query('SELECT licence FROM `tbl_users` WHERE userId = "1"', async (err, exist_admin_licence) => {

            connection1.query('SELECT SUM(to_month)  FROM `client` WHERE `status_term` = "1"', async (err, exist_client_month_count) => {

                connection1.query('SELECT * FROM `client_key_prefix_letters` WHERE `id` = "1"', async (err, prefix_result) => {



                    console.log('ss', parseInt(exist_client_month_count[0].count_exist_licence))

                    // console.log('prefix',prefix_result[0].prefix);    
                    prefix_key = prefix_result[0].prefix;
                    var panel_name = prefix_result[0].panel_name;
                    var domain_url_https = prefix_result[0].domain_url_https;



                    // Exist Admin Licence And All Count Client Licence
                    // count_exist_licence = exist_client_month_count[0].length > 0 ? parseInt(exist_client_month_count[0].count_exist_licence) : 0;
                    //exist_client_month_count[0].count_exist_licence;



                    var count_exist_licence = parseInt(exist_client_month_count[0].count_exist_licence);

                    var admin_licence = parseInt(exist_admin_licence[0].licence);

                    console.log('admin Licence -', admin_licence);
                    console.log(' count_exist_licence -', count_exist_licence);



                    const getEndDate = (month) => {
                        let CurrentDate = new Date();
                        // console.log('check get endtatefunction -',month);
                        end_date_live_month = new Date(CurrentDate.setMonth(CurrentDate.getMonth() + +month))

                        var end_date_live = dateTime.create(end_date_live_month);
                        end_date = end_date_live.format('Y-m-d');
                        return end_date
                    }


                    var to_month = 0;
                    if (req.body.data.licence_type === '1') {

                        var start_date_demo = dateTime.create(req.body.start_date);
                        var start_date_demo = start_date_demo.format('Y-m-d');

                        start_date = start_date_demo;

                        var end_date_demo = dateTime.create(req.body.end_date);
                        var end_date_demo = end_date_demo.format('Y-m-d');

                        end_date = end_date_demo;
                        //  console.log("if")
                    } else {
                        if (req.body.addmonth == '2-Days') {
                            var currentDate = new Date();

                            var start_date_2days = dateTime.create(currentDate);
                            var start_date_2days = start_date_2days.format('Y-m-d');
                            start_date = start_date_2days;
                            console.log("start_date", start_date);


                            var StartDate = new Date(start_date)
                            var UpdateDate = ""
                            var GetDay = StartDate.getDay()
                            if (GetDay == 4) {
                                UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                            } else if (GetDay == 5) {
                                UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
                            } else if (GetDay == 6) {
                                UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                            } else if (GetDay == 0) {
                                UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
                            } else if (GetDay > 0 && GetDay < 4) {
                                UpdateDate = StartDate.setDate(StartDate.getDate() + 2);
                            }



                            //   var EndDate= currentDate.setDate(currentDate.getDate() + 2)                                               

                            var end_date_2days = dateTime.create(UpdateDate);
                            var end_date_2days = end_date_2days.format('Y-m-d');

                            end_date = end_date_2days;
                            // console.log("start_date",start_date);
                            // console.log("end_date",end_date);

                        } else {

                            to_month = toMonth;
                            var start_date_live = dateTime.create();
                            var start_date_live = start_date_live.format('Y-m-d');
                            start_date = start_date_live;
                            getEndDate(toMonth);
                        }
                    }



                    // console.log('licence type - ',req.body.data.licence_type);
                    // console.log('start date- ',start_date);
                    // console.log('end date - ',end_date);
                    // console.log('month - ',to_month);



                    const min = 1;
                    const max = 1000000;
                    const rand = min + Math.random() * (max - min);
                    var rand_password = Math.round(rand)
                    // console.log('random string',rand_password);




                    const mins = 1;
                    const maxs = 1000000;
                    const rands = mins + Math.random() * (maxs - mins);
                    var cli_key = Math.round(rands)


                    var ccd = dt.format('ymd');
                    var client_key = prefix_key + cli_key + ccd
                    // console.log('cd date  -',ccd);
                    // console.log('cli_key -',cli_key);
                    // console.log('client_key -',client_key);
                    // return


                    var admin_id = req.body.admin_id;
                    var role_id = req.body.role_id;
                    var createdBy = req.body.createdBy;
                    // console.log('ad -id -',admin_id)
                    console.log('role -id -', role_id)
                    // console.log('createdBy -',createdBy)
                    // console.log('ssubadminid -',useradata.subadmin_id)


                    var subadmin_id = 0;
                    if (role_id != 4) {
                        subadmin_id = useradata.subadmin_id ? useradata.subadmin_id : 0;
                    } else {
                        subadmin_id = admin_id;
                    }

                    var admin_id;
                    if (role_id != 4) {
                        admin_id = admin_id;
                    } else {
                        admin_id = createdBy;
                    }


                    var status;
                    var status_term;
                    var subadmin_client_status;

                    // if (prefix_key == 'AAM' || prefix_key == 'SMA') {
                    if (prefix_key == 'AAM') {


                        if (role_id != 4) {
                            status = "1";
                            status_term = "1";
                            subadmin_client_status = "1"
                        } else {
                            if (req.body.data.licence_type == '2') {
                                status = "0";
                                status_term = "0";
                            } else {
                                status = "0";
                                status_term = "0";
                            }

                            subadmin_client_status = "0";
                        }

                    } else {
                        if (role_id != 4) {
                            status = "1";
                            status_term = "1";
                            subadmin_client_status = "1"
                        } else {
                            if (req.body.data.licence_type == '2') {
                                status = "0";
                                status_term = "0";
                            } else {
                                status = "1";
                                status_term = "1";
                            }

                            subadmin_client_status = "0";
                        }
                    }

                    if (role_id == 4) {
                        if (req.body.data.licence_type == '2') {
                            start_date = '0000-00-00';
                            end_date = '0000-00-00';
                        }
                    }


                    var all_client_licence = count_exist_licence + parseInt(toMonth);
                    // console.log('all licence -',all_client_licence);
                    var remainingLicence = admin_licence - count_exist_licence;
                    var broker;
                    if (useradata.broker != undefined) {
                        broker = useradata.broker
                    } else {
                        broker = 0;
                    }


                    // console.log('all_client_licence -',all_client_licence)
                    // console.log('admin_licence -',admin_licence)
                    // //console.log('status -',status)
                    //   console.log('status_term -',status_term)
                    //   console.log('start date -',start_date)
                    //   console.log('status_term -',end_date)
                    //   console.log('subadmin_client_status -',subadmin_client_status)


                    const salt = await bcrypt.genSalt(10);
                    // now we set user password to hashed password
                    var ByCryptrand_password = await bcrypt.hash(rand_password.toString(), salt);




                    connection1.query('SELECT * FROM `client` WHERE `username` = "' + useradata.user_name + '"', (err, username_result) => {
                        connection1.query('SELECT * FROM `client` WHERE `email` = "' + useradata.email + '"', (err, email_result) => {

                            if (username_result.length > 0) {

                                res.send({ status: 'username_error', msg: 'Username is Already Exist...' })

                            } else if (email_result.length > 0) {

                                res.send({ status: 'email_error', msg: 'Email is Already Exist...' });

                            } else if (admin_licence < all_client_licence) {

                                res.send({ status: 'remain_licence_error', msg: 'Remaining  (' + remainingLicence + ')  Licence  Available Please Contact Admin ....' })

                            }


                            else {

                                connection1.query('INSERT INTO `client`  (`full_name`,`email`,`mobile`,`password`,`new_password`,`username`,`created_at`,`start_date`,`end_date`,`broker`,`api_key`,`api_secret`,`to_month`,`licence_type`,`app_id`,`client_code`,`api_type`,`admin_id`,`subadmin_id`,`status`,`status_term`,`subadmin_client_status`,`client_key`,`demat_userid`) VALUES ("' + useradata.full_name + '","' + useradata.email + '","' + useradata.mobile + '","' + rand_password + '","' + ByCryptrand_password + '","' + useradata.user_name + '","' + ccdate + '","' + start_date + '","' + end_date + '","' + broker + '","' + useradata.api_key + '","' + useradata.api_secret + '","' + to_month + '","' + useradata.licence_type + '","' + useradata.app_id + '","' + useradata.client_code + '","' + useradata.api_type + '","' + admin_id + '","' + subadmin_id + '","' + status + '","' + status_term + '","' + subadmin_client_status + '","' + client_key + '","' + useradata.demat_userid + '")', (err11, result) => {
                                    console.log('error client add -', err11);
                                    console.log('result -', result);
                                    var client_id = result.insertId;
                                    var id_company = '1';
                                    var id_startegy = '1';
                                    var company_names;
                                    connection1.query('SELECT * FROM `company_name` WHERE id = "' + id_company + '"', (err, result1) => {
                                        var company_name = result1[0].name;
                                        company_names = result1[0].name;

                                        connection1.query('INSERT INTO `strategy_client`  (`client_id`,`strategy`,`strategy_id`,`created_at`) VALUES ("' + client_id + '","' + company_name + '","' + id_startegy + '","' + ccdate + '")', (err, result) => {

                                        });
                                    });


                                    var brokerData = "";

                                    if (req.body.data.licence_type == 2 && req.body.addmonth != '2-Days') {

                                        brokerData = req.body.brokerHtml;


                                        if (role_id != 4) {
                                            connection1.query('INSERT INTO `count_licence`  (`client_id`,`licence`,`date_time`) VALUES ("' + client_id + '","' + toMonth + '","' + ccdate + '")', (err, result) => { });

                                        }

                                    } else {
                                        brokerData = "";
                                    }
                                    if (req.body.addmonth == '2-Days' && req.body.data.licence_type == 2) {
                                        connection1.query('UPDATE `client` SET `twoday_service`="1" WHERE `id`=' + client_id, (err, result) => { })
                                    }


                                    console.log("prefix_key ?SNEH-", prefix_key);
                                    if (prefix_key == 'AAM') {
                                        console.log("Adonomist");
                                        const term1 = "<p>***************HOW TO WORK WITH SOFTWARE **************************</p><p>1) You have ID and passwordwith link software.adonomist.com</p><p>2) open link reset password accept term and condition, then put last 4 digit mobile number and your software is ready to use it can be work manual sinal and automation</p><p>Manual means you have some option like signal ( you can see signal and use in your D-Mat Manually but same signal not Others)</p><p>you have some more option -</p><p>DASHBOARD - you can update strategy , quantity , Report , Counter selection.</p><p>SIGNALS - you can check signal going in penal</p><p>SIGNALS - you can check signal going in penal</p><p>STRATEGY - one time one strategy used only not for multiple use</p><p>SERVICES - you get all information here to occupied</p><p>REPORTS - reports get all on off detail software signal report and other report on regular basis</p><p>TRADE HISTORY - it always shows your daily performance sheet but it can be differ from actual returns because (sleepage difference, lot quantity, and other)</p><p>TRADING STATUS - this help to show your daily on and off detail you on timing and your off timing </p><p>MESSAGE BROADCAST - this help your existing and exit mechanism you exit and maintain your limit</p><p>HELP CENTER - we are always with you to help we have our support number in web page to help you</p><p>BROKER RESPONCE - this is very important feature in software you can check your connectivity and always tested here like order is going to hit or not</p><p>your order rejected reasons and your all quaries regarding to techniqual issues.</p></hr><p>Disclaimer</p><p>All subscription fees paid to Adonomist Algo Software is Non refundable. We do not provide trading tips not we are investment adviser.</p><p>Our service is solely restricted to automated trading application development, deployment and maintenance. All algorithms are based </p><p> <a href='https://adonomist.com/disclaimer'target='_blank'>https://adonomist.com/disclaimer</a></p></hr></hr><br><br><p>Thnaks for your support</p><p>Adonomist algo software</p>"

                                        const toEmail = useradata.email;
                                        const subjectEmail = "User ID and Password";
                                        const htmlEmail = "<p>Dear '" + useradata.full_name + "'</p><p>Thank you for choosing " + panel_name + " for Algo Platform. We are pleased to inform that the password of your <br> Algo Platform has been resetted as per details mentioned below:</p><p>Login Details:</p><p>User Name / User ID : <b>'" + useradata.user_name + "'</b><br>Login Password : <b>'" + rand_password + "'</b></p><p>Note : Please Change Your Login Password as per your choice.</p><p>Login Url : <a href='" + domain_url_https + "' target='_blank'>" + domain_url_https + "</a></p><br>" + brokerData + "<p> *******************PLEASE READ IT BEFOR USING THIS SOFTWARE********************* </p><p>1) pls login ur adonomist panel software.nomistcom</p><p> 2) Do login with api button on and put there (broking ID) like angel client id and pass after putting angel id pass it will beredirect in same page and button will be on</p><p> 3) Pls do daily same process and do live trading button on between 9 to 9:15 left it till 3:30</p><p> 4) This is to inform you that monitoring of software is your responsibility you can on and Off your software any timeduring market hours,Loss and profit is subject to market risk we are not resposible for any kindly of loss and profitwe are pure softwareseller only, customer can optimize and use sofware according to teir customization like quantity ( according toyour customization ) live(on with API and Off with API) customer hand , and Strategy decision ( Customer Hand ) Operation of allsoftware ( Customer Hand )</p><p> 5)We are pure software seller if you are doing trading manual then you are resposible by your selfkindly to do trade with out software if anyone are doing this accuring software only do not work on calls. After getting User Id and password it will be assumethat you has beenaccepted all term and condition and also accepted that you read all, we are also sending a copy to your mail id that is final, you have anoption to discontinue your softer before accepting this User ID and Password but in case you accpetd thisand regisetered once then noamount refunded we are responsible to solve your quaries (techniqual issue) but not refunded.</p><p> 6) all rights are reserve by adonomistalgo soft company always.</p>" + term1;
                                        CommonEmail(toEmail, subjectEmail, htmlEmail);

                                    } else {
                                        console.log("Smartalgo");
                                        const toEmail = useradata.email;
                                        const subjectEmail = "User ID and Password";
                                        const htmlEmail = "<p>Dear '" + useradata.full_name + "'</p><p>Thank you for choosing " + panel_name + " for Algo Platform. We are pleased to inform that the password of your <br> Algo Platform has been resetted as per details mentioned below:</p><p>Login Details:</p><p>User Name / User ID : <b>'" + useradata.user_name + "'</b><br>Login Password : <b>'" + rand_password + "'</b></p><p>Note : Please Change Your Login Password as per your choice.</p><p>Login Url : <a href='" + domain_url_https + "' target='_blank'>" + domain_url_https + "</a></p><br>" + brokerData;
                                        CommonEmail(toEmail, subjectEmail, htmlEmail);

                                    }

                                    var group_id = req.body.group;
                                    connection1.query('INSERT INTO `client_group_service`  (`client_id`,`group_id`) VALUES ("' + client_id + '","' + group_id + '")', (err, result) => {

                                        var groupServicesId = req.body.groupServiceid
                                        var strategy_client = req.body.strategy;
                                        var dataa = [];
                                        var strategy_first = strategy_client[0]


                                        groupServicesId.forEach(function (item, index) {
                                            dataa += '("' + item + '","' + client_id + '","' + group_id + '","' + dformat + '","' + strategy_first + '"),';
                                        });

                                        if (groupServicesId.length > 0) {
                                            dataa = dataa.slice(0, -1);
                                            connection1.query('INSERT INTO `client_service`  (`service_id`,`client_id`,`service_group_id`,`created_at`,`strategy`) VALUES' + dataa + '', (err, result) => {
                                                console.log(err);


                                            })
                                        }



                                        var dataa = [];
                                        strategy_client.forEach(function (item, index) {
                                            dataa += '("' + client_id + '","' + item + '","' + dformat + '"),';
                                        });
                                        if (strategy_client.length > 0) {
                                            dataa = dataa.slice(0, -1);
                                            connection1.query('INSERT INTO `strategy_client`  (`client_id`,`strategy`,`created_at`) VALUES' + dataa, (err, result) => {
                                                console.log(err);
                                                // console.log(result);
                                                res.send({ services: result })

                                            })
                                        }

                                    })
                                })
                            }
                        });
                    });
                });
            });
        });
    })





    app.post("/admin/client/changestatus", verifyToken, (req, res) => {
        var id = req.body.id;
        var status = req.body.status;
        var status_term = req.body.status_term;
        var to_month = req.body.to_month;
        var licencetype = req.body.licence_type

        var start_date
        var end_date



        console.log("check", req.body);
        // return
        var dt = dateTime.create();
        var ccdate = dt.format('Y-m-d H:M:S');
        const getEndDate = (month) => {
            let CurrentDate = new Date();
            // console.log('check get endtatefunction -',month);
            end_date_live_month = new Date(CurrentDate.setMonth(CurrentDate.getMonth() + +month))

            var end_date_live = dateTime.create(end_date_live_month);
            end_date = end_date_live.format('Y-m-d');
            return end_date
        }

        var start_date_live = dateTime.create();
        var start_date_live = start_date_live.format('Y-m-d');
        start_date = start_date_live;
        getEndDate(to_month)




        // var currentDate = new Date();

        // var start_date_2days = dateTime.create(currentDate);
        // var start_date_2days = start_date_2days.format('Y-m-d');
        // start_date = start_date_2days;


        console.log("start_date", start_date);
        var StartDate = new Date(start_date)
        var UpdateDate = ""
        var GetDay = StartDate.getDay()
        console.log("GetDay", GetDay);
        if (GetDay == 4) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
        } else if (GetDay == 5) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 4);
        } else if (GetDay == 6) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
        } else if (GetDay == 0) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 3);
        } else if (GetDay > 0 && GetDay < 4) {
            UpdateDate = StartDate.setDate(StartDate.getDate() + 2);
        }


        var end_date_2days = dateTime.create(UpdateDate);
        var end_date_2days = end_date_2days.format('Y-m-d');
        var end_date2days

        end_date2days = end_date_2days;
        // return
        // console.log('s t - ',status_term)
        // console.log('status  - ',status)
        // console.log('id t - ',id)
        // console.log('to_month t - ',to_month)
        console.log('start date t - ', start_date)
        console.log('end date  t - ', end_date)
        console.log("end_date", end_date2days);


        if (status_term == "1") {
            console.log('iffff change status');

            connection1.query('UPDATE `client` SET `status`="' + status + '" WHERE `id`=' + id, (err, result) => {
                console.log("err", err);
                res.send({ status: 'changed' })
            })
        } else {
            console.log("else ssss");


            if (licencetype == 2) {

                if (to_month != 0) {

                    connection1.query('SELECT licence FROM `tbl_users` WHERE userId = "1"', (err, exist_admin_licence) => {

                        connection1.query('SELECT SUM(to_month) as count_exist_licence  FROM `client` WHERE `status_term` = "1"', (err, exist_client_month_count) => {
                            var count_exist_licence = parseInt(exist_client_month_count[0].count_exist_licence);
                            var admin_licence = parseInt(exist_admin_licence[0].licence);

                            var all_client_licence = count_exist_licence + parseInt(to_month);



                            var remainingLicence = admin_licence - count_exist_licence;

                            console.log(admin_licence < all_client_licence);

                            console.log("admin_licence", admin_licence);
                            console.log("all_client_licence", all_client_licence);


                            if (admin_licence < all_client_licence) {
                                console.log('Remaining  (' + remainingLicence + ')  Licence  Available Please Contact Admin ....');
                                res.send({ status: 'false', msg: 'Remaining  (' + remainingLicence + ')  Licence  Available Please Contact Admin ....' });
                            }else{

                                
                            console.log("Live sevices");
                            connection1.query('UPDATE `client` SET `status`="' + status + '",`status_term`="1",`subadmin_client_status`="1",`start_date`="' + start_date + '",`end_date`="' + end_date + '" WHERE `id`=' + id, (err, result) => {
                                console.log("err", 'UPDATE `client` SET `status`="' + status + '",`status_term`="1",`subadmin_client_status`="1",`start_date`="' + start_date + '",`end_date`="' + end_date + '" WHERE `id`=' + id);

                                if (to_month != 0) {
                                    connection1.query('INSERT INTO `count_licence`  (`client_id`,`licence`,`date_time`) VALUES ("' + id + '","' + to_month + '","' + ccdate + '")', (err, result) => {

                                        res.send({ status: 'changed' })

                                    });
                                }
                            })


                            }


                        })
                    })



                } else {
                    console.log("2 Days Live sevices=>", start_date);
                    console.log("2 Days Live sevices=>", end_date2days);

                    connection1.query('UPDATE `client` SET `status`="' + status + '",`status_term`="1",`subadmin_client_status`="1",`start_date`="' + start_date + '",`end_date`="' + end_date2days + '" WHERE `id`=' + id, (err, result) => {



                    })
                }
            } else {

                connection1.query('UPDATE `client` SET `status`="' + status + '",`status_term`="1",`subadmin_client_status`="1" WHERE `id`=' + id, (err, result) => {
                    console.log("err", err);


                })
            }



        }
    });

    app.post("/admin/client/delete", verifyToken, (req, res) => {
        var id = req.body.Id
        connection1.query('Delete from `client` Where `id`=' + id, (err, result) => {
            connection1.query('Delete from `client_group_service` Where `client_id`=' + id, (err, result) => {
                connection1.query('Delete from `client_service` Where `client_id`=' + id, (err, result) => {
                    connection1.query('Delete from `strategy_client` Where `client_id`=' + id, (err, result) => {

                        console.log("err", err);
                        res.send({ client: 'true' })
                    })
                })
            })
        })

    })



    // Login Client With Go To Dashboard
    app.get("/admin/client-dashboard/:id", (req, res) => {
        const id = req.params.id
        connection1.query('SELECT * from client where `id`="' + id + '"', async (err, result) => {
            console.log("res", result)
            if (result.length !== 0) {

                var token = jwt.sign({ id: result[0].id }, 'shhhhh', {
                    expiresIn: 86400 // 24 hours
                });
                var end_date_live = dateTime.create(result[0].end_date);
                var end_date = end_date_live.format('Y-m-d');
                var msg = { 'name': result[0].username, 'full_name': result[0].full_name, 'user_id': result[0].id, 'token': token, 'is_term': result[0].is_term, 'mobile': result[0].mobile, 'status': result[0].status, 'expiry': end_date, "expiry_status": result[0].expiry_status };
                res.send({ success: 'true', msg: msg });
            } else {
                res.send({ success: 'false', msg: "User not found" });
            }
        });
    });




}