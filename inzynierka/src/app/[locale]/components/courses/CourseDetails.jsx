import React, { useState, useContext, use } from "react";
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
import { IoMdAdd } from "react-icons/io";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentsShad/ui/dialog";
import CommentsSection from "../comments/CommentsSection";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const CourseDetails = () => {
  const { userData, isLogged } = useContext(UserContext);
  const axiosInstance = useAxios();
  const params = useParams();
  const { t } = useTranslation();
  const router = useRouter();

  const [videoToShow, setVideoToShow] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: "",
    link: "",
  });

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

  const { mutateAsync: handleAddFilm } = useMutation(
    () => addFilm(axiosInstance, newVideo, course?._id),
    {
      onSuccess: () => {
        console.log("film created successfully:");
        refetchCourse();
      },
      onError: (error) => {
        console.error("Error creating film:", error);
      },
    }
  );

  const addVideo = async (e) => {
    e.preventDefault();

    // Sprawdzenie, czy link jest linkiem YouTube i wyciągnięcie ID
    const videoIdMatch = newVideo.link.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/ // Wyrażenie regularne dla ID filmu YouTube
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : newVideo.link; // Jeśli jest dopasowanie, użyj ID, w przeciwnym razie pozostaw oryginalny link

    // Ustawienie linku w obiekcie newVideo
    setNewVideo((prev) => ({
      ...prev,
      link: videoId, // Zaktualizowanie linku zgodnie z wyrażeniem regularnym
    }));

    // Symulacja kolejki microtasków (wstrzymanie wykonania na 0 ms)
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Opcjonalnie wywołanie innej funkcji po dodaniu filmu
    await handleAddFilm();

    // Ponownie symulacja kolejki microtasków
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Resetowanie stanu newVideo po dodaniu filmu
    setNewVideo({ title: "", link: "" }); // Czyszczenie pól w newVideo
  };

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  if (!isLogged) {
    router.push("/login");
  }

  if (isLogged) {
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
              <p className="text-[20px]">{t("courses:aboutAuthor")}</p>
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
              <p className="mt-[4%] text-[32px] ml-1 font-chewy">
                {t("courses:videos")}
              </p>

              <div className="mt-[3%] flex flex-col gap-y-4">
                {course.films?.map((film, key) => {
                  return (
                    <div
                      key={key}
                      onClick={() =>
                        setVideoToShow(videoToShow === key ? null : key)
                      }
                      className={
                        "w-full border-[1px] rounded-xl px-6 py-2 font-chewy cursor-pointer " +
                        (videoToShow === key
                          ? "border-amber"
                          : "border-white-smoke hover:border-amber hover:text-amber transition-all duration-150")
                      }
                    >
                      {videoToShow === key ? (
                        <div className="flex flex-col">
                          <div className="w-full flex justify-between items-center">
                            <p className="py-3 text-[20px] text-amber ">
                              {film.title}
                            </p>
                            <IoChevronUp className="text-[28px] text-amber hover:text-white-smoke transition-all duration-150"></IoChevronUp>
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
                          <IoChevronDown className="text-[28px] "></IoChevronDown>
                        </div>
                      )}
                    </div>
                  );
                })}
                {course.films?.length === 0 && (
                  <p className="font-chewy text-[18px]">
                    {t("courses:noVideos")}
                  </p>
                )}

                {userData?.username === course.username && (
                  <Dialog>
                    <DialogTrigger>
                      <div
                        className={`flex items-center gap-x-2 ${
                          course?.videos?.length > 0 ? "mt-3" : "mt-0"
                        } hover:text-amber duration-150 transition-all font-chewy`}
                      >
                        <IoMdAdd className="text-[24px]"></IoMdAdd>
                        <p className="text-[20px]">Add video</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-night border-amber border-2 text-chewy flex items-center pl-0">
                      <DialogHeader>
                        <DialogTitle>
                          <p className="hidden">Add film</p>
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={addVideo}
                        className="flex flex-col w-full items-center gap-y-3"
                      >
                        <input
                          type="text"
                          value={newVideo.title}
                          onChange={(e) =>
                            setNewVideo((prev) => {
                              return {
                                ...prev,
                                title: e.target.value,
                              };
                            })
                          }
                          className="w-[80%] border-amber border-[1px] rounded-xl bg-transparent px-3 py-2 text-[18px] text-white-smoke z-20 font-chewy focus:outline-none "
                          placeholder="Video title"
                        />

                        <input
                          type="text"
                          value={newVideo.link}
                          onChange={(e) =>
                            setNewVideo((prev) => ({
                              ...prev,
                              link: e.target.value, // Ustawia pełny link, tak jak wpisuje użytkownik
                            }))
                          }
                          className="w-[80%] border-amber border-[1px] rounded-xl bg-transparent px-3 py-2 text-[18px] text-white-smoke z-20 font-chewy focus:outline-none"
                          placeholder="Video link"
                        />

                        <button
                          type="submit"
                          className="w-[30%] mt-6 border-amber border-[1px] rounded-3xl bg-transparent px-4 py-2 text-[18px] text-white-smoke z-20 font-chewy hover:bg-silver-hover transition-all duration-150 "
                        >
                          Add video
                        </button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
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
  }
};

export default CourseDetails;
