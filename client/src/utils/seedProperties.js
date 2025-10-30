import { addPropertyDirect } from './directFirebase';

const sampleProperties = [
  {
    title: "Luxury Apartment in Andheri West",
    description: "Premium 3BHK apartment in the heart of Andheri West with modern amenities. Close to metro station, shopping malls, and IT parks. Perfect for families and working professionals. Features include modular kitchen, spacious balconies with city views, and 24/7 security.",
    price: 8500000,
    address: "Lokhandwala Complex, Andheri West",
    city: "Mumbai",
    country: "India",
    image: "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    facilities: { 
      bathrooms: 2, 
      parkings: 1, 
      bedrooms: 3 
    }
  },
  {
    title: "Sea View Villa in Bandra",
    description: "Stunning 4BHK villa with panoramic sea views in prime Bandra location. Features include private garden, swimming pool, and terrace with Arabian Sea views. Walking distance to Bandra-Worli Sea Link and premium restaurants. Perfect for luxury living in Mumbai's most sought-after neighborhood.",
    price: 25000000,
    address: "Hill Road, Bandra West",
    city: "Mumbai",
    country: "India",
    image: "https://3.bp.blogspot.com/-84l-BoUL090/VTDHcQzSTNI/AAAAAAAAuHI/Khftta_CF5E/s1920/wow-home-design.jpg",
    facilities: { 
      bathrooms: 4, 
      parkings: 2, 
      bedrooms: 4 
    }
  },
  {
    title: "Modern 2BHK in Andheri East",
    description: "Contemporary 2BHK apartment in Andheri East with excellent connectivity to Powai, BKC, and Western Express Highway. Features include modern amenities, gym, swimming pool, and children's play area. Close to metro station and IT companies like TCS, Infosys, and Wipro.",
    price: 5500000,
    address: "Chakala, Andheri East",
    city: "Mumbai",
    country: "India",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    facilities: { 
      bathrooms: 2, 
      parkings: 1, 
      bedrooms: 2 
    }
  },
  {
    title: "Spacious 3BHK in Powai",
    description: "Beautiful 3BHK apartment in Powai with lake views and modern amenities. Located in a premium gated community with clubhouse, gym, and landscaped gardens. Close to Hiranandani Gardens, IIT Bombay, and major IT companies. Excellent connectivity to Eastern and Western Express Highway.",
    price: 7500000,
    address: "Hiranandani Gardens, Powai",
    city: "Mumbai",
    country: "India",
    image: "https://e0.pxfuel.com/wallpapers/12/377/desktop-wallpaper-beautiful-houses-beautiful-mansion.jpg",
    facilities: { 
      bathrooms: 3, 
      parkings: 2, 
      bedrooms: 3 
    }
  },
  {
    title: "Penthouse in Worli",
    description: "Exclusive penthouse with 360-degree city and sea views. Premium location in South Mumbai with world-class amenities including infinity pool, sky lounge, and private elevator access. Walking distance to business districts and fine dining restaurants.",
    price: 45000000,
    address: "Worli Sea Face",
    city: "Mumbai",
    country: "India",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    facilities: { 
      bathrooms: 4, 
      parkings: 3, 
      bedrooms: 4 
    }
  },
  {
    title: "Cozy 1BHK in Thane",
    description: "Affordable 1BHK apartment in Thane with good connectivity to Mumbai. Perfect for young professionals and couples. Features include modern kitchen, balcony with garden view, and access to community amenities like gym and swimming pool.",
    price: 3500000,
    address: "Ghodbunder Road, Thane",
    city: "Thane",
    country: "India",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
    facilities: { 
      bathrooms: 1, 
      parkings: 1, 
      bedrooms: 1 
    }
  }
];

export const seedSampleProperties = async (userId, userEmail) => {
  try {
    console.log('Starting to seed sample properties...');
    
    for (const property of sampleProperties) {
      try {
        const propertyId = await addPropertyDirect(property, userId, userEmail);
        console.log(`Added property: ${property.title} with ID: ${propertyId}`);
      } catch (error) {
        console.error(`Failed to add property ${property.title}:`, error);
      }
    }
    
    console.log('Finished seeding sample properties!');
    return true;
  } catch (error) {
    console.error('Error seeding properties:', error);
    return false;
  }
};
