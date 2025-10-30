export interface Property {
  id?: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  image: string;
  facilities: {
    bedrooms?: number;
    bathrooms?: number;
    parking?: boolean;
    gym?: boolean;
    pool?: boolean;
    [key: string]: any;
  };
  ownerId: string;
  ownerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  image: string;
  facilities: object;
}

