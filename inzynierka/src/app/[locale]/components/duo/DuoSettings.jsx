import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { SearchContext } from "../../context/SearchContext";
import { FaUser } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import Select, { components } from "react-select";
import { customStyles, customStylesDuo } from "@/lib/styles/championNamesList";

const DuoSettings = ({ riotProfiles }) => {
  const { t } = useTranslation();
  const { duoSettings, setDuoSettings } = useContext(UserContext);
  const { version } = useContext(SearchContext);

  const profileOptions = riotProfiles
    ? riotProfiles.map((profile) => ({
        value: profile.gameName,
        label: (
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex items-center  gap-x-5">
              {profile.profileIconId ? (
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profile.profileIconId}.png`}
                  width={30}
                  height={30}
                  alt="summonerIcon"
                  className="rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-[30px] h-[30px] flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                  <FaUser className="text-[15px]"></FaUser>
                </div>
              )}

              <span>{profile.gameName ? profile.gameName : "Summoner"}</span>
            </div>

            {profile.tier === "" || profile.tier === null ? (
              <p className="text-[14px]">Unranked</p>
            ) : (
              <Image
                src={"/rank_emblems/" + profile.tier + ".png"}
                height={30}
                width={30}
                alt="XD"
              />
            )}
          </div>
        ),
        profileData: profile,
      }))
    : [];

  const CustomSingleValue = (props) => {
    const { data } = props;
    console.log("dziwna data", data);
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center  gap-x-5">
            {data.profileData.profileIconId ? (
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileData.profileIconId}.png`}
                width={30}
                height={30}
                alt="summonerIcon"
                className="rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-[30px] h-[30px] flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                <FaUser className="text-[15px]"></FaUser>
              </div>
            )}

            <span>
              {data.profileData.gameName
                ? data.profileData.gameName
                : "Summoner"}
            </span>
          </div>

          {data.profileData.tier === "" || data.profileData.tier === null ? (
            <p className="text-[14px]">Unranked</p>
          ) : (
            <Image
              src={"/rank_emblems/" + data.profileData.tier + ".png"}
              height={30}
              width={30}
              alt={data.profileData.tier}
            />
          )}
        </div>
      </components.SingleValue>
    );
  };

  const handleSelectChange = (selectedOption) => {
    setDuoSettings((prevSettings) => ({
      ...prevSettings,
      duoAccount: selectedOption ? selectedOption.profileData : null,
    }));
  };

  return (
    <div className="w-[80%] mt-[2%]">
      {riotProfiles && riotProfiles.length > 0 ? (
        <Select
          options={profileOptions}
          styles={customStylesDuo}
          placeholder={t("duo:selectProfile")}
          onChange={handleSelectChange}
          components={{ SingleValue: CustomSingleValue }}
          isSearchable={false}
          value={
            duoSettings.duoAccount
              ? profileOptions.find(
                  (opt) => opt.value === duoSettings.duoAccount.gameName
                )
              : null
          }
        />
      ) : (
        <p>{t("duo:noProfilesAvailable")}</p>
      )}
    </div>
  );
};

export default DuoSettings;
