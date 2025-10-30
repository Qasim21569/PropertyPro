# Email Notification Setup Guide

This guide explains how to set up email notifications for PropertyPro booking confirmations.

## 🚀 Quick Setup (Gmail)

### 1. Enable Gmail App Passwords

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords**
4. Generate a new app password for "PropertyPro"
5. Copy the 16-character password

### 2. Configure Firebase Functions

1. Navigate to your Firebase Functions directory:
   ```bash
   cd Real-estate-Booking-Website/firebase-backend/functions
   ```

2. Set environment variables:
   ```bash
   # Set your Gmail credentials
   firebase functions:config:set email.user="your-email@gmail.com"
   firebase functions:config:set email.pass="your-16-char-app-password"
   ```

3. Deploy the functions:
   ```bash
   npm run build
   firebase deploy --only functions
   ```

### 3. Update Client Configuration

Update the Firebase Functions URL in `client/src/utils/emailService.js`:

```javascript
const FIREBASE_FUNCTIONS_URL = "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api";
```

Replace `YOUR-PROJECT-ID` with your actual Firebase project ID.

## 📧 Email Features

### For Property Seekers:
- **Booking Confirmation**: When they book a visit
- **Visit Confirmed**: When owner approves their visit
- **Visit Cancelled**: When owner declines their visit

### For Property Owners:
- **New Booking Alert**: When someone books a visit to their property

## 🎨 Email Templates

The system sends beautiful HTML emails with:
- ✅ Professional branding
- 📅 Clear booking details
- 🎯 Action-specific messaging
- 📱 Mobile-responsive design

## 🔧 Customization

### Change Email Provider

Edit `firebase-backend/functions/src/services/emailService.ts`:

```typescript
const transporter = nodemailer.createTransporter({
  service: "your-provider", // gmail, outlook, yahoo, etc.
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});
```

### Customize Email Templates

Modify the HTML templates in `emailService.ts` to match your branding:
- Update colors, fonts, and styling
- Add your logo
- Customize messaging

## 🧪 Testing

1. Book a property visit as a user
2. Confirm/decline the booking as an owner
3. Check both email addresses for notifications

## 🚨 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Ensure 2FA is enabled on Gmail
   - Use app password, not regular password
   - Check email/password are correctly set

2. **"Function not found"**
   - Ensure functions are deployed: `firebase deploy --only functions`
   - Check Firebase Functions URL in client code

3. **"CORS error"**
   - Functions include CORS headers
   - Check Firebase project permissions

### Debug Mode:

Enable debug logging in `emailService.js`:

```javascript
console.log('Sending email to:', emailData.userEmail);
console.log('Email data:', emailData);
```

## 💡 Production Tips

1. **Use a dedicated email service** (SendGrid, Mailgun) for production
2. **Set up email templates** in your email service provider
3. **Monitor email delivery rates** and bounces
4. **Add unsubscribe links** for compliance
5. **Use environment variables** for all credentials

## 🔐 Security

- Never commit email credentials to version control
- Use Firebase Functions environment variables
- Consider using OAuth2 for Gmail instead of app passwords
- Regularly rotate email service credentials
