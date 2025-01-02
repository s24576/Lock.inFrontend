import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import useAxios from "../../hooks/useAxios";

const CheckoutPage = ({ courseId }) => {
  const stripe = useStripe();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe) {
      // Stripe.js nie został jeszcze załadowany
      return;
    }

    try {
      console.log(courseId);
      const response = await axiosInstance.post(
        `/api/stripe/createCheckoutSession?objectId=${courseId}&objectType=course`,
        {}
      );

      const sessionId = response.data.sessionId;

      // Przekierowanie do Stripe Checkout za pomocą sessionId
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError("Payment initiation failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {/* <PaymentElement /> */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="text-black bg-blue-500 p-2 rounded-md"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default CheckoutPage;
