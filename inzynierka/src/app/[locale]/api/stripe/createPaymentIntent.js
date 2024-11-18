const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPayment = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "pln",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent.client_secret;
  } catch (error) {
    console.error("Error creating payment intent:", error);
  }

  return null;
};

export default createPayment;
