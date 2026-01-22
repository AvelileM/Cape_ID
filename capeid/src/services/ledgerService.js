// src/services/ledgerService.js

// Ledger stores objects now: { hash, timestamp }
const ledger = [];

/**
 * Add a hash to the ledger with a timestamp
 * @param {string} hash
 */
export function addToLedger(hash) {
  const entry = {
    hash,
    timestamp: new Date().toISOString(), // ISO timestamp
  };
  ledger.push(entry);
  return entry; // return the entry for convenience
}

/**
 * Check if a hash exists in the ledger and return the entry
 * @param {string} hash
 * @returns {object|null} - { hash, timestamp } or null
 */
export function checkLedger(hash) {
  return ledger.find((entry) => entry.hash === hash) || null;
}

/**
 * Optional: Get all ledger entries
 */
export function getLedger() {
  return ledger;
}
