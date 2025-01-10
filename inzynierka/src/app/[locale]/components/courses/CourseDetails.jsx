import React, { useState, useContext } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "next/navigation";
import { UserContext } from "../../context/UserContext";
import useAxios from "../../hooks/useAxios";
import getCourseById from "../../api/courses/getCourseById";
import getShortProfile from "../../api/profile/getShortProfile";
import addFilm from "../../api/courses/addFilm";
import react from "../../api/comments/react";
import { MdPhoto } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiLike, BiDislike, BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Link from "next/link";
import CommentsSection from "../comments/CommentsSection";

const CourseDetails = () => {
  const { userData } = useContext(UserContext);
  const axiosInstance = useAxios();
  const params = useParams();

  const [videoToShow, setVideoToShow] = useState(null);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilmData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const {
    refetch: refetchCourse,
    data: course,
    error: courseError,
    isLoading: courseIsLoading,
  } = useQuery(
    ["courseDetailsData", params.courseId],
    () => getCourseById(axiosInstance, params.courseId),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    refetch: authorProfileRefetch,
    data: authorProfileData,
    error: authorProfileError,
    isLoading: authorProfileIsLoading,
  } = useQuery(
    "authorProfileData",
    () => getShortProfile(axiosInstance, course.username),
    {
      enabled: !!course,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: leaveReaction } = useMutation(
    (data) => react(axiosInstance, data.objectId, data.value),
    {
      onSuccess: () => {
        console.log("reaction created successfully:");
        refetchCourse();
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
      },
    }
  );

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col">
      <div className="min-h-screen w-full bg-night flex justify-between px-[5%] pt-[6%]">
        <div className="flex flex-col w-[30%]">
          <div className="w-full  h-[70vh] border-[1px] border-white-smoke rounded-xl overflow-hidden">
            {course?.picture ? (
              <img
                src={course.picture}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="h-full w-full bg-night flex items-center justify-center">
                <MdPhoto className="text-[64px]"></MdPhoto>
              </div> // tło czarne, jeśli brak obrazu
            )}
          </div>
          <div className="mt-[5%] w-full flex flex-col items-center px-4 py-2 border-[1px] border-white-smoke rounded-xl font-chewy">
            <p className="text-[20px]">About author</p>
            <Link
              href={"/profile/" + authorProfileData?.username}
              className="flex items-center gap-x-4 py-4"
            >
              {authorProfileData?.image ? (
                <img
                  src={getImageSrc(authorProfileData?.image)}
                  className=" mt-1 w-[100px] h-[100px] object-cover border-2 border-white-smoke rounded-full align-middle"
                />
              ) : (
                <div className="h-[100px] w-[100px] border-2 border-white-smoke rounded-full flex items-center justify-center">
                  <FaUser className="text-silver text-[50px]"></FaUser>
                </div>
              )}
              <div className="flex flex-col gap-y-2">
                <p className="text-[36px]">{authorProfileData?.username}</p>
              </div>
            </Link>
          </div>
        </div>
        {course && (
          <div className="w-[60%] flex flex-col">
            <div className="flex w-full gap-x-12">
              <p className="text-[96px] font-bangers text-amber">
                {course.title}
              </p>
              <div className="flex flex-col justify-center gap-y-2">
                {userData?.username === course.username && (
                  <div className="flex items-center gap-x-2">
                    <BiEditAlt className="text-[28px]"></BiEditAlt>
                    <AiOutlineDelete className="text-[28px]"></AiOutlineDelete>
                  </div>
                )}
                <div className="flex items-center gap-x-2">
                  <div className="flex items-center gap-x-3 font-chewy">
                    <div
                      className={
                        course.reaction === true && course.canReact === false
                          ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                          : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                      }
                    >
                      <BiLike
                        onClick={() => {
                          leaveReaction({
                            objectId: course._id,
                            value: true,
                          });
                        }}
                        className="cursor-pointer"
                      ></BiLike>
                      <p className="text-[20px]">{course.likesCount}</p>
                    </div>
                    <div
                      className={
                        course.reaction === false && course.canReact === false
                          ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                          : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                      }
                    >
                      <BiDislike
                        onClick={() => {
                          leaveReaction({
                            objectId: course._id,
                            value: false,
                          });
                        }}
                        className="cursor-pointer"
                      ></BiDislike>
                      <p className="text-[20px]">{course.dislikesCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[1.5%]">
              <p className="text-[24px] font-chewy text-white">
                {course.description?.length > 240
                  ? course.description?.slice(0, 240) + "..."
                  : course.description}
              </p>
            </div>
            <div className="mt-[5%] flex flex-col gap-y-4">
              {course.films?.map((film, key) => {
                return (
                  <div
                    key={key}
                    onClick={() => setVideoToShow(key)}
                    className={
                      "w-full border-[1px] rounded-xl px-6 py-2 font-chewy  " +
                      (videoToShow === key
                        ? "border-amber"
                        : "border-white-smoke hover:bg-[#d9d9d9] hover:bg-opacity-15 transition-all duration-150 cursor-pointer ")
                    }
                  >
                    {videoToShow === key ? (
                      <div className="flex flex-col">
                        <div className="w-full flex justify-between items-center">
                          <p className="py-3 text-[20px] text-amber ">
                            {film.title}
                          </p>
                          <IoChevronUp className="text-[28px] text-amber"></IoChevronUp>
                        </div>
                        <iframe
                          width="100%"
                          className="h-[50vh]"
                          src={`https://www.youtube.com/embed/${film.link}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="w-full flex justify-between items-center">
                        <p className="py-3 text-[20px]">{film.title}</p>
                        <IoChevronDown className="text-[28px]"></IoChevronDown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {course && (
        <div className="pt-[6%] bg-night">
          <CommentsSection id={course?._id}></CommentsSection>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
