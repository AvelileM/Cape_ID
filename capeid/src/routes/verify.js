import express from "express";
import multer from "multer";
import path from "path";
import { hashFile } from "../services/hashService.js";
import { checkLedger } from "../services/ledgerService.js";

const router = express.Router();

// Set up multer to store uploaded files temporarily
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "src/storage/ids"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// POST /verify-id
router.post("/verify-id", upload.single("id"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const hash = await hashFile(filePath);

    const verified = checkLedger(hash);

    res.json({
      verified,
      hash,
      message: verified ? "ID is verified!" : "ID not found in ledger",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
