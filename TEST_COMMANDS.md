# 🧪 Testing Your Project - Ready to Go!

## ✅ All Setup Complete! 
Your Firebase project is ready for testing. I've temporarily disabled email to make testing easier.

## 🚀 Run These 3 Commands:

### Step 1: Start Firebase Backend (Terminal 1)
```bash
cd c:\Qasim\PropertyPro\Real-estate-Booking-Website\firebase-backend
firebase login
firebase emulators:start
```

### Step 2: Start React Frontend (Terminal 2) 
```bash
cd c:\Qasim\PropertyPro\Real-estate-Booking-Website\client
npm run dev
```

### Step 3: Test in Browser
- Open: http://localhost:5173
- The Firebase emulator will run on: http://localhost:5001

## 🧪 Test These Features:

### 1. User Registration & Login
- Click "Login" → "Sign up" 
- Test both roles: "Property Seeker" and "Property Owner"

### 2. Property Owner Tests:
- Login as owner → Go to "Dashboard"
- Create a new property listing
- View your properties

### 3. User Tests:  
- Login as user → Browse "Properties"
- Book a visit to a property
- Add properties to favorites
- Check your "Dashboard" for bookings

### 4. Role-Based Access:
- Users see "User Dashboard" 
- Owners see "Owner Dashboard" with property management

## 🐛 If Something Doesn't Work:

1. **Firebase Console Errors**: Make sure you created the Firebase project
2. **Login Issues**: Check browser console for errors
3. **API Errors**: Make sure both terminals are running

## 🔧 Quick Fixes:

### Update Firebase Config (if needed):
1. Get your real Firebase config from [Firebase Console](https://console.firebase.google.com)
2. Replace the demo config in `client/src/config/firebase.js`

### Enable Emails Later:
- Uncomment lines 129-153 in `firebase-backend/functions/src/routes/userRoutes.ts`
- Set up Gmail SMTP credentials

## 🎯 Your Project Features:
✅ Role-based authentication (Users vs Owners)  
✅ Property listings management  
✅ Visit booking system  
✅ Favorites system  
✅ Responsive dashboards  
✅ Secure API with Firebase  

**Perfect for your college project!** 🎓

