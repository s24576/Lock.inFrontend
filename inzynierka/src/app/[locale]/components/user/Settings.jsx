import React, { useState, useContext } from "react";
import { useQuery, useMutation } from "react-query";
import addProfilePicture from "../../api/profile/addProfilePicture";
import addBio from "../../api/profile/addBio";
import useAxios from "../../hooks/useAxios";
import Image from "next/image";
import { UserContext } from "../../context/UserContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import getUserData from "../../api/user/getUserData";
import changeEmail from "../../api/user/changeEmail";
import changePassword from "../../api/user/changePassword";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    email: "",
    password: "",
  });

  const { userData, setUserData, isLogged } = useContext(UserContext);
  const axiosInstance = useAxios();
  const router = useRouter();

  const [bio, setBio] = useState("");

  const {
    data: userInfo,
    isLoading: userInfoLoading,
    error: userInfoError,
    refetch: userInfoRefetch,
  } = useQuery("userInfo", () => getUserData(axiosInstance), {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUserData(data);
    },
  });

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleBioSubmit = async (event) => {
    event.preventDefault();

    try {
      await uploadBio(bio);
      console.log("success");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewSrc(URL.createObjectURL(file));
    }
  };

  const { mutateAsync: uploadBio } = useMutation(
    (bio) => addBio(axiosInstance, bio),
    {
      onSuccess: () => {
        console.log("bio uploaded successfully");
        setUserData((prevData) => ({
          ...prevData,
          bio: bio,
        }));
      },
      onError: (error) => {
        console.error("Error uploading bio:", error);
      },
    }
  );

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axiosInstance.post(
        "/profile/addProfilePicture",
        formData
      );
      console.log("Profile picture uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error submitting profile picture:", error);
    }
  };

  const handleSave = async () => {
    await handleSubmit();
    if (bio !== "") {
      await uploadBio(bio);
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
    userInfoRefetch();
  };

  const { mutateAsync: handleChangePassword } = useMutation(
    ({ oldPassword, newPassword, confirmPassword }) =>
      changePassword(axiosInstance, oldPassword, newPassword, confirmPassword),
    {
      onSuccess: () => {
        toast.custom(
          (t) => (
            <div className="bg-night border-[1px] border-amber rounded-3xl p-4 text-white-smoke w-[300px] font-dekko flex flex-col">
              <div className="flex items-center justify-between gap-x-2 px-4">
                <h1 className="px-[10px]">{t("common:notification")}</h1>
                <button onClick={() => toast.dismiss(t)}>
                  {t("common:close")}
                </button>
              </div>
              <div className="flex items-start gap-x-2 px-4 mt-2 w-full">
                <p className="pl-[10px] text-[16px] min-w-[30%]">
                  {t("common:passwordChanged")}
                </p>
              </div>
            </div>
          ),
          {
            duration: 6000,
            position: "top-right",
          }
        );
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
        toast.custom(
          (t) => (
            <div className="bg-night border-[1px] border-amber rounded-3xl p-4 text-white-smoke w-[300px] font-dekko flex flex-col">
              <div className="flex items-center justify-between gap-x-2 px-4">
                <h1 className="px-[10px]">{t("common:notification")}</h1>
                <button onClick={() => toast.dismiss(t)}>
                  {t("common:close")}
                </button>
              </div>
              <div className="flex items-start gap-x-2 px-4 mt-2 w-full">
                <p className="pl-[10px] text-[16px] min-w-[30%]">
                  {t("common:emailChanged")}
                </p>
              </div>
            </div>
          ),
          {
            duration: 6000,
            position: "top-right",
          }
        );
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

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    console.log("Form data:", passwordData);
    await handleChangePassword(passwordData);
    await new Promise((resolve) => setTimeout(resolve, 0));
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    console.log("Email data:", emailData);
    await handleChangeEmail(emailData);
    await new Promise((resolve) => setTimeout(resolve, 0));
    setEmailData({
      email: "",
      password: "",
    });
  };

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  if (userInfoLoading || isLogged === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (isLogged === false) {
    router.push("/");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <p className="text-amber text-[48px] animate-pulse">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged) {
    return (
      <div className="flex flex-col h-screen bg-[#131313] text-white-smoke font-dekko px-[10%]">
        <div className="mt-[8%] flex-col flex">
          <p className="font-bangers text-[64px]">
            {t("settings:profileSettings")}
          </p>
          <div className="mt-3 flex items-center gap-x-8">
            <label className="cursor-pointer">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  className="w-[200px] h-[200px] rounded-full border-white-smoke object-cover"
                  alt="Selected Preview"
                />
              ) : userData.image ? (
                <img
                  src={getImageSrc(userData.image)}
                  className="w-[200px] h-[200px] rounded-full border-white-smoke object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-[200px] h-[200px] rounded-full flex items-center justify-center border border-dashed text-gray-400">
                  {t("settings:noProfilePicture")}
                </div>
              )}
              <input
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-5">
                <p className="text-[48px]">{userData._id}</p>
                <button
                  onClick={() => handleSave()}
                  className="flex items-center gap-x-1 hover:text-amber transition-all duration-150 cursor-pointer"
                >
                  <FaSave className="text-[24px]"></FaSave>
                  <p className="text-[18px] ">{t("settings:saveChanges")}</p>
                </button>
              </div>
              <div className="flex">
                <form onSubmit={handleBioSubmit}>
                  <textarea
                    className="bg-transparent focus:outline-none w-full h-full py-2 rounded-md resize-none"
                    placeholder={userData.bio || t("settings:enterBio")}
                    rows={3}
                    cols={50}
                    value={bio}
                    onChange={handleBioChange}
                  />
                </form>
              </div>
            </div>
          </div>
          <p className="mt-[4%] font-bangers text-[64px]">
            {t("settings:accountSettings")}
          </p>
          <div className="flex gap-x-16 w-full">
            <form
              className="mt-3 flex flex-col gap-y-2 text-black w-[30%]"
              onSubmit={handlePasswordSubmit}
            >
              <input
                type="password"
                name="oldPassword"
                placeholder={t("settings:oldPassword")}
                value={passwordData.oldPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
              />
              <input
                type="password"
                name="newPassword"
                placeholder={t("settings:newPassword")}
                value={passwordData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("settings:confirmPassword")}
                value={passwordData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
              />
              <button
                type="submit"
                className="flex items-center gap-x-1 hover:text-amber transition-all duration-150 cursor-pointer pl-3 text-white-smoke mt-3"
              >
                <FaSave className="text-[28px]"></FaSave>
                <p className="text-[20px] ">{t("settings:changePassword")}</p>
              </button>
            </form>
            <form
              className="mt-3  flex flex-col gap-y-2 text-black w-[25%]"
              onSubmit={handleEmailSubmit}
            >
              <input
                type="email"
                name="email"
                placeholder={t("settings:newEmail")}
                value={emailData.email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
              />
              <input
                type="password"
                name="password"
                placeholder={t("settings:password")}
                value={emailData.password}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 text-[18px]  bg-transparent rounded-xl focus:outline-none text-white-smoke border-[1px] border-white-smoke"
              />
              <button
                type="submit"
                className="flex items-center gap-x-1 hover:text-amber transition-all duration-150 cursor-pointer pl-3 text-white-smoke mt-3"
              >
                <FaSave className="text-[28px]"></FaSave>
                <p className="text-[20px] ">{t("settings:changeEmail")}</p>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
