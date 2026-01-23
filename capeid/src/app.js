import express from "express";
import path from "path";
import registerRoute from "./routes/register.js";
import verifyRoute from "./routes/verify.js";

const app = express();

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(process.cwd(), "public")));

// API routes
app.use("/api", registerRoute); // /api/register-id
app.use("/api", verifyRoute);   // /api/verify-id

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

export default app;
