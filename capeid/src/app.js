// app.js
import express from "express";
import path from "path";

const app = express();

// Serve frontend
app.use(express.static(path.join(process.cwd(), "public")));

// Routes
import uploadRoute from "./routes/upload.js";
import verifyRoute from "./routes/verify.js";

app.use(uploadRoute);
app.use(verifyRoute);

export default app;



