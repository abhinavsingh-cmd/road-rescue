const Stripe = require("stripe");
const env = require("../config/env");
const AppError = require("../utils/appError");

let stripe = null;

function getStripeClient() {
  if (!env.stripeSecretKey) {
    throw new AppError("Stripe is not configured on the server", 503);
  }

  if (!stripe) {
    stripe = new Stripe(env.stripeSecretKey, {
      apiVersion: "2024-06-20"
    });
  }

  return stripe;
}

async function createPaymentIntent({ bookingId, amount, customerEmail }) {
  const client = getStripeClient();
  const paymentIntent = await client.paymentIntents.create({
    amount: Math.round(Number(amount) * 100),
    currency: "inr",
    receipt_email: customerEmail,
    automatic_payment_methods: {
      enabled: true
    },
    metadata: {
      bookingId
    }
  });

  return paymentIntent;
}

module.exports = {
  createPaymentIntent
};
