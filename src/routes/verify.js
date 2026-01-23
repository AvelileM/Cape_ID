// src/routes/verify.js
import express from "express";
import multer from "multer";
import path from "path";
import { hashFile } from "../services/hashService.js";
import { checkLedger } from "../services/ledgerService.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "src/storage/ids")),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// POST /api/verify-id
router.post("/verify-id", upload.single("id"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const hash = await hashFile(filePath);

    const entry = checkLedger(hash);

    res.json({
      verified: !!entry,
      hash,
      timestamp: entry?.timestamp || null,
      message: entry ? "ID is verified!" : "ID not found in ledger",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
