const express = require('express');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Flight = require('../models/Flight');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name city country images')
      .populate('room', 'name type price')
      .populate('flight', 'flightNumber airline departure arrival price')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hotel booking
router.post('/hotel', auth, async (req, res) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check room availability
    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ message: 'Room not available' });
    }

    // Calculate total price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    const booking = new Booking({
      user: req.user._id,
      type: 'hotel',
      hotel: hotelId,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      specialRequests
    });

    await booking.save();
    await booking.populate(['hotel', 'room']);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create flight booking
router.post('/flight', auth, async (req, res) => {
  try {
    const { flightId, passengers } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight || flight.availableSeats < passengers.length) {
      return res.status(400).json({ message: 'Flight not available or insufficient seats' });
    }

    const totalPrice = flight.price * passengers.length;

    const booking = new Booking({
      user: req.user._id,
      type: 'flight',
      flight: flightId,
      passengers,
      totalPrice
    });

    await booking.save();
    await booking.populate('flight');

    // Update available seats
    flight.availableSeats -= passengers.length;
    await flight.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('hotel', 'name city country images')
      .populate('room', 'name type price amenities')
      .populate('flight', 'flightNumber airline departure arrival price class')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Return seats for flight bookings
    if (booking.type === 'flight' && booking.flight) {
      const flight = await Flight.findById(booking.flight);
      if (flight) {
        flight.availableSeats += booking.passengers.length;
        await flight.save();
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;