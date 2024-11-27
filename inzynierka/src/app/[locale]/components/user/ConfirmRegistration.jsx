import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import confirmRegistration from "../../api/user/confirmRegistration";
import resendConfirmationToken from "../../api/user/resendConfirmationToken";
import { useRouter } from "next/navigation";

const ConfirmRegistration = () => {
  const [confirmationToken, setConfirmationToken] = useState("");
  const axiosInstance = useAxios();
  const router = useRouter();

  const { mutateAsync: handleConfirmRegistration } = useMutation(
    (confirmationToken) =>
      confirmRegistration(axiosInstance, confirmationToken),
    {
      onSuccess: () => {
        console.log("Account confirmed successfully");
        router.push("/");
      },
      onError: () => {
        console.error("Error confirming account");
      },
    }
  );

  const { mutateAsync: handleResendConfirmationToken } = useMutation(
    () => resendConfirmationToken(axiosInstance),
    {
      onSuccess: () => {
        console.log("Token sent successfully");
      },
      onError: () => {
        console.error("Error sending token account");
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleConfirmRegistration(confirmationToken);
  };

  return (
    <div className="p-[120px] flex flex-col h-screen items-center bg-linen text-black">
      <p>Confirm registration</p>

      <p>
        Didn't get an email with confirmation code?{" "}
        <span
          className="underline cursor-pointer"
          onClick={handleResendConfirmationToken}
        >
          Click here
        </span>
      </p>

      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Code"
          value={confirmationToken}
          onChange={(e) => setConfirmationToken(e.target.value)}
          className="mt-4 w-[85%] px-2 py-2 text-[22px] rounded-full font-semibold placeholder-oxford-blue focus:outline-none shadow-gray-800 shadow-lg"
        />
        <button
          type="submit"
          className="mt-4 w-[50%] text-gray-100 bg-oxford-blue py-1 text-[22px] font-semibold rounded-full shadow-gray-900 shadow-lg hover:scale-105 transition-all duration-150"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ConfirmRegistration;
