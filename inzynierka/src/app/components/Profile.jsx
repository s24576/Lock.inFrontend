"use client";
import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../context/ProfileContext";
import axios from "axios";
import { useParams } from "next/navigation";

const Profile = () => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const fetchData = async () => {
    try {
      console.log(params);
      const response = await axios.get(
        `http://localhost:8080/profile/findProfile?username=${params.username}`
      );
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!profileData.userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

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
      {profileData.userId && (
        <div>
          <p>User Id: {profileData.userId}</p>
          <div>
            <p>Watch list:</p>
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
