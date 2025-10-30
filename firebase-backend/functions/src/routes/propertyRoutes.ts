import { Router } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { Property, CreatePropertyRequest } from "../models/Property";

const router = Router();
const db = getFirestore();

// Middleware to verify Firebase token
const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is property owner
const verifyOwner = async (req: any, res: any, next: any) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userData = userDoc.data();
    if (userData?.role !== "owner") {
      return res.status(403).json({ message: "Access denied. Owner role required." });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all properties (public)
router.get("/all", async (req: any, res: any) => {
  try {
    const propertiesSnapshot = await db.collection("properties")
      .orderBy("createdAt", "desc")
      .get();

    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(properties);
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single property by ID (public)
router.get("/:propertyId", async (req: any, res: any) => {
  try {
    const { propertyId } = req.params;
    const propertyDoc = await db.collection("properties").doc(propertyId).get();

    if (!propertyDoc.exists) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      id: propertyDoc.id,
      ...propertyDoc.data()
    });
  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new property (owner only)
router.post("/create", verifyToken, verifyOwner, async (req: any, res: any) => {
  try {
    const propertyData: CreatePropertyRequest = req.body;
    const uid = req.user.uid;
    const email = req.user.email;

    // Validate required fields
    const requiredFields = ["title", "description", "price", "address", "city", "country"];
    for (const field of requiredFields) {
      if (!propertyData[field as keyof CreatePropertyRequest]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    const property: Omit<Property, "id"> = {
      ...propertyData,
      ownerId: uid,
      ownerEmail: email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection("properties").add(property);

    res.status(201).json({
      message: "Property created successfully",
      property: {
        id: docRef.id,
        ...property
      }
    });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update property (owner only, must own the property)
router.put("/:propertyId", verifyToken, verifyOwner, async (req: any, res: any) => {
  try {
    const { propertyId } = req.params;
    const updates = req.body;
    const uid = req.user.uid;

    // Get current property
    const propertyDoc = await db.collection("properties").doc(propertyId).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({ message: "Property not found" });
    }

    const propertyData = propertyDoc.data() as Property;
    
    // Check if user owns this property
    if (propertyData.ownerId !== uid) {
      return res.status(403).json({ message: "Access denied. You don't own this property." });
    }

    // Update property
    const updatedData = {
      ...updates,
      updatedAt: new Date()
    };

    await db.collection("properties").doc(propertyId).update(updatedData);

    res.json({ 
      message: "Property updated successfully",
      property: {
        id: propertyId,
        ...propertyData,
        ...updatedData
      }
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete property (owner only, must own the property)
router.delete("/:propertyId", verifyToken, verifyOwner, async (req: any, res: any) => {
  try {
    const { propertyId } = req.params;
    const uid = req.user.uid;

    // Get current property
    const propertyDoc = await db.collection("properties").doc(propertyId).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({ message: "Property not found" });
    }

    const propertyData = propertyDoc.data() as Property;
    
    // Check if user owns this property
    if (propertyData.ownerId !== uid) {
      return res.status(403).json({ message: "Access denied. You don't own this property." });
    }

    await db.collection("properties").doc(propertyId).delete();

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get properties owned by current user (owner only)
router.get("/owner/my-properties", verifyToken, verifyOwner, async (req: any, res: any) => {
  try {
    const uid = req.user.uid;

    const propertiesSnapshot = await db.collection("properties")
      .where("ownerId", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(properties);
  } catch (error) {
    console.error("Error getting owner properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get bookings for owner's properties (owner only)
router.get("/owner/bookings", verifyToken, verifyOwner, async (req: any, res: any) => {
  try {
    const uid = req.user.uid;

    // Get all properties owned by user
    const propertiesSnapshot = await db.collection("properties")
      .where("ownerId", "==", uid)
      .get();

    const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);

    if (propertyIds.length === 0) {
      return res.json([]);
    }

    // Get all users and filter their bookings for these properties
    const usersSnapshot = await db.collection("users").get();
    const allBookings: any[] = [];

    usersSnapshot.docs.forEach(userDoc => {
      const userData = userDoc.data();
      if (userData.bookings) {
        userData.bookings.forEach((booking: any) => {
          if (propertyIds.includes(booking.propertyId)) {
            allBookings.push({
              ...booking,
              userEmail: userData.email,
              userName: userData.name
            });
          }
        });
      }
    });

    res.json(allBookings);
  } catch (error) {
    console.error("Error getting owner bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

