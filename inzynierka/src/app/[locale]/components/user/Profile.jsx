import React, { useState } from "react";
import { useMutation } from "react-query";
import addProfilePicture from "../../api/profile/addProfilePicture";
import useAxios from "../../hooks/useAxios";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const axiosInstance = useAxios();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const { mutateAsync: uploadProfilePicture } = useMutation(
    (file) => addProfilePicture(axiosInstance, file),
    {
      onSuccess: () => {
        console.log("Profile picture uploaded successfully");
      },
      onError: (error) => {
        console.error("Error uploading profile picture:", error);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      try {
        await uploadProfilePicture(selectedFile);
      } catch (error) {
        console.error("Error submitting profile picture:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div className="p-[120px] flex flex-col h-screen items-center bg-linen text-black">
      <p className="text-xl mb-4">Profile</p>
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
    </div>
  );
};

export default Profile;
