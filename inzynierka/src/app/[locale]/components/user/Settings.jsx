import React, { useState } from "react";
import { useMutation } from "react-query";
import changePassword from "../../api/user/changePassword";
import changeEmail from "../../api/user/changeEmail";
import useAxios from "../../hooks/useAxios";

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    email: "",
    password: "",
  });

  const axiosInstance = useAxios();

  const { mutateAsync: handleChangePassword } = useMutation(
    ({ oldPassword, newPassword, confirmPassword }) =>
      changePassword(axiosInstance, oldPassword, newPassword, confirmPassword),
    {
      onSuccess: () => {
        console.log("Change password successfully");
      },
      onError: () => {
        console.error("Error changing password");
      },
    }
  );

  const { mutateAsync: handleChangeEmail } = useMutation(
    ({ password, email }) => changeEmail(axiosInstance, password, email),
    {
      onSuccess: () => {
        console.log("Change email successfully");
      },
      onError: () => {
        console.error("Error changing email");
      },
    }
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmailChange = (event) => {
    const { name, value } = event.target;
    setEmailData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form data:", passwordData);
    await handleChangePassword(passwordData);
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    console.log("Email data:", emailData);
    await handleChangeEmail(emailData);
  };

  return (
    <div className="p-[120px] flex flex-col h-screen items-center bg-linen text-black">
      <p className="text-xl mb-4">Change Password</p>
      <form
        className="flex flex-col gap-y-2 text-black w-[25%]"
        onSubmit={handleSubmit}
      >
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={passwordData.confirmPassword}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Change Password
        </button>
      </form>

      <p className="text-xl mb-4 mt-8">Change Email</p>
      <form
        className="flex flex-col gap-y-2 text-black w-[25%]"
        onSubmit={handleEmailSubmit}
      >
        <input
          type="email"
          name="email"
          placeholder="New Email"
          value={emailData.email}
          onChange={handleEmailChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={emailData.password}
          onChange={handleEmailChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Change Email
        </button>
      </form>
    </div>
  );
};

export default Settings;
