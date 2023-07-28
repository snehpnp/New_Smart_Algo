"use strict";
const Theme_list = require('../../Models/theme_list.model')

class Theme {
    async AddTheme(req, res) {
        try {

            const { theme_name, theme_version, primary_col, nav_head_col, header_col, sidebar_col
                , sidebar, header_position, sidebar_position, container, body_font, dashboard, image } = req.body

            var lastElement;
            // FIND TABLE THEME DATA LAST INDEX
            const theme_list = await Theme_list.find().sort({ themeId: 1 })

            if (theme_list.length != 0) {
                lastElement = (theme_list[theme_list.length - 1]).themeId + 1;
            } else {
                lastElement = 1;
            }

            // THEME CREATE SNEH
            const AddTheme = new Theme_list({
                themeId: lastElement,
                theme_name: theme_name,
                theme_version: theme_name,
                primary_col: theme_name,
                nav_head_col: theme_name,
                header_col: theme_name,
                sidebar_col: theme_name,
                layout: theme_name,
                sidebar: theme_name,
                header_position: theme_name,
                sidebar_position: theme_name,
                container: theme_name,
                body_font: theme_name,
                dashboard: theme_name,
                image: theme_name
            });
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