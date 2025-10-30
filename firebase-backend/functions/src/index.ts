import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import express from "express";
import cors from "cors";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// User routes
import userRoutes from "./routes/userRoutes";
app.use("/api/user", userRoutes);

// Property routes  
import propertyRoutes from "./routes/propertyRoutes";
app.use("/api/property", propertyRoutes);

// Email notification endpoint
app.post("/api/send-booking-status-email", async (req, res) => {
  try {
    const { sendBookingStatusUpdateEmail } = await import("./services/emailService");
    await sendBookingStatusUpdateEmail(req.body);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

// Export the Express app as a Firebase Function
export const api = onRequest(app);

