const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['stripe', 'paypal'],
    required: true
  },
  stripePaymentIntentId: String,
  paypalOrderId: String,
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);