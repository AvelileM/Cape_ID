
import express from 'express';
import multer from 'multer';
import path from 'path';
import { extractIDNumber } from '../services/ocrService.js';
import { verifyWithHomeAffairs } from '../services/homeAffairsService.js';
import { compareFaces } from '../services/faceVerificationService.js';
import { hashFile } from '../services/hashService.js';
import { addToLedger } from '../services/ledgerService.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'src/storage/temp')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * Fast verification endpoint (Binance-style)
 * POST /api/verify-instant
 */
router.post('/verify-instant', upload.single('idDocument'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No ID document uploaded' });
    }

    if (!req.body.selfie) {
      return res.status(400).json({ error: 'No selfie provided' });
    }

    const idPath = req.file.path;
    const selfieBuffer = Buffer.from(req.body.selfie, 'base64');

    // Step 1: Extract ID number (OCR)
    const idNumber = await extractIDNumber(idPath);

    // Step 2 & 3: Run in parallel for speed
    const [homeAffairsResult, faceResult] = await Promise.all([
      verifyWithHomeAffairs(idNumber),
      compareFaces(idPath, selfieBuffer)
    ]);

    // Check if verification passed
    if (!homeAffairsResult.valid) {
      return res.status(400).json({
        error: 'ID verification failed',
        reason: 'Invalid ID number or not registered with Home Affairs'
      });
    }

    if (!faceResult.match) {
      return res.status(400).json({
        error: 'Face verification failed',
        reason: 'Face does not match ID document'
      });
    }

    // Step 4: Register in ledger
    const hash = await hashFile(idPath);
    const ledgerEntry = addToLedger(hash, {
      idNumber,
      verified: true,
      homeAffairs: homeAffairsResult,
      faceMatch: faceResult
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      verified: true,
      processingTime: `${processingTime}ms`,
      user: {
        firstName: homeAffairsResult.firstName,
        lastName: homeAffairsResult.lastName,
        idNumber: idNumber.replace(/(\d{6})(\d{4})(\d{3})/, '$1****$3') // Masked
      },
      verification: {
        homeAffairs: {
          valid: true,
          citizenship: homeAffairsResult.citizenship
        },
        faceMatch: {
          verified: true,
          confidence: faceResult.confidence
        },
        documentHash: hash
      },
      timestamp: ledgerEntry.timestamp
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: error.message
    });
  }
});

export default router;