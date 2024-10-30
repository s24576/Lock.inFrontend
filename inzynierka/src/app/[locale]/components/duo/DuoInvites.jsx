import React, { useContext } from "react";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { SearchContext } from "../../context/SearchContext";
import { UserContext } from "../../context/UserContext";
import useAxios from "../../hooks/useAxios";
import getAnswersDuo from "../../api/duo/getAnswersDuo";
import respondAnswerDuo from "../../api/duo/respondAnswerDuo";
import Image from "next/image";
import { FaCheck, FaHandMiddleFinger } from "react-icons/fa6";

const DuoInvites = () => {
  const axiosInstance = useAxios();
  const router = useRouter();
  const { version } = useContext(SearchContext);
  const { userData } = useContext(UserContext);

  const {
    data: duoInvites,
    error: duoInvitesError,
    isLoading: duoInvitesIsLoading,
  } = useQuery("duoInvites", () => getAnswersDuo(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: answerDuoInvite } = useMutation(
    ({ answerId, action }) => respondAnswerDuo(axiosInstance, answerId, action),
    {
      onSuccess: () => {
        console.log("Duo invite answered successfully");
      },
      onError: () => {
        console.error("Error answering duo invite");
      },
    }
  );

  const redirectToProfile = async (puuid, server) => {
    try {
      const response = await axiosInstance.get(
        `/riot/findPlayer?puuid=${puuid}&server=${server}`
      );
      console.log(response.data);
      if (response.status === 200) {
        router.push(
          `/summoner/${response.data.server}/${response.data.tagLine}/${response.data.gameName}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-[100px] h-screen w-full flex flex-col items-center text-white">
      <p>Hello, {userData.username}</p>
      <p>Duo invites</p>

      {duoInvites && (
        <div>
          {duoInvites.content.map((invite, index) => (
            <div
              key={index}
              className="flex gap-x-4 items-center hover:bg-[#1a1a1a] cursor-pointer rounded-2xl"
            >
              <div
                onClick={() =>
                  redirectToProfile(invite.profile.puuid, invite.profile.server)
                }
                className="flex gap-x-4 items-center"
              >
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/" +
                    version +
                    "/img/profileicon/" +
                    invite.profile.profileIconId +
                    ".png"
                  }
                  width={50}
                  height={50}
                  alt="summonerIcon"
                  className="rounded-full border-2 border-white"
                />
                <p>{invite.profile.gameName}</p>
                <p>{invite.profile.server}</p>
                <p>{invite.profile.summonerLevel} lvl</p>
              </div>

              <FaCheck
                className="text-[40px] p-2 border-2 border-white bg-green-500 hover:bg-green-600 z-50"
                onClick={() =>
                  answerDuoInvite({ answerId: invite._id, action: true })
                }
              ></FaCheck>
              <FaHandMiddleFinger
                className="text-[40px] p-2 border-2 border-white bg-red-500 hover:bg-red-600"
                onClick={() =>
                  answerDuoInvite({ answerId: invite._id, action: false })
                }
              ></FaHandMiddleFinger>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuoInvites;
