
// ledgerService.js
import fs from "fs";
import path from "path";

const ledgerPath = path.join(process.cwd(), "src/storage/ledger.json");

// Add a hash to the ledger
export function addToLedger(hash, filename) {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
  ledger.push({
    hash,
    filename,
    timestamp: new Date().toISOString(),
  });
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
}

// Check if hash exists in the ledger
export function checkLedger(hash) {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
  return ledger.some((entry) => entry.hash === hash);
}
