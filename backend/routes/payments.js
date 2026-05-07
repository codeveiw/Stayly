const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // Create payment record
    const payment = new Payment({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalPrice,
      method: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending'
    });
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntentId,
      user: req.user._id 
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'succeeded';
      payment.transactionId = paymentIntent.id;
      await payment.save();

      // Update booking status
      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();
      }

      res.json({ message: 'Payment confirmed', payment });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (payment) {
      payment.status = 'succeeded';
      payment.transactionId = paymentIntent.id;
      await payment.save();

      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();
      }
    }
  }

  res.json({ received: true });
});

// Get user payments
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;