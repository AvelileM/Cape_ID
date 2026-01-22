import express from "express";
import multer from "multer";
import path from "path";
import { hashFile } from "../services/hashService.js";
import { addToLedger } from "../services/ledgerService.js";

const router = express.Router();

// Set up multer to store uploaded files in src/storage/ids
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "src/storage/ids"));
  },
  filename: function (req, file, cb) {
    // Save file with original name
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// POST /upload-id
router.post("/upload-id", upload.single("id"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Hash the uploaded file
    const filePath = req.file.path;
    const hash = await hashFile(filePath);

    // Add hash to ledger
    addToLedger(hash, req.file.originalname);

    res.json({
      message: "ID registered successfully",
      hash: hash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
