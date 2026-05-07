const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hotel', 'flight'],
    required: true
  },
  // For hotel bookings
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  checkIn: Date,
  checkOut: Date,
  guests: {
    type: Number,
    min: 1
  },
  // For flight bookings
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  passengers: [{
    name: String,
    email: String,
    phone: String
  }],
  // Common fields
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    unique: true
  },
  specialRequests: String
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);