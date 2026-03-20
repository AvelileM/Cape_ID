
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config/apis.js';

/**
 * Extract ID number from document using OCR
 * @param {string} filePath - Path to ID document
 * @returns {Promise} Extracted ID number
 */
export async function extractIDNumber(filePath) {
  try {
    // DEMO MODE
    if (process.env.NODE_ENV === 'development') {
      return simulateOCR();
    }

    // Real OCR API call
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const response = await axios.post(
      config.ocr.url,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${config.ocr.apiKey}`
        },
        timeout: 3000
      }
    );

    // Extract ID number from OCR result
    const text = response.data.text;
    const idNumberMatch = text.match(/\b\d{13}\b/);
    
    if (!idNumberMatch) {
      throw new Error('Could not extract ID number from document');
    }

    return idNumberMatch[0];
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to read ID document');
  }
}

function simulateOCR() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a valid demo SA ID number
      resolve('9001155800087');
    }, 300);
  });
}