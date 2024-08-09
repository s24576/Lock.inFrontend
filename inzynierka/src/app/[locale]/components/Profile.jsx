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
  const { userData } = useContext(UserContext);
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
      Profile
      {profileData.id && (
        <div className="flex flex-col items-center gap-y-2 mt-4">
          <p>{params.username}</p>
          <p>User Id: {profileData.id}</p>
          <div className="flex gap-x-4">
            <button
              className="px-4 py-2 border-2 border-white hover:bg-[#3a3a3a]"
              onClick={() => followUser()}
            >
              Follow
            </button>
            <button
              className="px-4 py-2 border-2 border-white hover:bg-[#3a3a3a]"
              onClick={() => unfollowUser()}
            >
              Unfollow
            </button>
          </div>
          <div>
            <p>Summoner Watch list:</p>
            {Array.isArray(profileData.watchList) &&
            profileData.watchList.length > 0 ? (
              profileData.watchList.map((summoner, key) => {
                return <p key={key}>{summoner}</p>;
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
