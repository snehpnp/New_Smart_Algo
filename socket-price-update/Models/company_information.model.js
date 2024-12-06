
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    panel_name: {
      type: String,
      required: true,
      unique: true,
    },
    panel_short_name: {
      type: String,
      required: true,
      unique: true,
    },
    panel_key: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
      unique: true,
    },
    domain_url: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    domain_url_https: {
      type: String,
      required: true,
    },
    broker_url: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    smtp_password: {
      type: String,
      default: "",
    },
    cc_mail: {
      type: String,
      default: "",
    },
    bcc_mail: {
      type: String,
      default: "",
    },
    smtphost: {
      type: String,
      default: "",
    },
    smtpport: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },
    watermark: {
      type: String,
      default: "",
    },
    loginimage: {
      type: String,
      default: "",
    },
    theme_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theme_list",
      default: null,
    },
    theme_name: {
      type: String,
      required: true,
    },
    disclaimer: {
      type: String,
      required: true,
    },
    disclaimer: {
      type: String,
      required: true,
    },
    dissArr: [
      {
        id: {
          type: Number,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    disclaimer_status: {
      type: String,
      enum: ["1", "0"],
      default: "0",
    },
    licenses: {
      type: Number,
    },
    month_ago_date: {
      type: Date,
      default: null,
    },
    month_ago_number: {
      type: Number,
      default: null,
    },
    refer_points: {
      type: Number,
    },
    current_date: {
      type: Date,
      default: null,
    },

    price_permission: {
      type: Number,
      default: 0,
    },
    Trade_type: {
      type: Number,
      enum: [0, 1, 2], 
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
   
    _id: true,
  }
);

const company = mongoose.model("company", CompanySchema);
module.exports = company;
