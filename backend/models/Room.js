const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'suite', 'deluxe'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  available: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);