
import express from 'express';
import path from 'path';
import registerRoute from './routes/register.js';
import verifyRoute from './routes/verify.js';
import verificationRoute from './routes/verification.js';

const app = express();

// Increase payload limit for base64 images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(process.cwd(), 'public')));

// API routes
app.use('/api', registerRoute);
app.use('/api', verifyRoute);
app.use('/api', verificationRoute); // NEW: Fast verification

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

app.get('/verify', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/verification.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/dashboard.html'));
});

export default app;