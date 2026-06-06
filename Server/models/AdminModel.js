import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  position: { type: String },
  profileImage: { type: String },
});

export const Admin = mongoose.model("Admin", adminSchema);
