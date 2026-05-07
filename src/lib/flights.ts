import { api } from "./api";

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    city: string;
    country: string;
    time: string;
  };
  arrival: {
    airport: string;
    city: string;
    country: string;
    time: string;
  };
  duration: number;
  price: number;
  class: string;
  availableSeats: number;
  totalSeats: number;
  status: string;
  aircraft?: string;
}

export interface FlightWithReviews {
  flight: Flight;
  reviews: any[];
}

export async function searchFlights(params: {
  departure?: string;
  destination?: string;
  date?: string;
  returnDate?: string;
  passengers?: number;
  class?: string;
}): Promise<Flight[]> {
  // Mock data for now
  const mockFlights: Flight[] = [
    {
      id: '1',
      flightNumber: 'AA101',
      airline: 'American Airlines',
      departure: {
        airport: 'JFK',
        city: 'New York',
        country: 'USA',
        time: '2024-12-01T08:00:00Z'
      },
      arrival: {
        airport: 'LAX',
        city: 'Los Angeles',
        country: 'USA',
        time: '2024-12-01T11:30:00Z'
      },
      duration: 330,
      price: 299,
      class: 'economy',
      availableSeats: 150,
      totalSeats: 180,
      status: 'scheduled',
      aircraft: 'Boeing 737'
    },
    {
      id: '2',
      flightNumber: 'UA202',
      airline: 'United Airlines',
      departure: {
        airport: 'ORD',
        city: 'Chicago',
        country: 'USA',
        time: '2024-12-01T14:00:00Z'
      },
      arrival: {
        airport: 'SFO',
        city: 'San Francisco',
        country: 'USA',
        time: '2024-12-01T16:45:00Z'
      },
      duration: 285,
      price: 249,
      class: 'economy',
      availableSeats: 120,
      totalSeats: 150,
      status: 'scheduled',
      aircraft: 'Boeing 777'
    }
  ];

  return mockFlights;
}

export async function getFlightById(id: string): Promise<FlightWithReviews | null> {
  // Mock data for now
  const mockFlight: Flight = {
    id: '1',
    flightNumber: 'AA101',
    airline: 'American Airlines',
    departure: {
      airport: 'JFK',
      city: 'New York',
      country: 'USA',
      time: '2024-12-01T08:00:00Z'
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      country: 'USA',
      time: '2024-12-01T11:30:00Z'
    },
    duration: 330,
    price: 299,
    class: 'economy',
    availableSeats: 150,
    totalSeats: 180,
    status: 'scheduled',
    aircraft: 'Boeing 737'
  };

  return {
    flight: mockFlight,
    reviews: []
  };
}