"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
// import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from "../services/emailService";
const router = (0, express_1.Router)();
const db = (0, firestore_1.getFirestore)();
// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decodedToken = await (0, auth_1.getAuth)().verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
// Create or update user profile
router.post("/register", verifyToken, async (req, res) => {
    try {
        const { email, name, role } = req.body;
        const uid = req.user.uid;
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            return res.status(200).json({
                message: "User already exists",
                user: userDoc.data()
            });
        }
        const userData = {
            uid,
            email,
            name: name || "",
            role: role || "user",
            createdAt: new Date(),
            bookings: [],
            favorites: []
        };
        await userRef.set(userData);
        res.status(201).json({
            message: "User created successfully",
            user: userData
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(userDoc.data());
    }
    catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Book a visit
router.post("/bookVisit/:propertyId", verifyToken, async (req, res) => {
    var _a;
    try {
        const { propertyId } = req.params;
        const { date } = req.body;
        const uid = req.user.uid;
        // Get user document
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = userDoc.data();
        // Check if already booked
        const existingBooking = (_a = userData.bookings) === null || _a === void 0 ? void 0 : _a.find(booking => booking.propertyId === propertyId);
        if (existingBooking) {
            return res.status(400).json({ message: "Property already booked" });
        }
        // Get property details
        const propertyDoc = await db.collection("properties").doc(propertyId).get();
        if (!propertyDoc.exists) {
            return res.status(404).json({ message: "Property not found" });
        }
        const propertyData = propertyDoc.data();
        // Create booking
        const booking = {
            propertyId,
            propertyTitle: (propertyData === null || propertyData === void 0 ? void 0 : propertyData.title) || "",
            date,
            status: "pending",
            createdAt: new Date()
        };
        // Update user bookings
        const updatedBookings = [...(userData.bookings || []), booking];
        await userRef.update({ bookings: updatedBookings });
        // Send email notifications - DISABLED FOR TESTING
        // TODO: Enable email after setting up Gmail SMTP
        /*
        try {
          const emailData = {
            userEmail: userData.email,
            userName: userData.name || "User",
            propertyTitle: propertyData.title,
            propertyAddress: `${propertyData.address}, ${propertyData.city}`,
            bookingDate: date,
            propertyOwnerEmail: propertyData.ownerEmail
          };
    
          // Send confirmation email to user
          await sendBookingConfirmationEmail(emailData);
          
          // Send notification email to property owner
          await sendBookingNotificationEmail(emailData);
          
          console.log("Booking emails sent successfully");
        } catch (emailError) {
          console.error("Error sending booking emails:", emailError);
          // Don't fail the booking if email fails
        }
        */
        console.log("Email notifications disabled for testing");
        res.json({ message: "Visit booked successfully", booking });
    }
    catch (error) {
        console.error("Error booking visit:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get all user bookings
router.get("/bookings", verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = userDoc.data();
        res.json({ bookings: userData.bookings || [] });
    }
    catch (error) {
        console.error("Error getting bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Cancel booking
router.delete("/booking/:propertyId", verifyToken, async (req, res) => {
    var _a;
    try {
        const { propertyId } = req.params;
        const uid = req.user.uid;
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = userDoc.data();
        const updatedBookings = ((_a = userData.bookings) === null || _a === void 0 ? void 0 : _a.filter(booking => booking.propertyId !== propertyId)) || [];
        await userRef.update({ bookings: updatedBookings });
        res.json({ message: "Booking cancelled successfully" });
    }
    catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Add/Remove from favorites
router.post("/favorite/:propertyId", verifyToken, async (req, res) => {
    try {
        const { propertyId } = req.params;
        const uid = req.user.uid;
        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        let updatedFavorites;
        let message;
        if (favorites.includes(propertyId)) {
            updatedFavorites = favorites.filter(id => id !== propertyId);
            message = "Removed from favorites";
        }
        else {
            updatedFavorites = [...favorites, propertyId];
            message = "Added to favorites";
        }
        await userRef.update({ favorites: updatedFavorites });
        res.json({ message, favorites: updatedFavorites });
    }
    catch (error) {
        console.error("Error updating favorites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get user favorites
router.get("/favorites", verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = userDoc.data();
        res.json({ favorites: userData.favorites || [] });
    }
    catch (error) {
        console.error("Error getting favorites:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map