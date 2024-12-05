import React, { useState, useContext } from "react";
import { useMutation } from "react-query";
import addProfilePicture from "../../api/profile/addProfilePicture";
import addBio from "../../api/profile/addBio";
import useAxios from "../../hooks/useAxios";
import Image from "next/image";
import { UserContext } from "../../context/UserContext";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { userData, setUserData } = useContext(UserContext);
  const axiosInstance = useAxios();

  const [bio, setBio] = useState(userData.bio || "");

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
    setSelectedFile(event.target.files[0]);
  };

  const { mutateAsync: uploadProfilePicture } = useMutation(
    (formData) => addProfilePicture(axiosInstance, formData),
    {
      onSuccess: () => {
        console.log("Profile picture uploaded successfully");
      },
      onError: (error) => {
        console.error("Error uploading profile picture:", error);
      },
    }
  );

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

  const handleSubmit = async (event) => {
    event.preventDefault();

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

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <div className="p-[120px] flex flex-col h-screen items-center bg-[#131313] text-black">
      <p className="text-xl mb-4">Profile</p>
      <p>{userData._id}</p>
      <p>Your bio: {userData.bio}</p>

      {userData.image && userData.image ? (
        <img src={getImageSrc(userData.image)}></img>
      ) : (
        <p>No profile picture</p>
      )}

      <form
        className="flex flex-col gap-y-2 text-black w-[25%]"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          name="profilePicture"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Upload Picture
        </button>
      </form>

      <form
        className="flex flex-col gap-y-2 text-black w-[25%] mt-4"
        onSubmit={handleBioSubmit}
      >
        <textarea
          value={bio}
          onChange={handleBioChange}
          placeholder="Enter your bio"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Submit Bio
        </button>
      </form>
    </div>
  );
};

export default Profile;
