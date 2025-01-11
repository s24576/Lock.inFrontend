import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueries } from "react-query";
import { useRouter } from "next/navigation";
import useAxios from "../../hooks/useAxios";
import getCourses from "../../api/courses/getCourses";
import getShortProfiles from "../../api/profile/getShortProfiles";
import getCoursePreviewById from "../../api/courses/getCoursePreviewById";
import createCourse from "../../api/courses/createCourse";
import { FaUser } from "react-icons/fa6";
import { BiLike, BiDislike } from "react-icons/bi";
import Link from "next/link";
import CourseCarousel from "./CourseCarousel";

const Courses = () => {
  const [courseName, setCourseName] = useState("");
  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [previewIds, setPreviewIds] = useState([]);
  const [filterParams, setFilterParams] = useState({
    page: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const axiosInstance = useAxios();
  const router = useRouter();

  const {
    refetch: refetchCourses,
    data: coursesData,
    error: coursesError,
    isLoading: coursesIsLoading,
  } = useQuery(
    "coursesData",
    () => getCourses(axiosInstance, filterParams.page),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Wyekstrahuj username z każdego obiektu i przypisz do zmiennej
        const usernames = data?.content?.map((build) => build.username);
        // Przypisz do odpowiedniej zmiennej lub użyj setUsernamesToFollow
        setUsernamesToFetch(usernames);

        const previewIds = data?.content?.slice(0, 5).map((build) => build._id);
        // Przypisz previewIds do zmiennej
        setPreviewIds(previewIds);
      },
    }
  );

  const previewCourseQueries = useQueries(
    previewIds.map((id) => ({
      queryKey: ["courseData", id],
      queryFn: () => getCoursePreviewById(axiosInstance, id),
      refetchOnWindowFocus: false,
    }))
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

  const { mutateAsync: createNewCourse } = useMutation(
    (courseData) => createCourse(axiosInstance, courseData),
    {
      onSuccess: (data) => {
        console.log("Course created successfully:", data);
        refetchCourses();
      },
      onError: (error) => {
        console.error("Error creating course:", error);
      },
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

    await Promise.all(previewCourseQueries.map((query) => query.refetch()));
  };

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <div className="h-screen flex justify-between px-[10%] w-full bg-night items-strecht">
      <div className="flex flex-col items-center w-[45%] mt-[10%] font-chewy">
        <p className="font-bangers text-[72px] text-amber">Courses</p>
        {/* <input
          type="text"
          placeholder="Search by name..."
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="text-[28px] bg-white-smoke px-6 py-2 w-full rounded-3xl mt-[3%] focus:outline-none text-night"
        /> */}
        {coursesData?.content && (
          <div className="flex flex-col w-full mt-[6%] gap-y-4">
            {coursesData.content.map((course, key) => {
              return (
                <div
                  key={key}
                  className="flex items-center border-2 border-amber rounded-xl px-3 py-2 w-full hover:bg-[#d9d9d9] hover:bg-opacity-10 transition-all duration-100"
                >
                  <p href={"/"} className="text-[32px] font-bangers w-[45%]">
                    {course?.title}
                  </p>
                  {shortProfilesData?.[course?.username]?.image ? (
                    <img
                      src={getImageSrc(
                        shortProfilesData?.[course?.username]?.image
                      )}
                      className=" mt-1 w-[48px] h-[48px] object-cover border-2 border-white-smoke rounded-full align-middle"
                    />
                  ) : (
                    <div className="h-[48px] w-[48px] border-2 border-white-smoke rounded-full flex items-center justify-center">
                      <FaUser className="text-silver text-[24px]"></FaUser>
                    </div>
                  )}
                  <div className="flex flex-col text-[18px] ml-2 w-[25%]">
                    <p>by</p>
                    <Link
                      href={"/profile/" + course?.username}
                      className="hover:underline duration-150 transition-all"
                    >
                      {course?.username}
                    </Link>
                  </div>
                  <div className="flex items-center gap-x-4 pr-8">
                    <div
                      className={
                        course?.reaction === true && course?.canReact === false
                          ? "flex items-center gap-x-1 text-[28px]  text-amber "
                          : "flex items-center gap-x-1 text-[28px]  "
                      }
                    >
                      <BiLike></BiLike>
                      <p className="text-[20px]">{course?.likesCount}</p>
                    </div>
                    <div
                      className={
                        course?.reaction === false && course?.canReact === false
                          ? "flex items-center gap-x-1 text-[28px]  text-amber "
                          : "flex items-center gap-x-1 text-[28px]  "
                      }
                    >
                      <BiDislike></BiDislike>
                      <p className="text-[20px]">{course?.dislikesCount}</p>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  if (
                    pageNumber >= 0 &&
                    pageNumber < coursesData.page.totalPages
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
        )}
      </div>

      {previewCourseQueries && (
        <CourseCarousel
          previews={previewCourseQueries}
          shortProfiles={shortProfilesData}
        />
      )}
    </div>
  );
};

export default Courses;
