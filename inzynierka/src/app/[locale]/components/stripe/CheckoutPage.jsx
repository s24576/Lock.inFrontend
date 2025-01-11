import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import useAxios from "../../hooks/useAxios";
import { IoCartOutline } from "react-icons/io5";

const CheckoutPage = ({ course }) => {
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
      const response = await axiosInstance.post(
        `/api/stripe/createCheckoutSession?&objectId=${course._id}&objectType=course`
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
    <form
      onSubmit={handleSubmit}
      className="bg-transparent rounded-xl border-[1px] border-white-smoke hover:border-amber transition-all duration-100"
    >
      <button
        type="submit"
        disabled={!stripe || loading}
        className="text-white-smoke bg-transparent p-2 hover:text-amber hover:border-amber transition-all duration-100"
      >
        {loading ? (
          <div className="flex items-center justify-between gap-x-2 px-2">
            <IoCartOutline className="text-[32px]" />
            <p className="text-[20px]">Wait...</p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-x-2 px-2">
            <IoCartOutline className="text-[32px]" />
            <p className="text-[20px]">{course?.price} PLN</p>
          </div>
        )}
      </button>
    </form>
  );
};

export default CheckoutPage;
