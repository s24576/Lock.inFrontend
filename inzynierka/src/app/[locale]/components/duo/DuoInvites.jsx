import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { SearchContext } from "../../context/SearchContext";
import { UserContext } from "../../context/UserContext";
import useAxios from "../../hooks/useAxios";
import getAnswersDuo from "../../api/duo/getAnswersDuo";
import respondAnswerDuo from "../../api/duo/respondAnswerDuo";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaHandMiddleFinger, FaUser } from "react-icons/fa6";
import { BiSolidLock } from "react-icons/bi";
import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const DuoInvites = () => {
  const axiosInstance = useAxios();
  const router = useRouter();
  const { version } = useContext(SearchContext);
  const { userData, isLogged } = useContext(UserContext);
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });

  const { t } = useTranslation();

  const {
    refetch: duoInvitesRefetch,
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
        duoInvitesRefetch();
        console.log("Duo invite answered successfully");
      },
      onError: () => {
        console.error("Error answering duo invite");
      },
    }
  );

  //page
  const handlePageChange = async (newPage) => {
    // Zaktualizuj tylko numer strony
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    // Ponowne pobranie danych po zmianie strony
    await duoInvitesRefetch();
  };

  if (duoInvitesIsLoading || isLogged === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (isLogged === false) {
    router.push("/");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night font-chewy">
        <p className="text-amber text-[40px] animate-pulse ">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged && !duoInvitesIsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center relative">
        <div
          className="absolute inset-0 bg-cover bg-fixed"
          style={{
            backgroundImage: `url('/background-images/mybuilds.webp')`,
            opacity: "0.4",
            backgroundSize: "cover", // Nie powiększa obrazu
            backgroundPosition: "center", // Ustawienie środka obrazu
            backgroundRepeat: "no-repeat", // Zapobiega powtarzaniu
            width: "100%",
            height: "100vh", // Obraz będzie rozciągał się na wysokość widoku
          }}
        ></div>
        <div
          className="absolute top-[100vh] inset-0"
          style={{
            background: "linear-gradient(to bottom, #16182F, #131313)",
          }}
        ></div>

        <p className="mt-[10%] font-bangers text-[96px] text-amber z-20">
          {t("duo:duoInvites")}
        </p>

        {duoInvites?.content && duoInvites.content.length > 0 ? (
          <div className="z-20 bg-night flex flex-col items-center bg-opacity-50 w-full px-[14%] mt-[7%] py-[2%] font-chewy">
            <div className="w-[80%] flex flex-wrap items-center gap-x-4">
              {duoInvites?.content &&
                duoInvites.content.length > 0 &&
                duoInvites.content.map((duo, key) => {
                  return (
                    <div
                      className="mt-[2%] flex gap-x-2 justify-between items-center bg-silver bg-opacity-15 rounded-xl px-4 py-3 text-[20px] w-[30%] h-[15vh]"
                      key={key}
                    >
                      <div className="flex gap-x-5 items-center">
                        {duo.profile.profileIconId ? (
                          <Image
                            src={
                              "https://ddragon.leagueoflegends.com/cdn/" +
                              "14.24.1" +
                              "/img/profileicon/" +
                              duo.profile.profileIconId +
                              ".png"
                            }
                            height={64}
                            width={64}
                            alt="summoner icon"
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-[64px] h-[64px] flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                            <FaUser className="text-[32px]"></FaUser>
                          </div>
                        )}
                        <div className="flex flex-col justify-between gap-y-1">
                          <div className="flex items-center gap-x-5">
                            {duo.profile.gameName ? (
                              <Link
                                href={
                                  "/summoner/" +
                                  duo.profile.server +
                                  "/" +
                                  duo.profile.tagLine +
                                  "/" +
                                  duo.profile.gameName
                                }
                                className="text-[20px] hover:text-amber duration-150 transition-all"
                              >
                                {duo.profile.gameName.length > 12
                                  ? `${duo.profile.gameName.slice(0, 12)}...`
                                  : duo.profile.gameName}
                              </Link>
                            ) : (
                              <p className="text-[24px]">Summoner</p>
                            )}
                            {duo.profile.tier === "" ||
                            duo.profile.tier === null ? (
                              <p className="text-[14px]">Unranked</p>
                            ) : (
                              <Image
                                src={
                                  "/rank_emblems/" +
                                  duo.profile.tier.charAt(0).toUpperCase() +
                                  duo.profile.tier.slice(1).toLowerCase() +
                                  ".png"
                                }
                                height={64}
                                width={64}
                                alt="rank_emblem"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-x-2">
                            <BiSolidLock
                              className="text-[40px] hover:text-amber duration-150 transition-all cursor-pointer"
                              onClick={() =>
                                answerDuoInvite({
                                  answerId: duo._id,
                                  action: true,
                                })
                              }
                            ></BiSolidLock>
                            <AiOutlineDelete
                              className="text-[40px] hover:text-amber duration-150 transition-all cursor-pointer"
                              onClick={() =>
                                answerDuoInvite({
                                  answerId: duo._id,
                                  action: false,
                                })
                              }
                            ></AiOutlineDelete>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {duoInvites && (
              <div className="flex justify-center items-center gap-x-4 mt-12 py-6 text-[20px]">
                {/* Jeśli strona jest większa niż 1, wyświetl przycisk "Back" */}
                {filterParams.page > 0 && (
                  <p
                    className="cursor-pointer hover:text-amber duration-100 transition-colors"
                    onClick={() => handlePageChange(filterParams.page - 1)}
                  >
                    {t("common:back")}
                  </p>
                )}

                {/* Wyświetl numery stron w zakresie 5 stron */}
                {Array.from({ length: 5 }, (_, i) => {
                  const pageNumber = filterParams.page + i - 2; // Tworzymy tablicę z 5 stron
                  if (
                    pageNumber >= 0 &&
                    pageNumber < duoInvites.page.totalPages
                  ) {
                    return (
                      <p
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`cursor-pointer hover:text-amber duration-100 transition-colors px-3 py-1 ${
                          filterParams.page === pageNumber ? " text-amber" : ""
                        }`}
                      >
                        {pageNumber + 1}
                      </p>
                    );
                  }
                  return null;
                })}

                {/* Jeśli strona jest mniejsza niż ostatnia, wyświetl przycisk "Next" */}
                {filterParams.page < duoInvites.page.totalPages - 1 && (
                  <p
                    className="cursor-pointer hover:text-amber duration-100 transition-colors"
                    onClick={() => handlePageChange(filterParams.page + 1)}
                  >
                    {t("common:next")}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="z-20 text-[32px] font-chewy text-white-smoke mt-[7%]">
              {t("duo:duoInvitesInfo")}
            </p>
          </div>
        )}
      </div>
    );
  }
};

export default DuoInvites;
