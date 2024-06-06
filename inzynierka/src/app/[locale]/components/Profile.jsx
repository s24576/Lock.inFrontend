"use client";
import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../context/ProfileContext";
import axios from "axios";
import { useParams } from "next/navigation";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const fetchData = async () => {
    try {
      console.log("siema", params);
      const response = await axios.get(
        `http://localhost:8080/profile/findProfile?username=${params.username}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
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
    if (profileData.id === undefined && userData.token !== undefined) {
      console.log("profile data", profileData.id);
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userData]);

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
        <div>
          <p>{params.username}</p>
          <p>User Id: {profileData.id}</p>
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
