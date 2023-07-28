"use strict";
const Theme_list = require('../../Models/theme_list.model')

class Theme {
    async AddTheme(req, res) {
        try {


            console.log(req.body);
            
            return
            var lastElement;
            // FIND TABLE THEME DATA LAST INDEX
            const theme_list = await Theme_list.find().sort({ themeId: 1 })

            if (theme_list.length != 0) {
                lastElement = (theme_list[theme_list.length - 1]).themeId + 1;
            } else {
                lastElement = 1;
            }




            console.log('Last Element:', lastElement);

            // THEME CREATE SNEH
            const AddTheme = new Theme_list({ themeId: lastElement });
            AddTheme.save()
                .then(async (data) => {
                    res.send({ status: true, msg: "successfully Add!", data: data });
                })



        } catch (error) {
            console.log("Theme error-", error);
        }
    }
}


module.exports = new Theme();