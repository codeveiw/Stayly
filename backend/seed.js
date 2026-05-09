const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Flight = require('./models/Flight');
const User = require('./models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stay');

    // Clear existing data
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await Flight.deleteMany({});
    await User.deleteMany({}); // Clear users too

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@stayly.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created: admin@stayly.com / admin123');

    // Seed hotels
    const hotels = [
      {
        name: 'Grand Plaza Hotel',
        description: 'Luxury hotel in the heart of the city with world-class amenities.',
        city: 'New York',
        country: 'USA',
        address: '123 Main St, New York, NY 10001',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
        rating: 4.5,
        reviewsCount: 1250,
        featured: true,
      },
      {
        name: 'Seaside Resort',
        description: 'Beautiful beachfront resort with stunning ocean views.',
        city: 'Miami',
        country: 'USA',
        address: '456 Ocean Blvd, Miami, FL 33101',
        images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
        amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa', 'bar', 'ac'],
        rating: 4.7,
        reviewsCount: 890,
        featured: true,
      },
      {
        name: 'Mountain Lodge',
        description: 'Cozy mountain retreat perfect for nature lovers.',
        city: 'Denver',
        country: 'USA',
        address: '789 Mountain Rd, Denver, CO 80201',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
        amenities: ['wifi', 'pool', 'breakfast', 'parking', 'gym', 'spa'],
        rating: 4.3,
        reviewsCount: 567,
        featured: false,
      }
    ];

    const createdHotels = await Hotel.insertMany(hotels);

    // Seed rooms for each hotel
    for (const hotel of createdHotels) {
      const rooms = [
        {
          hotel: hotel._id,
          name: 'Deluxe King Room',
          type: 'deluxe',
          price: 299,
          capacity: 2,
          amenities: ['wifi', 'ac', 'tv'],
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'],
          description: 'Spacious room with king bed and city views.'
        },
        {
          hotel: hotel._id,
          name: 'Standard Double Room',
          type: 'double',
          price: 199,
          capacity: 2,
          amenities: ['wifi', 'ac'],
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'],
          description: 'Comfortable room with two double beds.'
        },
        {
          hotel: hotel._id,
          name: 'Suite',
          type: 'suite',
          price: 499,
          capacity: 4,
          amenities: ['wifi', 'ac', 'tv', 'minibar'],
          images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'],
          description: 'Luxurious suite with separate living area.'
        }
      ];
      await Room.insertMany(rooms);
    }

    // Seed flights
    const flights = [
      {
        flightNumber: 'AA101',
        airline: 'American Airlines',
        departure: {
          airport: 'JFK',
          city: 'New York',
          country: 'USA',
          time: new Date('2024-12-01T08:00:00Z')
        },
        arrival: {
          airport: 'LAX',
          city: 'Los Angeles',
          country: 'USA',
          time: new Date('2024-12-01T11:30:00Z')
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
        flightNumber: 'UA202',
        airline: 'United Airlines',
        departure: {
          airport: 'ORD',
          city: 'Chicago',
          country: 'USA',
          time: new Date('2024-12-01T14:00:00Z')
        },
        arrival: {
          airport: 'SFO',
          city: 'San Francisco',
          country: 'USA',
          time: new Date('2024-12-01T16:45:00Z')
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

    await Flight.insertMany(flights);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();