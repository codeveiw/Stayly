const express = require('express');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Review = require('../models/Review');
const { auth, adminAuth } = require('../middleware/auth');
const axios = require('axios');
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

// Get hotels via RapidAPI Booking.com
router.get('/search', async (req, res) => {
  try {
    const { destination, checkIn, checkOut, adults, children, rooms } = req.query;

    if (!destination || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Step 1: Search for locations to get dest_id
    const locationOptions = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination',
      params: { query: destination },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    let destId = '';
    let searchType = 'CITY';

    try {
      const locResponse = await axios.request(locationOptions);
      if (locResponse.data && locResponse.data.data && locResponse.data.data.length > 0) {
        destId = locResponse.data.data[0].dest_id;
        searchType = locResponse.data.data[0].search_type;
      }
    } catch (apiErr) {
      console.error('Location search API error:', apiErr.message);
      // Fallback dummy data if RapidAPI fails (for development/testing without real KEY)
      return res.json([
        { id: 1, name: 'Fallback Grand Hotel', rating: 4.8, price: 150, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80', location: destination, amenities: ['wifi', 'pool'], featured: true }
      ]);
    }

    if (!destId) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Step 2: Fetch hotels
    const hotelOptions = {
      method: 'GET',
      url: 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels',
      params: {
        dest_id: destId,
        search_type: searchType,
        arrival_date: checkIn,
        departure_date: checkOut,
        adults: adults || '2',
        children_age: children && parseInt(children) > 0 ? Array(parseInt(children)).fill('10').join(',') : '', // sending dummy ages for children
        room_qty: rooms || '1',
        page_number: '1',
        currency_code: 'USD'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    };

    const hotelResponse = await axios.request(hotelOptions);
    const apiHotels = hotelResponse.data.data.hotels || [];

    // Map the rapidAPI response to our frontend expected format
    const mappedHotels = apiHotels.map(h => {
      const prop = h.property;
      return {
        id: prop.id?.toString() || Math.random().toString(),
        name: prop.name || 'Unnamed Hotel',
        rating: (prop.reviewScore / 2) || 4.0, // scale 10 to 5
        price: prop.priceBreakdown?.grossPrice?.value || 200,
        image: prop.photoUrls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
        location: destination,
        amenities: ['wifi', 'ac'], // generic ones
        featured: false,
        deal: false
      };
    });

    res.json(mappedHotels);
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
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