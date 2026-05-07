const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Hotel = require('../models/Hotel');
const Flight = require('../models/Flight');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('flight', 'flightNumber')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings
router.get('/bookings', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name city')
      .populate('flight', 'flightNumber airline')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put('/bookings/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all hotels
router.get('/hotels', auth, adminAuth, async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all flights
router.get('/flights', auth, adminAuth, async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;