import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useQuery } from "react-query";
import useAxios from "../../hooks/useAxios";
import getShortProfiles from "../../api/profile/getShortProfiles";
import { MdPhoto } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { BiLike, BiDislike } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getMyCourses from "../../api/courses/getMyCourses";
import { useTranslation } from "react-i18next";

const MyCourses = () => {
  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });

  const axiosInstance = useAxios();
  const { isLogged } = useContext(UserContext);
  const router = useRouter();

  const { t } = useTranslation();

  const {
    refetch: refetchCourses,
    data: coursesData,
    isLoading: coursesIsLoading,
  } = useQuery(
    "coursesData",
    () => getMyCourses(axiosInstance, filterParams.page),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const usernames = data?.content?.map((build) => {
          if (build?.username) return build.username;
        });
        setUsernamesToFetch(usernames);
      },
    }
  );

  const {
    refetch: shortProfilesRefetch,
    data: shortProfilesData,
    isLoading: shortProfilesIsLoading,
  } = useQuery(
    "shortProfilesData",
    () => getShortProfiles(axiosInstance, usernamesToFetch),
    {
      refetchOnWindowFocus: false,
      enabled: usernamesToFetch?.length > 0,
    }
  );

  //page
  const handlePageChange = async (newPage) => {
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));

    await refetchCourses();

    await new Promise((resolve) => setTimeout(resolve, 0));
    await shortProfilesRefetch();
  };

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  if (coursesIsLoading || shortProfilesIsLoading || isLogged === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (isLogged === false) {
    router.push("/");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night font-dekko">
        <p className="text-amber text-[40px] animate-pulse ">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged && !coursesIsLoading && !shortProfilesIsLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center  bg-night px-[5%] ">
        <p className="text-[64px] mt-[8%] font-bangers text-amber">
          {t("courses:myCourses")}
        </p>
        <div className="flex items-center w-full gap-x-[5%] mt-[3%]">
          {coursesData?.content &&
            coursesData.content.slice(0, 3).map((course, key) => {
              if (!course) return null;

              return (
                <Link
                  key={key}
                  href={"/courses/" + course._id}
                  className="w-[33%] h-[58vh] flex flex-col border-[1px] border-white-smoke rounded-xl z-20  overflow-hidden transform transition-all duration-250 hover:translate-y-[-10px]"
                >
                  <div
                    className="w-full h-[50%]"
                    style={{
                      backgroundColor: !course.picture
                        ? "#131313"
                        : "transparent",
                    }}
                  >
                    {course.picture ? (
                      <img
                        src={course.picture}
                        className="object-cover h-full w-full"
                        height={1080}
                        width={720}
                      />
                    ) : (
                      <div className="h-full w-full bg-night flex items-center justify-center">
                        <MdPhoto className="text-[64px]"></MdPhoto>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col px-4 mt-[3%]">
                    <p className="font-bangers text-[48px] ">{course.title}</p>
                    <p className="text-[18px] font-dekko text-white">
                      {course.description?.length > 120
                        ? course.description?.slice(0, 120) + "..."
                        : course.description}
                    </p>
                    <div className="flex items-center justify-between gap-x-2 mt-6">
                      <div className="flex items-center gap-x-2">
                        {shortProfilesData?.[course.username]?.image ? (
                          <img
                            src={getImageSrc(
                              shortProfilesData?.[course.username]?.image
                            )}
                            className=" mt-1 w-[64px] h-[64px] object-cover border-2 border-white-smoke rounded-full align-middle"
                          />
                        ) : (
                          <div className="h-[64px] w-[64px] border-2 border-white-smoke rounded-full flex items-center justify-center">
                            <FaUser className="text-silver text-[32px]"></FaUser>
                          </div>
                        )}
                        <div className="flex flex-col text-[18px] font-dekko">
                          <p>by</p>
                          <p>{course.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4 font-dekko">
                        <div
                          className={
                            course.reaction === true &&
                            course.canReact === false
                              ? "flex items-center gap-x-1 text-[28px]  text-amber "
                              : "flex items-center gap-x-1 text-[28px]  "
                          }
                        >
                          <BiLike></BiLike>
                          <p className="text-[20px]">{course.likesCount}</p>
                        </div>
                        <div
                          className={
                            course.reaction === false &&
                            course.canReact === false
                              ? "flex items-center gap-x-1 text-[28px]  text-amber "
                              : "flex items-center gap-x-1 text-[28px]  "
                          }
                        >
                          <BiDislike></BiDislike>
                          <p className="text-[20px]">{course.dislikesCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          {coursesData?.content.length === 0 && (
            <div className="text-white-smoke text-[24px] font-chdekkoewy flex justify-center w-full">
              <p>{t("courses:noCourses")}</p>
            </div>
          )}
        </div>
        {coursesData && (
          <div className="flex justify-center items-center gap-x-4 mt-6 py-6 text-[20px] font-dekko">
            {filterParams.page > 0 && (
              <p
                className="cursor-pointer hover:text-amber duration-100 transition-colors"
                onClick={() => handlePageChange(filterParams.page - 1)}
              >
                {t("common:back")}
              </p>
            )}

            {Array.from({ length: 5 }, (_, i) => {
              const pageNumber = filterParams.page + i - 2;
              if (pageNumber >= 0 && pageNumber < coursesData.page.totalPages) {
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

            {filterParams.page < coursesData.page.totalPages - 1 && (
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
    );
  }
};

export default MyCourses;
