import React, { useState } from "react";
import { useMutation } from "react-query";
import resetPassword from "../../api/user/resetPassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const { mutateAsync: sendEmail } = useMutation(
    (email) => resetPassword(email),
    {
      onSuccess: () => {
        console.log("Reset password email sent successfully");
      },
      onError: () => {
        console.error("Error sending reset password email");
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendEmail(email);
  };

  return (
    <div className="p-[120px] flex flex-col h-screen items-center bg-linen text-black">
      <p>Forgot Password</p>

      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <button
          type="submit"
          className="mt-4 text-gray-100 bg-oxford-blue py-2 px-4 text-[22px] font-semibold rounded-full shadow-gray-900 shadow-lg hover:scale-105 transition-all duration-150"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
