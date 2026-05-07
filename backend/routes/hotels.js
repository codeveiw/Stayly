const express = require('express');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Review = require('../models/Review');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all hotels with filters
router.get('/', async (req, res) => {
  try {
    const { city, country, minPrice, maxPrice, rating, amenities, featured, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (city) query.city = new RegExp(city, 'i');
    if (country) query.country = new RegExp(country, 'i');
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (featured === 'true') query.featured = true;
    if (amenities) {
      const amenityArray = amenities.split(',');
      query.amenities = { $in: amenityArray };
    }

    const hotels = await Hotel.find(query)
      .sort({ featured: -1, rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    // Get rooms for price filtering
    if (minPrice || maxPrice) {
      const filteredHotels = [];
      for (const hotel of hotels) {
        const rooms = await Room.find({ hotel: hotel._id, available: true });
        const hasMatchingRoom = rooms.some(room => {
          if (minPrice && room.price < parseFloat(minPrice)) return false;
          if (maxPrice && room.price > parseFloat(maxPrice)) return false;
          return true;
        });
        if (hasMatchingRoom) filteredHotels.push(hotel);
      }
      res.json(filteredHotels);
    } else {
      res.json(hotels);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hotel by ID with rooms and reviews
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const rooms = await Room.find({ hotel: req.params.id, available: true });
    const reviews = await Review.find({ hotel: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      hotel,
      rooms,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create hotel (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hotel (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete hotel (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;