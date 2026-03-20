
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { config } from '../config/apis.js';

/**
 * Compare face from ID document with live selfie
 * @param {string} idImagePath - Path to ID document
 * @param {Buffer} selfieBuffer - Live selfie image buffer
 * @returns {Promise} Face comparison result
 */
export async function compareFaces(idImagePath, selfieBuffer) {
  try {
    // DEMO MODE
    if (process.env.NODE_ENV === 'development') {
      return simulateFaceComparison();
    }

    // Real face comparison API
    const formData = new FormData();
    formData.append('sourceImage', fs.createReadStream(idImagePath));
    formData.append('targetImage', selfieBuffer, { filename: 'selfie.jpg' });

    const response = await axios.post(
      config.faceVerification.url,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${config.faceVerification.apiKey}`
        },
        timeout: 5000
      }
    );

    return {
      match: response.data.confidence > 0.95,
      confidence: response.data.confidence,
      similarity: response.data.similarity
    };
  } catch (error) {
    console.error('Face verification error:', error);
    throw new Error('Face verification failed');
  }
}

function simulateFaceComparison() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        match: true,
        confidence: 0.98,
        similarity: 98.5
      });
    }, 500);
  });
}