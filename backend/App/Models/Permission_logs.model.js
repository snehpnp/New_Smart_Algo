const mongoose = require("mongoose");

const Permission_logs_Schema = new mongoose.Schema(
  {
    status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    msg: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const Permission_Logs = mongoose.model("permission_logs", Permission_logs_Schema);
module.exports = Permission_Logs;
