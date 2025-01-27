import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { SearchContext } from "../context/SearchContext";
import { useQuery, useQueries, useMutation } from "react-query";
import useAxios from "../hooks/useAxios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GoChevronDown } from "react-icons/go";
import { IoSettingsSharp } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiWarning } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { BiSolidLock } from "react-icons/bi";
import getMyRiotProfiles from "../api/riot/getMyRiotProfiles";
import getWatchListRiotProfiles from "../api/riot/getWatchListRiotProfiles";
import findPlayer from "../api/riot/findPlayer";
import findProfile from "../api/profile/findProfile";
import getChats from "../api/messenger/getChats";
import ShortMatch from "./riot/ShortMatch";
import { useTranslation } from "react-i18next";
import FullMatch from "./riot/FullMatch";

const HomePage = () => {
  const [profileUsername, setProfileUsername] = useState("");
  const [showClaimedAccounts, setShowClaimedAccounts] = useState(false);
  const [lastMatches, setLastMatches] = useState([]);
  const claimedAccountsRef = useRef(null);
  const [showFullMatch, setShowFullMatch] = useState(null);
  const [numberOfFollowedProfiles, setNumberOfFollowedProfiles] = useState(6);

  const { userData, isLogged } = useContext(UserContext);
  const { version } = useContext(SearchContext);

  const router = useRouter();
  const axiosInstance = useAxios();

  const {
    refetch: refetchClaimedAccounts,
    data: claimedAccountsData,
    error: claimedAccountsError,
    isLoading: claimedAccountsLoading,
  } = useQuery("claimedAccountsData", () => getMyRiotProfiles(axiosInstance), {
    refetchOnWindowFocus: false,
    enabled: isLogged === true,
  });

  useEffect(() => {
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
      enabled: isLogged === true && !!claimedAccountsData,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data && data.matches) {
          setLastMatches((prevMatches) => [
            ...prevMatches,
            ...data.matches.slice(0, 5),
          ]);
        }
      },
    })) || []
  );

  const isAnyDetailedAccountLoading = detailedAccountsData.some(
    (query) => query.isLoading
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
      enabled: isLogged === true,
    }
  );

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  const toggleFullMatch = (matchId) => {
    console.log("siema");
    setShowFullMatch(showFullMatch === matchId ? null : matchId);
  };

  const { t } = useTranslation();

  if (
    claimedAccountsLoading ||
    followedProfilesLoading ||
    isLogged === null ||
    isAnyDetailedAccountLoading
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (
    !claimedAccountsLoading &&
    !followedProfilesLoading &&
    isLogged === true
  ) {
    return (
      <div className="min-h-screen w-full flex justify-between px-[8%] pt-[120px] bg-night font-dekko">
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
                <p className="text-[48px]">
                  {" "}
                  {t("mainpage:homepageHeader")}
                  {userData.username}
                </p>
                <Link href="/account/settings">
                  <IoSettingsSharp className="text-[24px] hover:text-amber transition-colors duration-150"></IoSettingsSharp>
                </Link>
              </div>
              {userData.confirmedAccount === false && (
                <div className=" flex items-center gap-x-2 text-amber">
                  <CiWarning className="text-[28px] "></CiWarning>
                  <p className=" font-dekko">
                    {t("mainpage:notClaimed")}{" "}
                    <Link
                      href="/login/confirmRegistration"
                      className="underline"
                    >
                      {t("mainpage:notClaimed2")}
                    </Link>{" "}
                    {t("mainpage:notClaimed3")}
                  </p>
                </div>
              )}
              <p className="text-[28px]">{userData.bio}</p>
              <div className="flex flex-col gap-y-2 relative">
                <div
                  className="flex items-center gap-x-1 cursor-pointer"
                  onClick={() => setShowClaimedAccounts(!showClaimedAccounts)}
                >
                  <p className="text-[20px]">
                    {" "}
                    {t("mainpage:claimedAccounts")}
                  </p>
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
                            key={index}
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
                                    version +
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
                                    src={
                                      "/rank_emblems/" + account.tier + ".png"
                                    }
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
                        <li className="p-2 text-gray-500">
                          No claimed accounts
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-[32px] mt-8 pl-[5%]">
            {" "}
            {t("mainpage:lastMatches")}
          </p>
          <div className="mt-4 pl-[5%] flex flex-col gap-y-4">
            {lastMatches &&
              lastMatches.length > 0 &&
              lastMatches
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 5)
                .map((match, key) => {
                  return (
                    <div key={key} className="flex flex-col">
                      <div
                        onClick={() => toggleFullMatch(match.matchId)}
                        className="cursor-pointer"
                      >
                        <ShortMatch match={match} />
                      </div>
                      {showFullMatch === match.matchId && (
                        <div className="mt-2">
                          <FullMatch matchId={match.matchId} />
                        </div>
                      )}
                    </div>
                  );
                })}
            {lastMatches.length === 0 && <p>No matches found</p>}
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
              placeholder={t("mainpage:searchProfile")}
              className="bg-transparent text-[20px] focus:outline-none text-night"
            />
            <button type="submit">
              <BiSolidLock className="text-[28px] text-silver cursor-pointer hover:text-[#969696]"></BiSolidLock>
            </button>
          </form>

          <div className="flex flex-col gap-y-2 mt-3 ml-2">
            <p className="text-[24px]"> {t("mainpage:followedProfiles")}</p>
            {followedProfilesLoading && <p>Loading...</p>}
            {followedProfilesData && (
              <div className="flex flex-col gap-y-3">
                {followedProfilesData
                  .slice(0, numberOfFollowedProfiles)
                  .map((profile, key) => {
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
                              version +
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
            {/* followed profiles*/}
            {followedProfilesData &&
              followedProfilesData.length > numberOfFollowedProfiles && (
                <p
                  onClick={() =>
                    setNumberOfFollowedProfiles((prev) => prev + 6)
                  }
                  className="mt-3 text-end text-[18px] hover:text-silver transition-colors duration-150 cursor-pointer"
                >
                  {t("mainpage:seeMore")}
                </p>
              )}
          </div>
        </div>
      </div>
    );
  }
};

export default HomePage;
