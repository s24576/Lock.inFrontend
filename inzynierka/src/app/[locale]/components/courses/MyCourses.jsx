import React from "react";
import { useQuery } from "react-query";
import useAxios from "../../hooks/useAxios";
import getOwnedCourses from "../../api/courses/getOwnedCourses";
import Link from "next/link";

const MyCourses = () => {
  const axiosInstance = useAxios();

  const {
    refetch: refetchOwnedCourses,
    data: ownedCoursesData,
    error: ownedCoursesError,
    isLoading: ownedCoursesIsLoading,
  } = useQuery("ownedCoursesData", () => getOwnedCourses(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-[32px]">My courses</p>
      <div className="flex flex-col items-center justify-center mt-4 gap-y-4">
        {ownedCoursesData?.content &&
          ownedCoursesData.content.map((course, key) => {
            if (!course) return null;

            return (
              <Link
                key={key}
                href={"/courses/" + course._id}
                className="flex flex-col items-center justify-center px-4 py-2 border-[1px] border-white hover:bg-[#1f1f1f] transition-all"
              >
                <p>{course.title}</p>
                <p>by {course.username}</p>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default MyCourses;
