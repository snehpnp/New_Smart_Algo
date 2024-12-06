const mongoose = require("mongoose");

const fundLogSchema = new mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
    fund_status: {
      type: String,
      default: null,
    },
    fund_amount: {
      type: Number,
      default: null,
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

const UserFundLogs = mongoose.model("user_fund_logs", fundLogSchema);
module.exports = UserFundLogs;
