"use client";
import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../context/ProfileContext";
import axios from "axios";
import { useParams } from "next/navigation";
import { UserContext } from "../context/UserContext";
import { LanguageContext } from "../context/LanguageContext";
import useAxios from "../hooks/useAxios";

const Profile = () => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const { userData, isLogged } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const api = useAxios();

  const fetchData = async () => {
    try {
      console.log("siema", params);
      const response = await api.get(
        `http://localhost:8080/profile/findProfile?username=${params.username}`,
        {
          headers: {
            "Accept-Language": language,
          },
        }
      );
      console.log("aaa", response.data);
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [userData]);

  const followUser = async () => {
    console.log("follow");
  };

  const unfollowUser = async () => {
    console.log("unfollow");
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      {userData._id &&
        userData._id !== profileData._id &&
        !userData.friends.some(
          (friend) =>
            (friend.username === userData._id &&
              friend.username2 === profileData._id) ||
            (friend.username2 === userData._id &&
              friend.username === profileData._id)
        ) && (
          <button className="px-4 py-2 border-2 border-white hover:bg-[#3a3a3a]">
            Add to friends
          </button>
        )}
      Profile
      {profileData._id && (
        <div className="flex flex-col items-center gap-y-2 mt-4">
          <p>Username: {profileData._id}</p>
          <p>Friendlist:</p>
          {profileData.friends && profileData.friends.length > 0 ? (
            profileData.friends.map((friend, key) => {
              return (
                <div key={key} className="flex items-center gap-x-4">
                  <p>
                    {friend.username !== profileData._id
                      ? friend.username
                      : friend.username2}
                  </p>
                  {userData._id === profileData._id ? (
                    <button className="px-4 py-2 border-2 border-white hover:bg-[#3a3a3a]">
                      Remove
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })
          ) : (
            <p>No friends available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
