"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingNotificationEmail = exports.sendBookingConfirmationEmail = void 0;
const nodemailer = __importStar(require("nodemailer"));
// Email configuration (you'll need to set these as environment variables)
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-app-password";
// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});
// Send booking confirmation email to user
const sendBookingConfirmationEmail = async (data) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: data.userEmail,
        subject: "Booking Confirmation - PropertyPro",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">Booking Confirmation</h2>
        <p>Dear ${data.userName},</p>
        <p>Your property visit has been successfully booked!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Booking Details</h3>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <p><strong>Address:</strong> ${data.propertyAddress}</p>
          <p><strong>Visit Date:</strong> ${data.bookingDate}</p>
        </div>
        
        <p>The property owner will contact you soon to confirm the exact time.</p>
        <p>Thank you for using PropertyPro!</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6c757d;">
          This is an automated email from PropertyPro. Please do not reply to this email.
        </p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Booking confirmation email sent successfully");
    }
    catch (error) {
        console.error("Error sending booking confirmation email:", error);
        throw error;
    }
};
exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
// Send booking notification email to property owner
const sendBookingNotificationEmail = async (data) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: data.propertyOwnerEmail,
        subject: "New Property Visit Booking - PropertyPro",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007bff;">New Booking Received</h2>
        <p>You have received a new booking for your property!</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #dc3545; margin-top: 0;">Booking Details</h3>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <p><strong>Address:</strong> ${data.propertyAddress}</p>
          <p><strong>Visit Date:</strong> ${data.bookingDate}</p>
          <p><strong>Visitor:</strong> ${data.userName}</p>
          <p><strong>Contact:</strong> ${data.userEmail}</p>
        </div>
        
        <p>Please contact the visitor to confirm the exact time for the visit.</p>
        <p>Thank you for using PropertyPro!</p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6c757d;">
          This is an automated email from PropertyPro. Please do not reply to this email.
        </p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Booking notification email sent to owner successfully");
    }
    catch (error) {
        console.error("Error sending booking notification email:", error);
        throw error;
    }
};
exports.sendBookingNotificationEmail = sendBookingNotificationEmail;
//# sourceMappingURL=emailService.js.map