const mongoose = require("mongoose");

const Admin_Permission_Schema = new mongoose.Schema(
  {
    panel_name: {
      type: String,
      required: [true, "Please enter Panel name unique!"],
      unique: true,
    },
    domain: {
      type: String,
      required: [true, "Please enter Domain name unique!"],
      unique: true,
      index: true,
    },
  
    key: {
      type: String,
    },
    ip_address: {
      type: String,
      required: true,
    },
    is_active: {
      type: Number, // Change the type to Number
      enum: [1, 0], // Use numbers instead of strings
      default: 0,
    },
    is_expired: {
      type: Number, // Change the type to Number
      enum: [1, 0], // Use numbers instead of strings
      default: 0,
    },
    theme_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theme_list",
    },
    broker_id: [
      {
        id: String,
        name: String,
      },
    ],
    Option_chain: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    Create_Strategy: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    Strategy_plan: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    live_price: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    Two_day_client: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    Refer_Earn: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    Plans: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    backend_rul: {
      type: String,
    },
    month_ago_date: {
      type: Date,
      default: null,
    },
    month_ago_number: {
      type: Number,
      default: null,
    },
    themeId: {
      type: Number,
      unique: true,
    },
    theme_name: {
      type: String,
      required: true,
      unique: true,
      default: null,
    },
    theme_version: {
      type: String,
      required: true,
      default: null,
    },
    primary_col: {
      type: String,
      required: true,
      default: null,
    },
    nav_head_col: {
      type: String,
      required: true,
      default: null,
    },
    header_col: {
      type: String,
      required: true,
      default: null,
    },
    sidebar_col: {
      type: String,
      required: true,
      default: null,
    },
    layout: {
      type: String,
      required: true,
      default: null,
    },
    sidebar: {
      type: String,
      required: true,
      default: null,
    },
    header_position: {
      type: String,
      required: true,
      default: null,
    },

    container: {
      type: String,
      required: true,
      default: null,
    },
    body_font: {
      type: String,
      required: true,
      default: null,
    },
    dashboard: {
      type: String,
      required: true,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    pnl_position: {
      type: String,
      enum: ["top", "bottom"],
      default: "top",
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const Admin_Permission = mongoose.model(
  "admin_permission",
  Admin_Permission_Schema
);
module.exports = Admin_Permission;
