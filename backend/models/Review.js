const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one review per user per hotel/flight
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, flight: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);