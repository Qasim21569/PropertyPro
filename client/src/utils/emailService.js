// Email service for sending notifications via Firebase Functions

const FIREBASE_FUNCTIONS_URL = "https://us-central1-propertypro-39565.cloudfunctions.net/api";

// For college project - you can enable/disable emails here
const EMAIL_ENABLED = false; // Set to true when you want to enable emails

// Send booking status update email
export const sendBookingStatusEmail = async (emailData) => {
  // For college project - simulate email sending
  if (!EMAIL_ENABLED) {
    console.log('📧 Email simulation - would send to:', emailData.userEmail);
    console.log('📄 Email content:', {
      subject: `Property Visit ${emailData.status.toUpperCase()} - PropertyPro`,
      property: emailData.propertyTitle,
      date: emailData.bookingDate,
      status: emailData.status
    });
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true; // Simulate success
  }

  // Real email sending (when EMAIL_ENABLED = true)
  try {
    const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/send-booking-status-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to prevent blocking the UI
    return false;
  }
};

// Helper function to format booking data for email
export const formatBookingEmailData = (booking, property, user, status, additionalData = {}) => {
  return {
    userEmail: user.email,
    userName: user.name || user.email.split('@')[0],
    propertyTitle: booking.propertyTitle || property?.title,
    propertyAddress: `${booking.propertyAddress || property?.address}, ${booking.propertyCity || property?.city}`,
    bookingDate: booking.date,
    propertyOwnerEmail: property?.ownerEmail,
    status: status,
    ...additionalData
  };
};
