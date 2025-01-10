import React, { useState } from "react";
import { useQuery } from "react-query";
import useAxios from "../../hooks/useAxios";
import getOwnedCourses from "../../api/courses/getOwnedCourses";
import getShortProfiles from "../../api/profile/getShortProfiles";
import { MdPhoto } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { BiLike, BiDislike } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";

const MyCourses = () => {
  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });

  const axiosInstance = useAxios();

  const {
    refetch: refetchCourses,
    data: coursesData,
    error: coursesError,
    isLoading: coursesIsLoading,
  } = useQuery(
    "coursesData",
    () => getOwnedCourses(axiosInstance, filterParams.page),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Wyekstrahuj username z każdego obiektu i przypisz do zmiennej
        const usernames = data?.content?.map((build) => build.username);
        // Przypisz do odpowiedniej zmiennej lub użyj setUsernamesToFollow
        setUsernamesToFetch(usernames);
      },
    }
  );

  const {
    refetch: shortProfilesRefetch,
    data: shortProfilesData,
    error: shortProfilesError,
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
    // Zaktualizuj numer strony
    setFilterParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Refetch kursów głównych
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

  //zdjac slice jak bedzie naprawiona funkcja i zmienic size w getOwnedCourses na 3
  return (
    <div className="h-screen w-full flex flex-col items-center  bg-night px-[5%] ">
      <p className="text-[64px] mt-[8%] font-bangers text-amber">My courses</p>
      <div className="flex items-center justify-between w-full gap-x-[5%] mt-[3%]">
        {coursesData?.content &&
          coursesData.content.slice(0, 3).map((course, key) => {
            if (!course) return null;

            return (
              <Link
                key={key}
                href={"/courses/" + course._id}
                className="w-full h-[58vh] flex flex-col border-[1px] border-white-smoke rounded-xl z-20  overflow-hidden transform transition-all duration-250 hover:translate-y-[-10px]"
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
                    </div> // tło czarne, jeśli brak obrazu
                  )}
                </div>
                <div className="flex flex-col px-4 mt-[3%]">
                  <p className="font-bangers text-[48px] ">{course.title}</p>
                  <p className="text-[18px] font-chewy text-white">
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
                      <div className="flex flex-col text-[18px] font-chewy">
                        <p>by</p>
                        <p>{course.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-4 font-chewy">
                      <div
                        className={
                          course.reaction === true && course.canReact === false
                            ? "flex items-center gap-x-1 text-[28px]  text-amber "
                            : "flex items-center gap-x-1 text-[28px]  "
                        }
                      >
                        <BiLike></BiLike>
                        <p className="text-[20px]">{course.likesCount}</p>
                      </div>
                      <div
                        className={
                          course.reaction === false && course.canReact === false
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
      </div>
      {coursesData && (
        <div className="flex justify-center items-center gap-x-4 mt-6 py-6 text-[20px]">
          {/* Jeśli strona jest większa niż 1, wyświetl przycisk "Back" */}
          {filterParams.page > 0 && (
            <p
              className="cursor-pointer hover:text-amber duration-100 transition-colors"
              onClick={() => handlePageChange(filterParams.page - 1)}
            >
              Back
            </p>
          )}

          {/* Wyświetl numery stron w zakresie 5 stron */}
          {Array.from({ length: 5 }, (_, i) => {
            const pageNumber = filterParams.page + i - 2; // Tworzymy tablicę z 5 stron
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

          {/* Jeśli strona jest mniejsza niż ostatnia, wyświetl przycisk "Next" */}
          {filterParams.page < coursesData.page.totalPages - 1 && (
            <p
              className="cursor-pointer hover:text-amber duration-100 transition-colors"
              onClick={() => handlePageChange(filterParams.page + 1)}
            >
              Next
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
