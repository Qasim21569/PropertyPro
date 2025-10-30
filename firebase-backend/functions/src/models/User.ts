export interface User {
  uid: string;
  email: string;
  name?: string;
  role: "user" | "owner";
  createdAt: Date;
  bookings: Booking[];
  favorites: string[]; // Array of property IDs
}

export interface Booking {
  propertyId: string;
  propertyTitle: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

