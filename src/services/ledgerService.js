
const ledger = [];

export function addToLedger(hash, metadata = {}) {
  const entry = {
    hash,
    timestamp: new Date().toISOString(),
    verified: metadata.verified || false,
    idNumber: metadata.idNumber || null,
    homeAffairsVerified: metadata.homeAffairs?.valid || false,
    faceVerified: metadata.faceMatch?.match || false
  };
  
  ledger.push(entry);
  return entry;
}

export function checkLedger(hash) {
  return ledger.find(entry => entry.hash === hash) || null;
}

export function getLedger() {
  return ledger;
}

export function isUserVerified(idNumber) {
  return ledger.find(entry => entry.idNumber === idNumber && entry.verified) || null;
}