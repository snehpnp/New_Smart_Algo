const mongoose = require("mongoose");

const panelSchema = new mongoose.Schema(
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
    port: {
      type: String,
      required: [true, "Please enter Port name unique!"],
    },
    key: {
      type: String,
    },
    db_url: {
      type: String,
    },
    db_url: {
      type: String,
    },
    db_name: {
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
    }
  
  },
  {
    timestamps: true,
  }
);

const panel_model = mongoose.model("All_panels", panelSchema);
module.exports = panel_model;
