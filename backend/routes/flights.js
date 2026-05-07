const express = require('express');
const Flight = require('../models/Flight');
const Review = require('../models/Review');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Search flights
router.get('/search', async (req, res) => {
  try {
    const { departure, destination, date, returnDate, passengers = 1, class: flightClass = 'economy' } = req.query;
    
    let query = { availableSeats: { $gte: parseInt(passengers) } };
    
    if (departure) {
      query['departure.city'] = new RegExp(departure, 'i');
    }
    if (destination) {
      query['arrival.city'] = new RegExp(destination, 'i');
    }
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query['departure.time'] = { $gte: searchDate, $lt: nextDay };
    }

    const flights = await Flight.find(query)
      .sort({ 'departure.time': 1, price: 1 });

    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all flights (admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const flights = await Flight.find().sort({ 'departure.time': 1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const reviews = await Review.find({ flight: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      flight,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create flight (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update flight (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete flight (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json({ message: 'Flight deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;