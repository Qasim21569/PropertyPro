"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Initialize Firebase Admin
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// User routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
app.use("/api/user", userRoutes_1.default);
// Property routes  
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
app.use("/api/property", propertyRoutes_1.default);
// Export the Express app as a Firebase Function
exports.api = (0, https_1.onRequest)(app);
//# sourceMappingURL=index.js.map