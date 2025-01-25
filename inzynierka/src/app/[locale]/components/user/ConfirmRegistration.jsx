import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import useAxios from "../../hooks/useAxios";
import confirmRegistration from "../../api/user/confirmRegistration";
import resendConfirmationToken from "../../api/user/resendConfirmationToken";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  return (
    <div className=" flex flex-col w-full h-screen items-center justify-center bg-night text-white-smoke font-chewy">
      <p className="font-bangers text-[48px]">
        {t("register:confirmRegistrationTitle")}
      </p>

      <p>
        {t("register:confirmRegistrationText1")}
        <span
          className="underline cursor-pointer hover:text-amber duration-150 transition-all"
          onClick={handleResendConfirmationToken}
        >
          {t("register:confirmRegistrationText2")}
        </span>
      </p>

      <form
        className="mt-5 flex flex-col items-center w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Code"
          value={confirmationToken}
          onChange={(e) => setConfirmationToken(e.target.value)}
          className="w-[25%] px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
        />
        <button
          type="submit"
          className="flex items-center gap-x-1 hover:text-amber transition-all duration-150 cursor-pointer text-white-smoke mt-5 py-2 px-3"
        >
          <FaCheck className="text-[28px]"></FaCheck>
          <p className="text-[20px] ">
            {t("register:confirmRegistrationButton")}
          </p>
        </button>
      </form>
    </div>
  );
};

export default ConfirmRegistration;
