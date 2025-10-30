# 🧪 Test Your Project Locally (No Billing Required!)

## Option 2: Local Testing Without Firebase Functions

Since you're worried about billing, let's test the frontend first without Firebase Functions.

### Step 1: Test Frontend Only
```bash
cd c:\Qasim\PropertyPro\Real-estate-Booking-Website\client
npm run dev
```

### Step 2: Mock the Backend (Temporary)
Create a simple mock API to test the frontend:

**File: `client/src/utils/mockApi.js`**
```javascript
// Mock API for testing without Firebase Functions
export const mockApi = {
  // Mock user registration
  createUser: async (email, name, role) => {
    console.log(`Mock: Creating user ${email} as ${role}`);
    return { message: "User created successfully" };
  },

  // Mock property listing
  getAllProperties: async () => {
    return [
      {
        id: "1",
        title: "Beautiful Apartment",
        description: "Modern 2-bedroom apartment",
        price: 1200,
        address: "123 Main St",
        city: "New York",
        country: "USA",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500"
      },
      {
        id: "2", 
        title: "Cozy House",
        description: "3-bedroom family home",
        price: 1800,
        address: "456 Oak Ave",
        city: "Los Angeles", 
        country: "USA",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500"
      }
    ];
  },

  // Mock booking
  bookVisit: async (propertyId, date) => {
    console.log(`Mock: Booking visit for property ${propertyId} on ${date}`);
    return { message: "Visit booked successfully" };
  }
};
```

### Step 3: Update API Calls (Temporary)
In your components, replace Firebase API calls with mock calls for testing.

## Benefits of This Approach:
✅ **No billing required**  
✅ **Test all frontend features**  
✅ **See how the UI works**  
✅ **Verify role-based navigation**  
✅ **Test property creation forms**  

## When You're Ready for Full Testing:
- Enable Firebase billing (it's safe!)
- Or deploy to Vercel with mock data first

