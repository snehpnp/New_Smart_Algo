const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_extension: { type: String, required: true },
  file_status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  file_id: { type: String },
});

const identityProofSchema = new mongoose.Schema({
  can_upload: { type: String, default: "false" },
  doc_type: { type: String, required: true },
  doc_id_number: { type: String, required: true },
  files: [fileSchema],
  status: { type: String, default: "Uploaded" },
  view_comment: { type: String, default: "false" },
  valid_from: { type: String, required: true },
  valid_till: { type: String, required: true },
  last_upload_at: { type: Date, default: Date.now },
  last_verification_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const addressProofSchema = new mongoose.Schema({
  can_upload: { type: String, default: "false" },
  status: { type: String, default: "Uploaded" },
  comments_on: { type: String },
  doc_type: { type: String, required: true },
  view_comment: { type: String, default: "false" },
  files: [fileSchema],
  last_upload_at: { type: Date, default: Date.now },
  last_verification_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const photoProofSchema = new mongoose.Schema({
  can_upload: { type: String, default: "false" },
  status: { type: String, default: "Uploaded" },
  view_comment: { type: String, default: "false" },
  file_name: { type: String, required: true },
  last_upload_at: { type: Date, default: Date.now },
  last_verification_at: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const customerSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  user_name: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  phone_code: { type: String, required: true },
  user_dob: { type: Date, required: true },
  kyc_status: { type: String, default: "Pending" },
  identity_proof: [identityProofSchema],
  photo_proof: photoProofSchema,
  add_proof: [addressProofSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ttt = mongoose.model("ttt", customerSchema);

module.exports = ttt;
