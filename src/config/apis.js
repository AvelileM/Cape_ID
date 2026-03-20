
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  homeAffairs: {
    url: process.env.HOME_AFFAIRS_API_URL,
    apiKey: process.env.HOME_AFFAIRS_API_KEY
  },
  faceVerification: {
    url: process.env.FACE_API_URL,
    apiKey: process.env.FACE_API_KEY
  },
  ocr: {
    url: process.env.OCR_API_URL,
    apiKey: process.env.OCR_API_KEY
  },
  smileIdentity: {
    url: process.env.SMILE_IDENTITY_API_URL,
    partnerId: process.env.SMILE_IDENTITY_PARTNER_ID,
    apiKey: process.env.SMILE_IDENTITY_API_KEY
  }
};
