import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useQueries, useMutation } from "react-query";
import useAxios from "../hooks/useAxios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoChevronDown } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";
import { CiWarning } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import getMyRiotProfiles from "../api/riot/getMyRiotProfiles";
import getWatchListRiotProfiles from "../api/riot/getWatchListRiotProfiles";
import findPlayer from "../api/riot/findPlayer";
import findProfile from "../api/profile/findProfile";
import getChats from "../api/messenger/getChats";
import ShortMatch from "./riot/ShortMatch";

const HomePage = () => {
  const [profileUsername, setProfileUsername] = useState("");
  const [showClaimedAccounts, setShowClaimedAccounts] = useState(false);
  const claimedAccountsRef = useRef(null);

  const { userData, isLogged } = useContext(UserContext);

  const router = useRouter();
  const axiosInstance = useAxios();

  const {
    refetch: refetchClaimedAccounts,
    data: claimedAccountsData,
    error: claimedAccountsError,
    isLoading: claimedAccountsLoading,
  } = useQuery("claimedAccountsData", () => getMyRiotProfiles(axiosInstance), {
    refetchOnWindowFocus: false,
    enabled: isLogged,
  });

  useEffect(() => {
    // Close the dropdown if clicked outside
    const handleClickOutside = (e) => {
      if (
        claimedAccountsRef.current &&
        !claimedAccountsRef.current.contains(e.target)
      ) {
        setShowClaimedAccounts(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //po sukcesie wybranie 5 ostatnich meczy z kazdych kont, narazie brak pelnych danych w matches od findPlayer
  const detailedAccountsData = useQueries(
    claimedAccountsData?.map((account) => ({
      queryKey: ["playerData", account.gameName, account.tagLine],
      queryFn: () =>
        findPlayer(
          axiosInstance,
          account.server,
          account.gameName,
          account.tagLine
        ),
      enabled: isLogged && !!claimedAccountsData,
      refetchOnWindowFocus: false, // Zapobiega odświeżeniu na zmianę okna
    })) || []
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

  //po przerobieniu messengera dodac tu ws i refetchowac chaty
  const {
    refetch: refetchChats,
    data: chatsData,
    error: chatsError,
    isLoading: chatsLoading,
  } = useQuery("chatsData", () => getChats(axiosInstance, 3), {
    refetchOnWindowFocus: false,
    enabled: isLogged,
  });

  const {
    refetch: refetchFollowedProfiles,
    data: followedProfilesData,
    error: followedProfilesError,
    isLoading: followedProfilesLoading,
  } = useQuery(
    "followedProfilesData",
    () => getWatchListRiotProfiles(axiosInstance),
    {
      refetchOnWindowFocus: false,
      enabled: isLogged,
    }
  );

  if (!userData) {
    return (
      <div className="h-screen w-full flex px-[5%] pt-[150px] bg-night">
        Loading...
      </div>
    );
  }

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <div className="h-screen w-full flex justify-between px-[8%] pt-[120px] bg-night font-chewy">
      <div className="flex flex-col">
        {/* czesc profilowa + last matches */}
        <div className="flex gap-x-6 items-center">
          {userData.image && userData.image ? (
            <img
              src={getImageSrc(userData.image)}
              className="w-[200px] h-[200px] object-cover border-2 border-white-smoke rounded-full"
            ></img>
          ) : (
            <div className="h-[200px] w-[200px] border-2 border-white-smoke rounded-full flex items-center justify-center">
              <FaUser className="text-silver text-[96px]"></FaUser>
            </div>
          )}
          <div className="flex flex-col gap-y-4">
            <div className="flex gap-x-2 items-center">
              <p className="text-[48px]">Hello, {userData.username}</p>
              <Link href="/account/settings">
                <IoSettingsSharp className="text-[24px] hover:text-amber transition-colors duration-150"></IoSettingsSharp>
              </Link>
            </div>
            {userData.confirmedAccount === false && (
              <div className=" flex items-center gap-x-2 text-amber">
                <CiWarning className="text-[28px] "></CiWarning>
                <p className=" font-chewy">
                  Your account is not confirmed yet, click{" "}
                  <Link href="/login/confirmRegistration" className="underline">
                    here
                  </Link>{" "}
                  to confirm
                </p>
              </div>
            )}
            <p className="text-[28px]">{userData.bio}</p>
            <div className="flex flex-col gap-y-2 relative">
              <div
                className="flex items-center gap-x-1 cursor-pointer"
                onClick={() => setShowClaimedAccounts(!showClaimedAccounts)}
              >
                <p className="text-[20px]">Claimed Accounts</p>
                <GoChevronDown className="text-[20px] cursor-pointer" />
              </div>
              {showClaimedAccounts && (
                <div
                  ref={claimedAccountsRef}
                  className="absolute top-full left-0 mt-1 rounded-2xl z-10 bg-night w-full"
                >
                  <ul className="py-2">
                    {claimedAccountsData && claimedAccountsData.length > 0 ? (
                      claimedAccountsData.map((account, index) => (
                        <Link
                          href={
                            "/summoner/" +
                            account.server +
                            "/" +
                            account.tagLine +
                            "/" +
                            account.gameName
                          }
                        >
                          <li
                            key={index}
                            className="p-2 cursor-pointer hover:bg-silver hover:bg-opacity-5
                          transform-all duration-100 flex justify-between gap-x-2 items-center"
                          >
                            <div className="flex items-center gap-x-2">
                              <Image
                                src={
                                  "https://ddragon.leagueoflegends.com/cdn/" +
                                  "14.11.1" +
                                  "/img/profileicon/" +
                                  account.profileIconId +
                                  ".png"
                                }
                                height={40}
                                width={40}
                                className="border-[1px] border-white-smoke rounded-full"
                              />
                              <span className="text-[16px]">
                                {account.gameName}
                              </span>
                              <p className="text-[14px] text-silver">
                                {account.tagLine}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {account.tier ? (
                                <Image
                                  src={"/rank_emblems/" + account.tier + ".png"}
                                  width={48}
                                  height={48}
                                  alt="ranktier"
                                />
                              ) : (
                                <p className="text-[14px]">Unranked</p>
                              )}
                              {account.rank && (
                                <p className="text-[16px]">{account.rank}</p>
                              )}
                            </div>
                          </li>
                        </Link>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No claimed accounts</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-[32px] mt-8 pl-[5%]">Last matches</p>
        <div className="mt-4 pl-[5%] flex flex-col gap-y-4">
          <ShortMatch></ShortMatch>
          <ShortMatch></ShortMatch>
          <ShortMatch></ShortMatch>
          <ShortMatch></ShortMatch>
          <ShortMatch></ShortMatch>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 w-[35%]">
        {/* search profile + new messages + followedProfiles */}
        <form
          onSubmit={handleFindProfile}
          className="flex justify-between bg-white-smoke rounded-2xl px-4 py-2 items-center mt-12"
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
        <div className="flex flex-col gap-y-2 mt-4 ml-2">
          <p className="text-[24px]">Last chats</p>
          {chatsLoading && <p>Loading...</p>}
          {/* sa 3 last messages przypadek jak nie ma */}
          {chatsData && (
            <div className="flex flex-col gap-y-3">
              {chatsData.content.map((chat) => {
                if (chat.lastMessage === null) return null;
                return (
                  <div key={chat._id} className="flex gap-x-2 items-center">
                    {chat.lastMessage.image ? (
                      <Link href={"/profile/" + chat.lastMessage.userId}>
                        <img
                          src={getImageSrc(chat.lastMessage.image)}
                          className="w-[50px] h-[50px] object-cover border-2 border-white-smoke rounded-full"
                        ></img>
                      </Link>
                    ) : (
                      <Link href={"/profile/" + chat.lastMessage.userId}>
                        <div className="h-[50px] w-[50px] border-2 border-silver rounded-full flex items-center justify-center">
                          <FaUser className="text-silver text-[26px]"></FaUser>
                        </div>
                      </Link>
                    )}

                    {/* dodac linki do chatow a nie samego messengera */}
                    <Link
                      href="/messenger"
                      className="bg-white-smoke w-full p-2 rounded-2xl flex flex-col hover:bg-[#E6E6E6] hover:bg-opacity-100 transition-colors duration-100"
                    >
                      <p className="text-night">{chat.lastMessage.userId}</p>
                      <p className="text-night">{chat.lastMessage.message}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          <Link
            href="/messenger"
            className="text-end text-[18px] hover:text-silver transition-colors duration-150"
          >
            See more...
          </Link>
        </div>
        <div className="flex flex-col gap-y-2 mt-3 ml-2">
          <p className="text-[24px]">Followed profiles</p>
          {followedProfilesLoading && <p>Loading...</p>}
          {followedProfilesData && (
            <div className="flex flex-col gap-y-3">
              {followedProfilesData.map((profile, key) => {
                return (
                  <Link
                    href={
                      "/summoner/" +
                      profile.server +
                      "/" +
                      profile.tagLine +
                      "/" +
                      profile.gameName
                    }
                    key={key}
                    className="flex items-center justify-between hover:bg-silver hover:bg-opacity-5 transition-colors duration-100 p-2 rounded-2xl"
                  >
                    <div className="flex items-center gap-x-2">
                      <Image
                        src={
                          "https://ddragon.leagueoflegends.com/cdn/" +
                          "14.11.1" +
                          "/img/profileicon/" +
                          profile.profileIconId +
                          ".png"
                        }
                        height={50}
                        width={50}
                        className="rounded-full border-[1px] border-white-smoke"
                        alt="profile icon"
                      />
                      <p className="text-[24px]">{profile.gameName}</p>
                    </div>
                    <div className="flex items-center">
                      {profile.tier ? (
                        <Image
                          src={"/rank_emblems/" + profile.tier + ".png"}
                          width={50}
                          height={50}
                          alt="ranktier"
                        />
                      ) : (
                        <p className="text-[20px]">Unranked</p>
                      )}
                      {profile.rank && (
                        <p className="text-[24px]">{profile.rank}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {/* followed profiles strona do dorobienia*/}
          <Link
            href="/messenger"
            className="mt-3 text-end text-[18px] hover:text-silver transition-colors duration-150"
          >
            See more...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
