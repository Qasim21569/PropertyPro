# 🔥 Firebase Setup Instructions

## Required Updates to Your Code

### 1. Update Firebase Configuration
**File:** `client/src/config/firebase.js`

Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 2. Update Firebase Project ID
**File:** `firebase-backend/.firebaserc`

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 3. Update API URL (for frontend)
**File:** `client/src/utils/firebaseApi.js`

```javascript
// Replace this line:
const API_BASE_URL = "http://localhost:5001/your-project-id/us-central1/api";

// With your actual project ID:
const API_BASE_URL = "http://localhost:5001/your-actual-project-id/us-central1/api";
```

## Quick Commands to Run

### Install Dependencies:
```bash
# Backend
cd firebase-backend/functions
npm install

# Frontend  
cd ../../client
npm install
```

### Start Development:
```bash
# Terminal 1 - Start Firebase Emulator
cd firebase-backend
firebase login
firebase emulators:start

# Terminal 2 - Start React App
cd client
npm run dev
```

## Testing Without Full Setup (Quick Test)

If you want to test immediately without setting up email:

1. **Comment out email functionality** in `firebase-backend/functions/src/routes/userRoutes.ts`:
   - Lines 128-149 (the email sending code)
   - Just add `//` at the beginning of those lines

2. **Use Firebase Emulator** (runs locally, no deployment needed):
   ```bash
   cd firebase-backend
   firebase emulators:start
   ```

This will run everything locally on your machine for testing!

