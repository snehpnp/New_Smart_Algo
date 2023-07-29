"use strict";
const Theme_list = require('../../Models/theme_list.model')
const { formattedDateTime } = require('../../Helper/time.helper')
class Theme {
    async AddTheme(req, res) {
        try {
            const { theme_name, theme_version, primary_col, nav_head_col, header_col, sidebar_col
                , sidebar, header_position, sidebar_position, layout, container, body_font, dashboard, image } = req.body

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
                theme_version: theme_version,
                primary_col: primary_col,
                nav_head_col: nav_head_col,
                header_col: header_col,
                sidebar_col: sidebar_col,
                layout: layout,
                sidebar: sidebar,
                header_position: header_position,
                sidebar_position: sidebar_position,
                container: container,
                body_font: body_font,
                dashboard: dashboard,
                image: image
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