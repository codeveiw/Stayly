const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    type: String,
    required: true
  },
  departure: {
    airport: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  },
  arrival: {
    airport: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    default: 'economy'
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'departed', 'arrived'],
    default: 'scheduled'
  },
  aircraft: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);