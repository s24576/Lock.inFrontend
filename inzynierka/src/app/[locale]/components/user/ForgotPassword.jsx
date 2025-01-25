import React, { useState } from "react";
import { useMutation } from "react-query";
import resetPassword from "../../api/user/resetPassword";
import { IoRefreshOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const axiosInstance = useAxiosPublic();

  const { mutateAsync: sendEmail } = useMutation(
    (email) => resetPassword(axiosInstance, email),
    {
      onSuccess: () => {
        console.log("Reset password email sent successfully");
      },
      onError: () => {
        console.error("Error sending reset password email");
      },
    }
  );

  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendEmail(email);
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-night text-white-smoke">
      <p className="font-bangers text-[48px]">
        {t("login:forgotPasswordHeader")}
      </p>

      <form
        className="mt-5 flex flex-col items-center font-dekko w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-[25%] px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
        />
        <button
          type="submit"
          className="flex items-center gap-x-1 hover:text-amber transition-all duration-150 cursor-pointer text-white-smoke mt-5 py-2 px-3"
        >
          <IoRefreshOutline className="text-[28px]"></IoRefreshOutline>
          <p className="text-[20px] ">{t("login:forgotPasswordButton")}</p>
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
