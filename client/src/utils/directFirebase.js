// Direct Firebase operations (bypassing Functions for testing)
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';

// Property operations
export const addPropertyDirect = async (propertyData, userId, userEmail) => {
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...propertyData,
      ownerId: userId,
      ownerEmail: userEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Property added successfully
    toast.success('Property added successfully!');
    return docRef.id;
  } catch (error) {
    console.error('Error adding property: ', error);
    toast.error('Failed to add property');
    throw error;
  }
};

export const getPropertiesDirect = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    return properties;
  } catch (error) {
    console.error('Error getting properties:', error);
    toast.error('Failed to load properties.');
    throw error;
  }
};

export const getPropertyDirect = async (propertyId) => {
  try {
    const docRef = doc(db, 'properties', propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // Property not found
      return null;
    }
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

export const updatePropertyDirect = async (propertyId, updateData) => {
  try {
    const docRef = doc(db, 'properties', propertyId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    
    console.log('Property updated successfully');
    toast.success('Property updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    toast.error('Failed to update property');
    throw error;
  }
};

export const deletePropertyDirect = async (propertyId) => {
  try {
    await deleteDoc(doc(db, 'properties', propertyId));
    console.log('Property deleted successfully');
    toast.success('Property deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    toast.error('Failed to delete property');
    throw error;
  }
};

// User operations
export const createUserProfileDirect = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, userData);
      console.log('User profile created successfully');
      return true;
    } else {
      console.log('User profile already exists');
      return false;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Booking operations
export const addBookingDirect = async (userId, bookingData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentBookings = userData.bookings || [];
      
      // Check if already booked
      if (currentBookings.some(b => b.propertyId === bookingData.propertyId)) {
        toast.error('You have already booked this property');
        return false;
      }
      
      // Add the new booking
      const newBooking = {
        ...bookingData,
        id: `booking_${Date.now()}`,
        createdAt: new Date()
      };
      
      const updatedBookings = [...currentBookings, newBooking];
      
      await updateDoc(userRef, { bookings: updatedBookings });
      toast.success('Visit booked successfully!');
      return true;
    } else {
      console.error('User not found');
      toast.error('User not found');
      return false;
    }
  } catch (error) {
    console.error('Error adding booking:', error);
    toast.error('Failed to book visit');
    return false;
  }
};

export const getUserBookings = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return [];
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.bookings || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return [];
  }
};

// Favorites operations
export const toggleFavoriteDirect = async (userId, propertyId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      let updatedFavorites;
      let message;
      
      if (favorites.includes(propertyId)) {
        updatedFavorites = favorites.filter(id => id !== propertyId);
        message = 'Removed from favorites';
      } else {
        updatedFavorites = [...favorites, propertyId];
        message = 'Added to favorites';
      }
      
      await updateDoc(userRef, { favorites: updatedFavorites });
      toast.success(message);
      return updatedFavorites;
    }
  } catch (error) {
    console.error('Error updating favorites:', error);
    toast.error('Failed to update favorites');
    return [];
  }
};

export const getUserFavorites = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      return [];
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.favorites || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting user favorites:', error);
    return [];
  }
};

// Get all bookings for owner's properties
export const getOwnerBookings = async (ownerId) => {
  try {
    // Get all users to find bookings
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const allBookings = [];
    
    // Get owner's properties first
    const properties = await getPropertiesDirect();
    const ownerProperties = properties.filter(prop => prop.ownerId === ownerId);
    const ownerPropertyIds = ownerProperties.map(prop => prop.id);
    
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.bookings && userData.bookings.length > 0) {
        userData.bookings.forEach(booking => {
          // Only include bookings for this owner's properties
          if (ownerPropertyIds.includes(booking.propertyId)) {
            allBookings.push({
              ...booking,
              userId: userDoc.id,
              userEmail: userData.email,
              userName: userData.name || userData.email
            });
          }
        });
      }
    });
    
    // Sort by creation date (newest first)
    return allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting owner bookings:', error);
    return [];
  }
};

// Update booking status (for owners)
export const updateBookingStatus = async (userId, bookingId, newStatus) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const bookings = userData.bookings || [];
      
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date() }
          : booking
      );
      
      await updateDoc(userRef, { bookings: updatedBookings });
      toast.success(`Booking ${newStatus} successfully!`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating booking status:', error);
    toast.error('Failed to update booking status');
    return false;
  }
};

// Helper functions
export const getPropertyByIdDirect = async (propertyId) => {
  try {
    const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
    
    if (propertyDoc.exists()) {
      return { id: propertyDoc.id, ...propertyDoc.data() };
    } else {
      console.error('Property not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting property:', error);
    return null;
  }
};