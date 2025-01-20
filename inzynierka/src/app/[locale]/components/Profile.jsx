"use client";
import React, { useState, useContext, useEffect } from "react";
import { ProfileContext } from "../context/ProfileContext";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { useParams } from "next/navigation";
import { UserContext } from "../context/UserContext";
import { LanguageContext } from "../context/LanguageContext";
import useAxios from "../hooks/useAxios";
import findProfile from "../api/profile/findProfile";
import { FaUser } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import sendFriendRequest from "../api/profile/sendFriendRequest";
import getShortProfiles from "../api/profile/getShortProfiles";
import Link from "next/link";
import { BiSolidLock } from "react-icons/bi";
import { useRouter } from "next/navigation";

const Profile = () => {
  const { userData, isLogged } = useContext(UserContext);
  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  //profil do wyszukania
  const [profileUsername, setProfileUsername] = useState("");

  const params = useParams();
  const axiosInstance = useAxios();
  const router = useRouter();

  const {
    data: profileData,
    error: profileError,
    isLoading: profileIsLoading,
    refetch: profileRefetch,
  } = useQuery(
    "profileData",
    () => findProfile(axiosInstance, params.username),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess: (data) => {
        // Wyekstrahuj username z każdego obiektu i przypisz do zmiennej
        const usernames = data.friends.map((friend) =>
          friend.username === data._id ? friend.username2 : friend.username
        );

        // Przypisz do odpowiedniej zmiennej lub użyj setUsernamesToFollow
        setUsernamesToFetch(usernames);
      },
    }
  );

  const {
    mutateAsync: handleSendFriendRequest,
    error: sendFriendRequestError,
    isError: sendFriendRequestIsError,
  } = useMutation(
    () => {
      sendFriendRequest(axiosInstance, profileData._id);
    },
    {
      onSuccess: (data) => {
        console.log("Success adding friend:", data);
      },
      onError: (error) => {
        console.error("Error adding friend:", error);
      },
    }
  );

  //short profile do znajomych
  const {
    refetch: shortProfilesRefetch,
    data: shortProfilesData,
    isLoading: shortProfilesIsLoading,
  } = useQuery(
    ["shortProfilesData", usernamesToFetch], // Dodanie zmiennej jako klucz
    () => getShortProfiles(axiosInstance, usernamesToFetch),
    {
      refetchOnWindowFocus: false,
      enabled: usernamesToFetch.length > 0,
    }
  );

  const { mutateAsync: findAnotherProfile } = useMutation(
    () => findProfile(axiosInstance, profileUsername),
    {
      onSuccess: (data) => {
        router.push("/profile/" + data._id);
      },
      onError: (error) => {
        console.error("Error creating course:", error);
      },
    }
  );

  const handleFindProfile = async (e) => {
    e.preventDefault();
    await findAnotherProfile();
  };

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  if (profileIsLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <p>Loading</p>
      </div>
    );
  }

  if (!profileIsLoading && profileData)
    return (
      <div className="pt-[10%] px-[10%] min-h-screen w-full flex flex-col bg-night font-chewy">
        <div className="flex justify-between w-full">
          <div className="flex gap-x-4 w-full">
            {profileData.image ? (
              <img
                src={getImageSrc(profileData.image)}
                className="w-[200px] h-[200px] object-cover border-2 border-white-smoke rounded-full"
                alt="Profile"
              />
            ) : (
              <div className="h-[200px] w-[200px]  rounded-full flex items-center justify-center box-border">
                <FaUser className="text-silver text-[96px]" />
              </div>
            )}

            <div className="flex flex-col gap-y-2 w-full">
              <div className="flex items-center gap-x-6">
                <p className="text-[64px] font-bangers">{profileData._id}</p>
                {userData?.friends?.some((friend) => {
                  const otherUsername =
                    friend.username === userData._id
                      ? friend.username2
                      : friend.username;
                  return otherUsername === profileData._id;
                }) ? (
                  <div
                    onClick={() => handleSendFriendRequest()}
                    className="flex items-center gap-x-1 text-white-smoke hover:text-amber transition-all cursor-pointer duration-150"
                  >
                    <AiOutlineDelete className="text-[28px]" />
                    <p className="text-[20px]">Delete friend</p>
                  </div>
                ) : (
                  <div
                    onClick={() => handleSendFriendRequest()}
                    className="flex items-center gap-x-1 text-white-smoke hover:text-amber transition-all cursor-pointer duration-150"
                  >
                    <IoPersonAddSharp className="text-[28px]" />
                    <p className="text-[20px]">Add friend</p>
                  </div>
                )}
              </div>
              <div className="text-[18px] break-words p-2 max-w-[30%]">
                {profileData.bio ? (
                  <p>
                    {profileData.bio.length > 200
                      ? profileData.bio.substring(0, 200) + "..."
                      : profileData.bio}
                  </p>
                ) : (
                  <p>User bio...</p>
                )}
              </div>
            </div>
          </div>
          <form
            onSubmit={handleFindProfile}
            className="h-[56px] flex justify-between bg-white-smoke rounded-2xl px-4 py-2 items-center mt-12"
          >
            <input
              type="text"
              value={profileUsername}
              onChange={(e) => setProfileUsername(e.target.value)}
              placeholder="Search profile..."
              className="bg-transparent text-[20px] focus:outline-none text-night"
            />
            <button type="submit">
              <BiSolidLock className="text-[28px] text-silver cursor-pointer hover:text-[#969696]"></BiSolidLock>
            </button>
          </form>
        </div>
        <div className="mt-[5%] flex flex-col gap-y-4">
          <p className="text-[40px]">Friends</p>
          <div className="flex flex-col gap-y-3">
            {shortProfilesData &&
              Object.entries(shortProfilesData).map(([key, profile]) => (
                <Link
                  href={"/profile/" + profile.username}
                  key={key}
                  className="flex gap-x-3 items-center bg-white-smoke bg-opacity-10 p-2 rounded-lg w-[20%] hover:bg-opacity-30 transition-all cursor-pointer duration-150"
                >
                  {profile.image ? (
                    <img
                      src={getImageSrc(profile.image)}
                      className="w-[40px] h-[40px] object-cover border-2 border-white-smoke rounded-full"
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-[40px] w-[40px] border-2 border-white-smoke rounded-full flex items-center justify-center">
                      <FaUser className="text-silver text-[18px]" />
                    </div>
                  )}
                  <p>{profile.username}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
};

export default Profile;
