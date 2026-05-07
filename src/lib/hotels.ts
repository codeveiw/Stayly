import { api } from "./api";

export type AmenityKey = "wifi" | "pool" | "breakfast" | "parking" | "gym" | "spa" | "bar" | "ac";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  price?: number; // Will be calculated from rooms
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  amenities: AmenityKey[];
  description: string;
  featured?: boolean;
  deal?: boolean;
  address: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  amenities: string[];
  images: string[];
  description: string;
  available: boolean;
}

export interface HotelWithRooms {
  hotel: Hotel;
  rooms: Room[];
  reviews: any[];
}

export async function getHotels(params?: {
  q?: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}): Promise<Hotel[]> {
  // Mock data for now
  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      city: 'New York',
      country: 'USA',
      price: 299,
      rating: 4.5,
      reviewsCount: 1250,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
      description: 'Luxury hotel in the heart of the city with world-class amenities.',
      featured: true,
      address: '123 Main St, New York, NY 10001'
    },
    {
      id: '2',
      name: 'Seaside Resort',
      city: 'Miami',
      country: 'USA',
      price: 249,
      rating: 4.7,
      reviewsCount: 890,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
      amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
      description: 'Beautiful beachfront resort with stunning ocean views.',
      featured: true,
      address: '456 Ocean Blvd, Miami, FL 33101'
    },
    {
      id: '3',
      name: 'Mountain Lodge',
      city: 'Denver',
      country: 'USA',
      price: 199,
      rating: 4.3,
      reviewsCount: 567,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa'],
      description: 'Cozy mountain retreat perfect for nature lovers.',
      featured: false,
      address: '789 Mountain Rd, Denver, CO 80201'
    }
  ];

  // Filter by search query
  let filteredHotels = mockHotels;
  if (params?.q) {
    const query = params.q.toLowerCase().trim();
    filteredHotels = mockHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(query) ||
      hotel.city.toLowerCase().includes(query) ||
      hotel.country.toLowerCase().includes(query)
    );
  }

  return filteredHotels;
}

export async function getHotelById(id: string): Promise<HotelWithRooms | null> {
  // Mock data for now
  const mockHotel: Hotel = {
    id: '1',
    name: 'Grand Plaza Hotel',
    city: 'New York',
    country: 'USA',
    rating: 4.5,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
    description: 'Luxury hotel in the heart of the city with world-class amenities.',
    featured: true,
    address: '123 Main St, New York, NY 10001'
  };

  const mockRooms: Room[] = [
    {
      id: '1',
      name: 'Deluxe King Room',
      type: 'deluxe',
      price: 299,
      capacity: 2,
      amenities: ['wifi', 'ac', 'tv'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'],
      description: 'Spacious room with king bed and city views.',
      available: true
    },
    {
      id: '2',
      name: 'Standard Double Room',
      type: 'double',
      price: 199,
      capacity: 2,
      amenities: ['wifi', 'ac'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'],
      description: 'Comfortable room with two double beds.',
      available: true
    }
  ];

  return {
    hotel: mockHotel,
    rooms: mockRooms,
    reviews: []
  };
}

 export const hotels: Hotel[] = [
   {
     id: '1',
     name: 'Grand Plaza Hotel',
     city: 'New York',
     country: 'USA',
     price: 299,
     rating: 4.5,
     reviewsCount: 1250,
     image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
     images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
     amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
     description: 'Luxury hotel in the heart of the city with world-class amenities.',
     featured: true,
     deal: true,
     address: '123 Main St, New York, NY 10001'
   },
   {
     id: '2',
     name: 'Seaside Resort',
     city: 'Miami',
     country: 'USA',
     price: 249,
     rating: 4.7,
     reviewsCount: 890,
     image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
     images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
     amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
     description: 'Beautiful beachfront resort with stunning ocean views.',
     featured: true,
     deal: false,
     address: '456 Ocean Blvd, Miami, FL 33101'
   },
   {
     id: '3',
     name: 'Mountain Lodge',
     city: 'Denver',
     country: 'USA',
     price: 199,
     rating: 4.3,
     reviewsCount: 567,
     image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
     images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
     amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa'],
     description: 'Cozy mountain retreat perfect for nature lovers.',
     featured: false,
     deal: true,
     address: '789 Mountain Rd, Denver, CO 80201'
   }
 ];
 
 export interface Destination {

  id: string;
  name: string;
  country: string;
  img: () => Promise<{ default: string }>;
}

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Paris",
    country: "France",
    img: () => import("@/assets/dest-paris.jpg"),
  },
  {
    id: "2",
    name: "Tokyo",
    country: "Japan",
    img: () => import("@/assets/dest-tokyo.jpg"),
  },
  {
    id: "3",
    name: "Santorini",
    country: "Greece",
    img: () => import("@/assets/dest-santorini.jpg"),
  },
  {
    id: "4",
    name: "Dubai",
    country: "UAE",
    img: () => import("@/assets/dest-dubai.jpg"),
  },
];