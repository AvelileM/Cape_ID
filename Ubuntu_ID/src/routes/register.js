// src/routes/register.js
import express from "express";
import multer from "multer";
import path from "path";
import { hashFile } from "../services/hashService.js";
import { addToLedger } from "../services/ledgerService.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "src/storage/ids")),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// POST /api/register-id
router.post("/register-id", upload.single("id"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const hash = await hashFile(filePath);

    const entry = addToLedger(hash); // includes timestamp

    res.json({
      success: true,
      hash: entry.hash,
      timestamp: entry.timestamp,
      message: "ID successfully registered!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
