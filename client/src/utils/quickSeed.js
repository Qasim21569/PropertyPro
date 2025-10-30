// Quick console method to seed properties
// Run this in browser console: window.quickSeedProperties()

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const sampleProperty = {
  title: "Luxury Apartment in Mumbai",
  description: "Beautiful 3BHK apartment with modern amenities in the heart of Mumbai. Perfect for families with spacious rooms, balcony views, and 24/7 security.",
  price: 8500000,
  address: "Bandra West, Mumbai",
  city: "Mumbai", 
  country: "India",
  image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
  facilities: {
    bedrooms: 3,
    bathrooms: 2,
    parkings: 1
  },
  ownerId: "demo-owner",
  ownerEmail: "demo@propertypro.com",
  createdAt: new Date(),
  updatedAt: new Date()
};

window.quickSeedProperties = async () => {
  try {
    console.log('Adding sample property...');
    
    // Add multiple properties
    for (let i = 1; i <= 3; i++) {
      const property = {
        ...sampleProperty,
        title: `${sampleProperty.title} ${i}`,
        price: sampleProperty.price + (i * 1000000)
      };
      
      const docRef = await addDoc(collection(db, 'properties'), property);
      console.log(`Added property ${i} with ID:`, docRef.id);
    }
    
    console.log('✅ Sample properties added! Refresh the page.');
    alert('Sample properties added successfully! Please refresh the page.');
    
  } catch (error) {
    console.error('Error adding properties:', error);
    alert('Error adding properties. Check console for details.');
  }
};

console.log('🚀 Quick seed function loaded! Run: window.quickSeedProperties()');
