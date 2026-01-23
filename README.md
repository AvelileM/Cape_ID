<<<<<<< Updated upstream
# Cape_ID
=======
# 🔐 CapeID – Decentralized Identity Verification API

CapeID is a privacy-preserving identity verification system designed for Cape Town institutions such as clinics, NGOs, and schools.  
It allows identity documents to be verified without storing or sharing the actual document.

---

## 🧩 Problem

In Cape Town, people are repeatedly required to submit certified copies of their IDs to:
- Clinics
- NGOs
- Schools
- Job placement programs

This leads to:
- Privacy risks
- Data leaks
- Lost paperwork
- Long queues
- Identity fraud

---

## 💡 Solution

CapeID verifies the **authenticity and integrity** of an ID document without storing it.

- ID is uploaded once at a trusted institution
- A cryptographic hash is generated
- The hash is stored in an immutable ledger
- Future verification checks the hash — not the document

---

## 🔍 What CapeID Verifies

✅ That an ID document has not been altered  
✅ That the same document is being reused  
❌ It does NOT verify the physical identity of the person  

This makes CapeID privacy-first and realistic for an MVP.

---

## 🏷 Track

**Identity & Security**

---

## ⚙️ How It Works

1. User uploads an ID document
2. The system hashes the document
3. The hash is stored in a simulated decentralized ledger
4. Institutions verify the ID by comparing hashes
5. No raw ID data is stored or shared

---

## 🧪 MVP Features

- Upload ID document
- Generate SHA-256 hash
- Store hash in immutable JSON ledger
- Verify document authenticity
- Simple REST API

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Crypto (hashing)
- Local file storage
- JSON ledger (simulated blockchain)

---

## 🧱 Architecture (MVP)
>>>>>>> Stashed changes
