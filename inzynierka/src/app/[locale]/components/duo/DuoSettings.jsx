import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { SearchContext } from "../../context/SearchContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/componentsShad/ui/dialog";

import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import Select, { components } from "react-select";
import { customStyles } from "@/lib/styles/championNamesList";

const DuoSettings = ({ riotProfiles }) => {
  const { duoSettings, setDuoSettings } = useContext(UserContext);
  const { version } = useContext(SearchContext);

  //duo settings musi byc z db, duo account z db, oprocz tego ustawianie interesujacych championow tez z db
  //wszystko leci przez user context

  //mapowanie profili riot na obiekty do selecta
  const profileOptions = riotProfiles
    ? riotProfiles.map((profile) => ({
        value: profile.gameName,
        label: (
          <div className="flex items-center gap-x-4">
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profile.profileIconId}.png`}
              width={30}
              height={30}
              alt="summonerIcon"
              className="rounded-full border-2 border-white"
            />
            <span>
              {profile.gameName} ({profile.server}) - {profile.summonerLevel}{" "}
              lvl
            </span>
          </div>
        ),
        profileData: profile, // Przechowuje cały obiekt profilu
      }))
    : [];

  //do wyswietlania placeholdera w selectcie
  const CustomSingleValue = (props) => {
    const { data } = props; // dane wybranego profilu
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-x-4">
          <Image
            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${data.profileData.profileIconId}.png`}
            width={30}
            height={30}
            alt="summonerIcon"
            className="rounded-full border-2 border-white"
          />
          <span>
            {data.profileData.gameName} ({data.profileData.server}) -{" "}
            {data.profileData.summonerLevel} lvl
          </span>
        </div>
      </components.SingleValue>
    );
  };

  //funkcja do zmiany wybranego profilu do duo
  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption);
    setDuoSettings((prevSettings) => ({
      ...prevSettings,
      duoAccount: selectedOption ? selectedOption.profileData : null, // Zapisuje pełny profil lub null, jeśli wyczyszczone
    }));
  };

  return (
    <Dialog>
      <DialogTrigger>
        <IoSettingsOutline className="text-[42px]" />
      </DialogTrigger>
      <DialogContent className="bg-oxford-blue">
        <DialogHeader>
          <DialogTitle>Your duo settings</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <p>Choose account for duo:</p>
        {riotProfiles && riotProfiles.length > 0 ? (
          <Select
            options={profileOptions}
            styles={customStyles}
            placeholder="Select a profile"
            onChange={handleSelectChange} // Ustawienie funkcji onChange
            components={{ SingleValue: CustomSingleValue }} // Ustawienie dostosowanego SingleValue
            isSearchable={false}
            value={
              duoSettings.duoAccount
                ? profileOptions.find(
                    (opt) => opt.value === duoSettings.duoAccount.gameName
                  )
                : null
            } // Wyświetlanie wybranego profilu
          />
        ) : (
          <p>No profiles available</p>
        )}
        <button onClick={() => console.log(duoSettings)}>Click</button>
      </DialogContent>
    </Dialog>
  );
};

export default DuoSettings;
