import axios from "axios";
import { auth } from "../config/firebase";
import { toast } from "react-toastify";

// Firebase Functions API base URL 
// Replace with your actual Firebase Functions URL when deployed
const API_BASE_URL = "http://localhost:5001/propertypro-39565/us-central1/api";

// Create axios instance
export const firebaseApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
firebaseApi.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  }
  return config;
});

// Handle response errors
firebaseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Please log in to continue");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    return Promise.reject(error);
  }
);

// User API functions
export const createUser = async (email, name, role) => {
  try {
    const response = await firebaseApi.post("/user/register", {
      email,
      name,
      role
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to create user profile");
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await firebaseApi.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Property API functions
export const getAllProperties = async () => {
  try {
    const response = await firebaseApi.get("/property/all");
    return response.data;
  } catch (error) {
    toast.error("Failed to load properties");
    throw error;
  }
};

export const getProperty = async (propertyId) => {
  try {
    const response = await firebaseApi.get(`/property/${propertyId}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to load property details");
    throw error;
  }
};

export const createProperty = async (propertyData) => {
  try {
    const response = await firebaseApi.post("/property/create", propertyData);
    toast.success("Property created successfully!");
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      toast.error("Only property owners can create listings");
    } else {
      toast.error("Failed to create property");
    }
    throw error;
  }
};

export const updateProperty = async (propertyId, updates) => {
  try {
    const response = await firebaseApi.put(`/property/${propertyId}`, updates);
    toast.success("Property updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to update property");
    throw error;
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    const response = await firebaseApi.delete(`/property/${propertyId}`);
    toast.success("Property deleted successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete property");
    throw error;
  }
};

export const getMyProperties = async () => {
  try {
    const response = await firebaseApi.get("/property/owner/my-properties");
    return response.data;
  } catch (error) {
    toast.error("Failed to load your properties");
    throw error;
  }
};

// Booking API functions
export const bookVisit = async (propertyId, date) => {
  try {
    const response = await firebaseApi.post(`/user/bookVisit/${propertyId}`, {
      date
    });
    toast.success("Visit booked successfully! Check your email for confirmation.");
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Failed to book visit");
    }
    throw error;
  }
};

export const getUserBookings = async () => {
  try {
    const response = await firebaseApi.get("/user/bookings");
    return response.data.bookings;
  } catch (error) {
    toast.error("Failed to load bookings");
    throw error;
  }
};

export const cancelBooking = async (propertyId) => {
  try {
    const response = await firebaseApi.delete(`/user/booking/${propertyId}`);
    toast.success("Booking cancelled successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to cancel booking");
    throw error;
  }
};

export const getOwnerBookings = async () => {
  try {
    const response = await firebaseApi.get("/property/owner/bookings");
    return response.data;
  } catch (error) {
    toast.error("Failed to load booking requests");
    throw error;
  }
};

// Favorites API functions
export const toggleFavorite = async (propertyId) => {
  try {
    const response = await firebaseApi.post(`/user/favorite/${propertyId}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to update favorites");
    throw error;
  }
};

export const getUserFavorites = async () => {
  try {
    const response = await firebaseApi.get("/user/favorites");
    return response.data.favorites;
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};
