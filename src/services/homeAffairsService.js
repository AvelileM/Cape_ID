
import axios from 'axios';
import { config } from '../config/apis.js';

/**
 * Verify SA ID number with Home Affairs
 * @param {string} idNumber - South African ID number
 * @returns {Promise} Verification result
 */
export async function verifyWithHomeAffairs(idNumber) {
  try {
    // DEMO MODE - Remove in production
    if (process.env.NODE_ENV === 'development') {
      return simulateHomeAffairsCheck(idNumber);
    }

    // Real API call
    const response = await axios.post(
      config.homeAffairs.url,
      { idNumber },
      {
        headers: {
          'Authorization': `Bearer ${config.homeAffairs.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      }
    );

    return {
      valid: response.data.valid,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      dateOfBirth: response.data.dateOfBirth,
      citizenship: response.data.citizenship
    };
  } catch (error) {
    console.error('Home Affairs verification error:', error);
    throw new Error('Unable to verify with Home Affairs');
  }
}

// Simulate Home Affairs for demo (800ms response time)
function simulateHomeAffairsCheck(idNumber) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic SA ID validation
      const isValid = validateSAIDNumber(idNumber);
      
      resolve({
        valid: isValid,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        citizenship: 'South African'
      });
    }, 800);
  });
}

function validateSAIDNumber(idNumber) {
  if (!idNumber || idNumber.length !== 13) return false;
  
  // Basic Luhn check for SA ID
  const digits = idNumber.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      sum += digits[i];
    } else {
      let doubled = digits[i] * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[12];
}