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

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    city: 'New York',
    country: 'USA',
    price: 299,
    rating: 4.5,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1542314831-c6a4d140e606?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
    description: 'Luxury hotel in the heart of the city with world-class amenities and breathtaking views.',
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
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
    description: 'Beautiful beachfront resort with stunning ocean views and private beach access.',
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
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa'],
    description: 'Cozy mountain retreat perfect for nature lovers and ski enthusiasts.',
    featured: false,
    deal: true,
    address: '789 Mountain Rd, Denver, CO 80201'
  },
  {
    id: '5',
    name: 'Le Meurice',
    city: 'Paris',
    country: 'France',
    price: 450,
    rating: 4.9,
    reviewsCount: 2310,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', 'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800'],
    amenities: ['wifi', 'breakfast', 'ac', 'bar', 'spa'],
    description: 'Classic luxury and elegant decor near the Louvre Museum.',
    featured: true,
    deal: false,
    address: '228 Rue de Rivoli, 75001 Paris, France'
  },
  {
    id: '6',
    name: 'Burj Al Arab',
    city: 'Dubai',
    country: 'UAE',
    price: 900,
    rating: 5.0,
    reviewsCount: 3412,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1582653291997-079a1c04e5d1?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'ac', 'spa', 'gym', 'bar'],
    description: 'The epitome of luxury with its sail-shaped silhouette.',
    featured: true,
    deal: false,
    address: 'Jumeirah St, Umm Suqeim 3, Dubai, UAE'
  },
  {
    id: '7',
    name: 'Aman Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    price: 650,
    rating: 4.8,
    reviewsCount: 1540,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', 'https://images.unsplash.com/photo-1522064115163-95d6f83eb9e0?w=800', 'https://images.unsplash.com/photo-1542051812871-7488f414d1fa?w=800'],
    amenities: ['wifi', 'spa', 'gym', 'bar', 'ac', 'breakfast'],
    description: 'An urban sanctuary in the heart of Tokyo boasting panoramic city views.',
    featured: true,
    deal: true,
    address: 'The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo'
  },
  {
    id: '8',
    name: 'Katikies Santorini',
    city: 'Santorini',
    country: 'Greece',
    price: 320,
    rating: 4.9,
    reviewsCount: 2901,
    image: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800',
    images: ['https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800', 'https://images.unsplash.com/photo-1533104816-cdd2da82b8d0?w=800', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'bar'],
    description: 'Whitewashed luxury boutique hotel overlooking the Aegean Sea.',
    featured: true,
    deal: true,
    address: 'Main Street, Oia 847 02, Greece'
  },
  {
    id: '9',
    name: 'Marriott Mena House',
    city: 'Cairo',
    country: 'Egypt',
    price: 350,
    rating: 4.8,
    reviewsCount: 2150,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'ac', 'bar'],
    description: 'Breathtaking views of the Pyramids from a luxurious, historic hotel.',
    featured: true,
    deal: false,
    address: '6 Pyramids Road, Giza, Cairo'
  },
  {
    id: '10',
    name: 'Four Seasons Resort',
    city: 'Sharm El Sheikh',
    country: 'Egypt',
    price: 450,
    rating: 4.9,
    reviewsCount: 1890,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    images: ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', 'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800'],
    amenities: ['wifi', 'pool', 'breakfast', 'spa', 'ac', 'bar', 'gym'],
    description: 'A world-class beachfront resort offering incredible diving experiences at the Red Sea.',
    featured: true,
    deal: true,
    address: '1 Four Seasons Boulevard, Sharm El Sheikh'
  },
  {
    id: '11',
    name: 'Hotel Danieli',
    city: 'Venice',
    country: 'Italy',
    price: 550,
    rating: 4.7,
    reviewsCount: 1450,
    image: 'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800',
    images: ['https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?w=800', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'],
    amenities: ['wifi', 'breakfast', 'ac', 'bar'],
    description: 'Historic luxury hotel located steps away from St Mark\'s Square.',
    featured: true,
    deal: false,
    address: 'Riva degli Schiavoni, Venice'
  },
  {
    id: '12',
    name: 'Rome Cavalieri',
    city: 'Rome',
    country: 'Italy',
    price: 480,
    rating: 4.8,
    reviewsCount: 2200,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'ac', 'gym', 'bar'],
    description: 'A Waldorf Astoria resort offering panoramic views of Rome.',
    featured: false,
    deal: true,
    address: 'Via Alberto Cadlolo, Rome'
  },
  {
    id: '13',
    name: 'Ciragan Palace Kempinski',
    city: 'Istanbul',
    country: 'Turkey',
    price: 600,
    rating: 4.9,
    reviewsCount: 3100,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1582653291997-079a1c04e5d1?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'ac', 'gym', 'bar'],
    description: 'An Ottoman imperial palace and hotel on the Bosphorus.',
    featured: true,
    deal: false,
    address: 'Ciragan Caddesi, Besiktas, Istanbul'
  },
  {
    id: '14',
    name: 'Museum Hotel',
    city: 'Cappadocia',
    country: 'Turkey',
    price: 380,
    rating: 4.8,
    reviewsCount: 1650,
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5d1?w=800',
    images: ['https://images.unsplash.com/photo-1582653291997-079a1c04e5d1?w=800', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800'],
    amenities: ['wifi', 'breakfast', 'pool', 'spa'],
    description: 'Unique luxury cave hotel experience with hot air balloon views.',
    featured: true,
    deal: true,
    address: 'Tekeli Mah, Uchisar, Cappadocia'
  },
  {
    id: '15',
    name: 'Soneva Fushi',
    city: 'Baa Atoll',
    country: 'Maldives',
    price: 1200,
    rating: 5.0,
    reviewsCount: 950,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', 'https://images.unsplash.com/photo-1522064115163-95d6f83eb9e0?w=800'],
    amenities: ['wifi', 'spa', 'pool', 'breakfast', 'bar'],
    description: 'Award-winning luxury barefoot desert island resort.',
    featured: true,
    deal: false,
    address: 'Kunfunadhoo Island, Baa Atoll'
  },
  {
    id: '16',
    name: 'Gili Lankanfushi',
    city: 'North Male Atoll',
    country: 'Maldives',
    price: 1100,
    rating: 4.9,
    reviewsCount: 880,
    image: 'https://images.unsplash.com/photo-1522064115163-95d6f83eb9e0?w=800',
    images: ['https://images.unsplash.com/photo-1522064115163-95d6f83eb9e0?w=800', 'https://images.unsplash.com/photo-1542051812871-7488f414d1fa?w=800'],
    amenities: ['wifi', 'spa', 'breakfast', 'ac', 'bar'],
    description: 'Eco-friendly water villas with ultimate privacy.',
    featured: false,
    deal: true,
    address: 'Lankanfushi Island, North Male Atoll'
  },
  {
    id: '17',
    name: 'W Barcelona',
    city: 'Barcelona',
    country: 'Spain',
    price: 420,
    rating: 4.6,
    reviewsCount: 2750,
    image: 'https://images.unsplash.com/photo-1542051812871-7488f414d1fa?w=800',
    images: ['https://images.unsplash.com/photo-1542051812871-7488f414d1fa?w=800', 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800'],
    amenities: ['wifi', 'pool', 'gym', 'spa', 'bar', 'ac'],
    description: 'Striking sail-like hotel with panoramic views of the Mediterranean.',
    featured: true,
    deal: false,
    address: 'Placa Rosa dels Vents 1, Barcelona'
  },
  {
    id: '18',
    name: 'Hotel Ritz',
    city: 'Madrid',
    country: 'Spain',
    price: 390,
    rating: 4.8,
    reviewsCount: 1980,
    image: 'https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800',
    images: ['https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?w=800', 'https://images.unsplash.com/photo-1533104816-cdd2da82b8d0?w=800'],
    amenities: ['wifi', 'breakfast', 'gym', 'spa', 'bar', 'ac'],
    description: 'A Belle Époque palace in the Golden Triangle of Art.',
    featured: false,
    deal: true,
    address: 'Plaza de la Lealtad 5, Madrid'
  },
  {
    id: '19',
    name: 'Mandarin Oriental',
    city: 'Bangkok',
    country: 'Thailand',
    price: 460,
    rating: 4.9,
    reviewsCount: 3200,
    image: 'https://images.unsplash.com/photo-1533104816-cdd2da82b8d0?w=800',
    images: ['https://images.unsplash.com/photo-1533104816-cdd2da82b8d0?w=800', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'breakfast', 'bar'],
    description: 'Legendary luxury hotel on the banks of the Chao Phraya River.',
    featured: true,
    deal: false,
    address: '48 Oriental Avenue, Bangkok'
  },
  {
    id: '20',
    name: 'Keemala',
    city: 'Phuket',
    country: 'Thailand',
    price: 350,
    rating: 4.8,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800',
    images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'breakfast', 'ac'],
    description: 'All-pool villa wonderland set in the rainforest of Kamala.',
    featured: false,
    deal: true,
    address: '10/88 Nakasud Rd, Kamala, Phuket'
  },
  {
    id: '21',
    name: 'The Ritz',
    city: 'London',
    country: 'UK',
    price: 550,
    rating: 4.7,
    reviewsCount: 2800,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
    amenities: ['wifi', 'breakfast', 'gym', 'bar', 'ac'],
    description: 'Iconic luxury hotel in Piccadilly with world-famous afternoon tea.',
    featured: true,
    deal: false,
    address: '150 Piccadilly, St. James, London'
  },
  {
    id: '22',
    name: 'The Savoy',
    city: 'London',
    country: 'UK',
    price: 600,
    rating: 4.8,
    reviewsCount: 2500,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 'https://images.unsplash.com/photo-1542314831-c6a4d140e606?w=800'],
    amenities: ['wifi', 'pool', 'gym', 'spa', 'bar', 'ac'],
    description: 'Famous luxury hotel perfectly placed on the River Thames.',
    featured: false,
    deal: true,
    address: 'Strand, London'
  },
  {
    id: '23',
    name: 'Atlantis The Palm',
    city: 'Dubai',
    country: 'UAE',
    price: 700,
    rating: 4.7,
    reviewsCount: 4500,
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d140e606?w=800',
    images: ['https://images.unsplash.com/photo-1542314831-c6a4d140e606?w=800', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'bar', 'breakfast'],
    description: 'Ocean-themed resort featuring a massive waterpark and aquarium.',
    featured: true,
    deal: true,
    address: 'Crescent Rd, The Palm Jumeirah, Dubai'
  },
  {
    id: '24',
    name: 'Hôtel Plaza Athénée',
    city: 'Paris',
    country: 'France',
    price: 580,
    rating: 4.9,
    reviewsCount: 1800,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'],
    amenities: ['wifi', 'spa', 'gym', 'bar', 'breakfast', 'ac'],
    description: 'The Haute Couture address of Paris with Eiffel Tower views.',
    featured: true,
    deal: false,
    address: '25 Avenue Montaigne, 75008 Paris'
  },
  {
    id: '25',
    name: 'Park Hyatt',
    city: 'Tokyo',
    country: 'Japan',
    price: 520,
    rating: 4.8,
    reviewsCount: 2100,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
    images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'bar', 'ac'],
    description: 'Iconic luxury hotel featured in Lost in Translation.',
    featured: false,
    deal: true,
    address: '3-7-1-2 Nishi-Shinjuku, Tokyo'
  },
  {
    id: '26',
    name: 'Cavo Tagoo',
    city: 'Mykonos',
    country: 'Greece',
    price: 450,
    rating: 4.8,
    reviewsCount: 1750,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    amenities: ['wifi', 'pool', 'spa', 'bar', 'breakfast', 'ac'],
    description: 'Chic hotel offering infinity pools and breathtaking sunset views.',
    featured: true,
    deal: false,
    address: 'Tagoo, Mykonos 846 00, Greece'
  }
];

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
  const foundHotel = mockHotels.find(h => h.id === id);

  const hotelToReturn = foundHotel || {
    id,
    name: `Dynamic Hotel ${id}`,
    city: 'Unknown Location',
    country: 'World',
    price: 120 + Number(id) * 10,
    rating: 4.0 + (Number(id) % 10) / 10,
    reviewsCount: 100 * (Number(id) % 5 + 1),
    image: 'https://images.unsplash.com/photo-1551882547-ff40c0d127dd?w=800',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c0d127dd?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    amenities: ['wifi', 'ac'],
    description: 'A beautiful generated hotel tailored dynamically for this view.',
    featured: false,
    address: '123 Unknown Street'
  } as Hotel;

  const mockRooms: Room[] = [
    {
      id: '1',
      name: 'Deluxe King Room',
      type: 'deluxe',
      price: hotelToReturn.price || 199,
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
      price: Math.floor((hotelToReturn.price || 199) * 0.7),
      capacity: 2,
      amenities: ['wifi', 'ac'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'],
      description: 'Comfortable room with two double beds.',
      available: true
    }
  ];

  return {
    hotel: hotelToReturn,
    rooms: mockRooms,
    reviews: []
  };
}

export const hotels = mockHotels;

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