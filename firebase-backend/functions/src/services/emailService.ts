import * as nodemailer from "nodemailer";

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

export interface BookingEmailData {
  userEmail: string;
  userName: string;
  propertyTitle: string;
  propertyAddress: string;
  bookingDate: string;
  propertyOwnerEmail: string;
}

// Send booking confirmation email to user
export const sendBookingConfirmationEmail = async (data: BookingEmailData) => {
  const mailOptions = {
    from: `"PropertyPro Notifications" <${EMAIL_USER}>`,
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
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};

// Send booking notification email to property owner
export const sendBookingNotificationEmail = async (data: BookingEmailData) => {
  const mailOptions = {
    from: `"PropertyPro Notifications" <${EMAIL_USER}>`,
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
  } catch (error) {
    console.error("Error sending booking notification email:", error);
    throw error;
  }
};

// Send booking status update email to user
export const sendBookingStatusUpdateEmail = async (
  data: BookingEmailData & { 
    status: string; 
    ownerName?: string; 
    ownerPhone?: string;
    visitTime?: string;
  }
) => {
  const isConfirmed = data.status === 'confirmed';
  const isCancelled = data.status === 'cancelled';
  
  const statusColor = isConfirmed ? '#28a745' : isCancelled ? '#dc3545' : '#ffc107';
  const statusText = isConfirmed ? 'CONFIRMED' : isCancelled ? 'CANCELLED' : 'UPDATED';
  
  const mailOptions = {
    from: `"PropertyPro Notifications" <${EMAIL_USER}>`,
    to: data.userEmail,
    subject: `Property Visit ${statusText} - PropertyPro`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColor};">Visit ${statusText}</h2>
        <p>Dear ${data.userName},</p>
        
        ${isConfirmed ? `
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">✅ Your visit has been confirmed!</h3>
            <p style="color: #155724; margin-bottom: 0;">The property owner has approved your visit request.</p>
          </div>
        ` : isCancelled ? `
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">❌ Your visit has been cancelled</h3>
            <p style="color: #721c24; margin-bottom: 0;">Unfortunately, the property owner cannot accommodate your visit request at this time.</p>
          </div>
        ` : ''}
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Visit Details</h3>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <p><strong>Address:</strong> ${data.propertyAddress}</p>
          <p><strong>Date:</strong> ${data.bookingDate}</p>
          ${data.visitTime ? `<p><strong>Time:</strong> ${data.visitTime}</p>` : ''}
          <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${data.status.toUpperCase()}</span></p>
        </div>
        
        ${isConfirmed ? `
          <div style="background-color: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #0066cc; margin-top: 0;">Next Steps</h3>
            <p>• The property owner may contact you to confirm the exact visit time</p>
            <p>• Please arrive on time for your scheduled visit</p>
            <p>• Bring a valid ID for verification</p>
            <p>• Feel free to ask questions about the property during your visit</p>
          </div>
          
          ${data.ownerPhone ? `
            <p><strong>Owner Contact:</strong> ${data.ownerPhone}</p>
          ` : ''}
        ` : isCancelled ? `
          <p>You can browse other properties on PropertyPro and book new visits.</p>
        ` : ''}
        
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
    console.log(`Booking status update email (${data.status}) sent successfully`);
  } catch (error) {
    console.error("Error sending booking status update email:", error);
    throw error;
  }
};
