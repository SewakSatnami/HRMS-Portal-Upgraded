import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { Admin } from "../models/AdminModel.js";

const adminRouter = express.Router();

// ---------- Multer setup ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------- Register ----------
adminRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashed });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- Login ----------
adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- Get profile ----------
adminRouter.get("/profile/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- Update profile ----------
adminRouter.put("/update/:id", async (req, res) => {
  try {
    const { name, phone, address, position } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, position },
      { new: true }
    );
    res.json({ message: "Profile updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- Upload image ----------
adminRouter.post(
  "/upload/:id",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });
      const imagePath = `/uploads/${req.file.filename}`;
      const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        { profileImage: imagePath },
        { new: true }
      );
      res.json({ message: "Image uploaded successfully", admin });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ Correct export
export default adminRouter;
