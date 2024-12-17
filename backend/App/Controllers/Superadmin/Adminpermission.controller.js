const db = require("../../Models");
const panel_model = db.panel_model;
const Admin_Permission = db.Admin_Permission;

class AdminPermission {
  async UpdateAdminPermission(req, res) {
    try {
      let { panel, theme } = req.body;

      let req1 = {
        panel_name: panel.panel_name,
        domain: panel.domain,
        key: panel.key,
        ip_address: panel.ip_address,
        is_active: panel.is_active,
        is_expired: panel.is_expired,
        theme_id: panel.theme_id,
        broker_id: panel.broker_id,
        Option_chain: panel.Option_chain,
        Create_Strategy: panel.Create_Strategy,
        Strategy_plan: panel.Strategy_plan,
        live_price: panel.live_price,
        Two_day_client: panel.Two_day_client,
        Refer_Earn: panel.Refer_Earn,
        Plans: panel.Plans,
        backend_rul: panel.backend_rul,
        month_ago_date: panel.month_ago_date,
        month_ago_number: panel.month_ago_number,
        themeId: theme.themeId,
        theme_name: theme.theme_name,
        theme_version: theme.theme_version,
        primary_col: theme.primary_col,
        nav_head_col: theme.nav_head_col,
        header_col: theme.header_col,
        sidebar_col: theme.sidebar_col,
        layout: theme.layout,
        sidebar: theme.sidebar,
        header_position: theme.header_position,
        container: theme.container,
        body_font: theme.body_font,
        dashboard: theme.dashboard,
      };
      // console.log(req1);
      const FindAdminPermission = await Admin_Permission.find({});

      if (FindAdminPermission.length == 0) {
        const AddAdminPermission = new Admin_Permission(req1);
        await AddAdminPermission.save();
      } else {
        const UpdateAdminPermission = await Admin_Permission.findOneAndUpdate(
          {},

          req1,
          { new: true }
        );
      }

      return res.send({
        msg: "Admin Permission Updated",
        status: true,
        data: [],
      });
    } catch (error) {
      console.log("Error Sneh", error.response);
      res.send({ status: false, msg: "Internal Server Error", data: [] });
    }
  }

  async updatePnlPosition(req, res) {
    try {
      let { pnlposition } = req.body;

      const UpdatePnlPosition = await Admin_Permission.findOneAndUpdate(
        {},
        { pnl_position: pnlposition },
        { new: true }
      );

      return res.send({ msg: "Panel Updated", status: true, data: [] });
    } catch (error) {
      console.log("Error Sneh", error.response);
      res.send({ msg: "Internal Server Error", status: false, data: [] });
    }
  }

  async GetPnlPostion(req, res) {
    try {
      const GetPnlPosition = await Admin_Permission.find({}).select('pnl_position');
      return res.send({
        msg: "Pnl Position",
        status: true,
        data: GetPnlPosition,
      });
    } catch (error) {
      console.log("Error Sneh", error.response);
      res.send({ msg: "Internal Server Error", status: false, data: [] });
    }
  }
}
module.exports = new AdminPermission();
