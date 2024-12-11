"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { IoMdUnlock, IoMdLock } from "react-icons/io";
import { MdDelete, MdReply } from "react-icons/md";
import { useQuery, useMutation } from "react-query";
import getRunes from "../../api/ddragon/getRunes";
import getCommentsById from "../../api/comments/getCommentsById";
import getResponsesById from "../../api/comments/getResponsesById";
import addComment from "../../api/comments/addComment";
import react from "../../api/comments/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/componentsShad/ui/tooltip";

const BuildDetails = () => {
  const { userData, isLogged } = useContext(UserContext);

  const [buildData, setBuildData] = useState({});
  const [newComment, setNewComment] = useState("");

  //ustawia na id komentarza do ktorego fetchowane beda odpowiedzi
  const [commentIdToFetch, setCommentIdToFetch] = useState({
    commentId: "",
    action: "",
  });
  //dane wszystkich replyow
  const [allRepliesData, setAllRepliesData] = useState({});
  const [newReply, setNewReply] = useState("");
  //ustawia na id komentarza do ktorego odpowiada
  const [showReplyInput, setShowReplyInput] = useState("");

  const [numberOfComments, setNumberOfComments] = useState(5);

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);

  const params = useParams();
  const pathname = usePathname();
  const api = useAxios();

  const {
    data: runesData,
    error: runesError,
    isLoading: runesIsLoading,
  } = useQuery("runesData", () => getRunes(), {
    refetchOnWindowFocus: false,
  });

  const {
    refetch: refetchComments,
    data: commentsData,
    error: commentsError,
    isLoading: commentsIsLoading,
  } = useQuery("commentsData", () => getCommentsById(params.buildId), {
    refetchOnWindowFocus: false,
  });

  const {
    refetch: refetchReplies,
    data: repliesData,
    error: repliesError,
    isLoading: repliesIsLoading,
  } = useQuery(
    ["repliesData", commentIdToFetch.commentId],
    () => getResponsesById(commentIdToFetch.commentId),
    {
      enabled: !!commentIdToFetch.commentId,
      refetchOnWindowFocus: false,
      onSuccess: (newData) => {
        console.log(commentIdToFetch.action);
        setAllRepliesData((prevData) => {
          // Upewniamy się, że prevData.content zawsze jest tablicą
          const prevContent = prevData?.content || [];

          // Tworzymy nową tablicę, dodając:
          // - nowe obiekty, które nie występują w prevContent,
          // - zaktualizowane obiekty, gdzie likesCount lub dislikesCount się zmieniły
          const newContent = newData.content.reduce((acc, newItem) => {
            // Sprawdzamy, czy istnieje już obiekt o tym samym _id w prevContent
            const existingItem = prevContent.find(
              (item) => item._id === newItem._id
            );

            if (existingItem) {
              // Jeśli istnieje obiekt, sprawdzamy, czy likesCount lub dislikesCount się zmieniły
              if (
                existingItem.likesCount !== newItem.likesCount ||
                existingItem.dislikesCount !== newItem.dislikesCount
              ) {
                // Jeśli są różnice, aktualizujemy tylko te pola
                acc.push({
                  ...existingItem,
                  likesCount: newItem.likesCount,
                  dislikesCount: newItem.dislikesCount,
                });
              } else {
                // Jeśli nie ma zmian w likesCount i dislikesCount, dodajemy istniejący obiekt bez zmian
                acc.push(existingItem);
              }
            } else {
              // Jeśli nowy obiekt nie istnieje w prevContent, dodajemy go
              acc.push(newItem);
            }

            return acc;
          }, []); // Zaczynamy od pustej tablicy

          return {
            ...prevData,
            content: newContent,
          };
        });
      },
    }
  );

  const { mutateAsync: addNewComment } = useMutation(
    (comment) => addComment(api, params.buildId, comment, showReplyInput),
    {
      onSuccess: (data) => {
        console.log("comment created successfully:", data);

        // Odśwież komentarze
        refetchComments();

        // Jeżeli akcja to nie "showMore", dodaj nowy komentarz do allRepliesData
        console.log("action", commentIdToFetch.action);

        refetchReplies();
      },
      onError: (error) => {
        console.error("Error creating comment:", error);
      },
    }
  );

  const { mutateAsync: leaveReaction } = useMutation(
    (data) => react(api, data.objectId, data.value),
    {
      onSuccess: () => {
        console.log("reaction created successfully:");
        refetchComments();
        refetchReplies();
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
      },
    }
  );

  useEffect(() => {
    const langRegex = /^\/([a-z]{2})\//;
    const langMatch = pathname.match(langRegex);
    const language = langMatch ? langMatch[1] : "en";

    const fetchBuild = async () => {
      try {
        const response = await api.get(
          `http://localhost:8080/build/getBuildById?buildId=${params.buildId}`,
          {
            headers: {
              "Accept-Language": language,
            },
          }
        );
        console.log(response.data);
        setBuildData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBuild();
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e, comment) => {
    e.preventDefault();

    console.log("New Comment:", comment);
    console.log("Build ID:", params.buildId);

    if (!comment.trim()) {
      console.log("Comment is empty");
      return;
    }

    try {
      await addNewComment(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
    }

    setNewComment("");
    setNewReply("");
    setShowReplyInput("");
  };

  const handleLike = async () => {
    if (isLogged && !isLikeLoading) {
      setIsLikeLoading(true);
      //lajkowanie
      if (buildData.canReact) {
        try {
          const response = await api.put(
            `/comments/react?objectId=${buildData._id}&value=true`
          );
          console.log(response.data);

          setBuildData((prevData) => ({
            ...prevData,
            likesCount: prevData.likesCount + 1,
            canReact: false,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLikeLoading(false);
        }
      }
      //cofanie lajka
      if (buildData.canReact === false && buildData.reaction === true) {
        try {
          const response = await api.delete(
            `/comments/deleteReaction?objectId=${buildData._id}`
          );
          console.log(response.data);

          setBuildData((prevData) => ({
            ...prevData,
            likesCount: prevData.likesCount - 1,
            canReact: true,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLikeLoading(false);
        }
      }
      //przestawianie lajka z false na true
      if (buildData.canReact === false && buildData.reaction === false) {
        try {
          const response = await api.put(
            `/comments/react?objectId=${buildData._id}&value=true`
          );
          console.log(response.data);

          setBuildData((prevData) => ({
            ...prevData,
            likesCount: prevData.likesCount + 1,
            dislikesCount: prevData.dislikesCount - 1,
            reaction: true,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsLikeLoading(false);
        }
      }
    }
  };

  const handleDislike = async () => {
    if (isLogged && !isDislikeLoading) {
      setIsDislikeLoading(true);
      //dislike
      if (buildData.canReact) {
        try {
          const response = await api.put(
            `/comments/react?objectId=${buildData._id}&value=false`
          );
          console.log(response.data);

          setBuildData((prevData) => ({
            ...prevData,
            dislikesCount: prevData.dislikesCount + 1,
            canReact: false,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsDislikeLoading(false);
        }
      }
      //cofniecie dislike
      if (buildData.canReact === false && buildData.reaction === false) {
        try {
          const response = await api.delete(
            `/comments/deleteReaction?objectId=${buildData._id}`
          );
          console.log(response.data);

          setBuildData((prevData) => ({
            ...prevData,
            dislikesCount: prevData.dislikesCount - 1,
            canReact: true,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsDislikeLoading(false);
        }
      }

      //zmiana z lajka na dislike
      if (buildData.canReact === false && buildData.reaction === true) {
        try {
          const response = await api.put(
            `/comments/react?objectId=${buildData._id}&value=false`
          );
          console.log(response.data);

          setBuildData((prevData) => ({
            ...prevData,
            likesCount: prevData.likesCount - 1,
            dislikesCount: prevData.dislikesCount + 1,
            reaction: false,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setIsDislikeLoading(false);
        }
      }
    }
  };

  const deleteBuild = async (buildId) => {
    try {
      const response = await api.delete(
        `/build/deleteBuild?buildId=${buildId}`
      );
      console.log(response.data);
      setBuilds((prevBuilds) => ({
        ...prevBuilds,
        content: prevBuilds.content.filter((build) => build._id !== buildId),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const saveBuild = async (buildId) => {
    try {
      const response = await api.put(
        `/build/saveBuild?buildId=${buildId}&save=true`
      );
      //unsave do zrobienia
      console.log(response.data);
      //setter na state ktory powie ze jest juz build zasaveowany
    } catch (error) {
      console.log(error);
    }
  };

  //do zrobienia redirecty

  return (
    <div className="min-h-screen w-full flex flex-col  text-white-smoke bg-night">
      {Object.keys(buildData).length > 0 ? (
        <div className="flex flex-col">
          <div className="flex w-[80%] mx-auto mt-[250px] items-center justify-between">
            <div className="flex items-center">
              <Image
                src={"/profilePicture.jpg"}
                width={200}
                height={200}
                alt={buildData.championId}
                className="w-[200px] h-[200px] rounded-full object-cover aspect-square"
              />

              <div className="flex flex-col gap-y-2 ml-6">
                <p className="text-[32px]">{buildData.title}</p>
                <p className="text-[28px]">by {buildData.username}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-y-2">
              <div className="flex">
                {isLogged && ( //do zmiany isLogged na usera
                  <button
                    onClick={() => {
                      deleteBuild(buildData._id);
                    }}
                    className="mt-3"
                  >
                    <MdDelete className="text-[36px]"></MdDelete>
                  </button>
                )}
                {isLogged && (
                  <button
                    onClick={() => {
                      saveBuild(buildData._id);
                    }}
                    className="mt-3 "
                  >
                    <IoMdUnlock className="text-[36px]"></IoMdUnlock>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center cursor-pointer ">
                  <AiOutlineLike
                    onClick={handleLike}
                    className={`text-[36px] hover:scale-110 transition-all duration-150 ${
                      isLikeLoading ? "cursor-not-allowed" : ""
                    } ${
                      buildData.canReact === false &&
                      buildData.reaction === true
                        ? "text-green-400"
                        : ""
                    }`}
                    disabled={isLikeLoading}
                  />
                  <p>{buildData.likesCount}</p>
                </div>
                <div className="flex flex-col items-center cursor-pointer ">
                  <AiOutlineDislike
                    onClick={handleDislike}
                    className={`text-[36px] hover:scale-110 transition-all duration-150 ${
                      isDislikeLoading ? "cursor-not-allowed" : ""
                    }
                  ${
                    buildData.canReact === false && buildData.reaction === false
                      ? "text-red-400"
                      : ""
                  }`}
                    disabled={isDislikeLoading}
                  />
                  <p>{buildData.dislikesCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex items-center">
              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                  buildData.item1 +
                  ".png"
                }
                height={50}
                width={50}
                alt={buildData.item1}
              />

              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                  buildData.item2 +
                  ".png"
                }
                height={50}
                width={50}
                alt={buildData.item2}
              />

              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                  buildData.item3 +
                  ".png"
                }
                height={50}
                width={50}
                alt={buildData.item3}
              />

              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                  buildData.item4 +
                  ".png"
                }
                height={50}
                width={50}
                alt={buildData.item4}
              />

              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                  buildData.item5 +
                  ".png"
                }
                height={50}
                width={50}
                alt={buildData.item5}
              />

              <Image
                src={
                  "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                  buildData.item6 +
                  ".png"
                }
                height={50}
                width={50}
                alt={buildData.item6}
              />
            </div>
            <TooltipProvider>
              <div className="flex gap-x-12">
                <div className="flex gap-x-2">
                  {runesData &&
                    runesData.map((rune, key) => {
                      if (
                        rune.id.toString() === buildData.keystone1.id.toString()
                      ) {
                        return (
                          <div
                            key={key}
                            className="flex flex-col items-center gap-y-4"
                          >
                            <Image
                              src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                              alt={"test"}
                              width={40}
                              height={40}
                            />

                            <div className="flex flex-col gap-y-4 items-center">
                              {rune.slots.map((slot, slotIndex) => (
                                <div key={slotIndex} className="flex gap-x-3">
                                  {slot.runes.map((rune, runeIndex) => {
                                    const isSelected = buildData.runes1.some(
                                      (selectedRune) =>
                                        selectedRune.id === rune.id
                                    );
                                    return (
                                      <div key={runeIndex}>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <Image
                                              src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                              alt={rune.name}
                                              width={40}
                                              height={40}
                                              className={
                                                isSelected
                                                  ? "opacity-100"
                                                  : "opacity-40"
                                              }
                                            />
                                          </TooltipTrigger>
                                          <TooltipContent className="max-w-[350px]">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: rune.longDesc,
                                              }}
                                            />
                                          </TooltipContent>
                                        </Tooltip>
                                      </div>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>

                <div className="flex gap-x-2">
                  {runesData &&
                    runesData.map((rune, key) => {
                      if (
                        rune.id.toString() === buildData.keystone2.id.toString()
                      ) {
                        return (
                          <div
                            key={key}
                            className="flex flex-col items-center gap-y-4"
                          >
                            <Image
                              src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                              alt={"test"}
                              width={40}
                              height={40}
                            />

                            <div className="flex flex-col gap-y-4 items-center">
                              {rune.slots
                                .filter((_, slotIndex) => slotIndex !== 0)
                                .map((slot, slotIndex) => (
                                  <div key={slotIndex} className="flex gap-x-3">
                                    {slot.runes.map((rune, runeIndex) => {
                                      const isSelected = buildData.runes2.some(
                                        (selectedRune) =>
                                          selectedRune.id === rune.id
                                      );
                                      return (
                                        <div key={runeIndex}>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Image
                                                src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                                                alt={rune.name}
                                                width={40}
                                                height={40}
                                                className={
                                                  isSelected
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                                }
                                              />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[350px]">
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html: rune.longDesc,
                                                }}
                                              />
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>

                <div className="flex flex-col gap-y-2 mt-12">
                  {buildData &&
                    buildData.runes.statShards.map((rune, key) => {
                      return <p key={key}>{rune}</p>;
                    })}
                </div>
              </div>
            </TooltipProvider>
          </div>

          {buildData && <p>{buildData.description}</p>}
        </div>
      ) : (
        <p>No build data</p>
      )}

      <p className="mt-9 text-[48px] font-semibold text-center">Add comment</p>
      <form
        className="flex flex-col items-center text-black"
        onSubmit={(e) => {
          handleCommentSubmit(e, newComment);
        }}
      >
        <textarea
          cols={30}
          rows={6}
          className="px-3 py-1"
          placeholder="Add comment"
          value={newComment}
          onChange={handleCommentChange}
        />
        <button
          type="submit"
          className="border-white border-[1px] px-4 py-1 w-[50%] mt-3 text-white"
        >
          Add comment
        </button>
      </form>
      <p className="text-[36px] mt-5 text-center">Comments</p>
      <div className="flex flex-col gap-y-4 w-[30%] mx-auto">
        {commentsData &&
        Array.isArray(commentsData.content) &&
        commentsData.content.length > 0 ? (
          commentsData.content.map((comment, index) => {
            if (comment.replyingTo === null)
              return (
                <div key={index}>
                  <p className="font-semibold">{comment.username} said </p>
                  <p>{comment._id}</p>
                  <p>{comment.comment}</p>
                  <div className="flex gap-x-3">
                    <p>Likes: {comment.likesCount}</p>
                    <p>Dislikes: {comment.dislikesCount}</p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <AiOutlineLike
                      className="text-[28px] cursor-pointer hover:text-green-500"
                      onClick={() => {
                        leaveReaction({ objectId: comment._id, value: true });
                      }}
                    ></AiOutlineLike>
                    <AiOutlineDislike
                      className="text-[24px] cursor-pointer hover:text-red-500"
                      onClick={() => {
                        leaveReaction({
                          objectId: comment._id,
                          value: false,
                        });
                      }}
                    ></AiOutlineDislike>
                    <MdReply
                      className="text-[24px] cursor-pointer"
                      onClick={() => setShowReplyInput(comment._id)}
                    ></MdReply>
                    {showReplyInput === comment._id && (
                      <form
                        onSubmit={(e) =>
                          handleCommentSubmit(e, newReply, comment._id)
                        }
                        className="mt-2 text-black"
                      >
                        <input
                          type="text"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          className="border p-2"
                          placeholder="Add a comment"
                        />
                        <button
                          type="submit"
                          className="ml-2 p-2 bg-blue-500 text-white"
                        >
                          Submit
                        </button>
                      </form>
                    )}
                  </div>
                  <div>
                    {comment.hasReplies && (
                      <button
                        onClick={() =>
                          setCommentIdToFetch({
                            commentId: comment._id,
                            action: "showMore",
                          })
                        }
                      >
                        Show replies
                      </button>
                    )}

                    {allRepliesData &&
                      allRepliesData.content &&
                      allRepliesData.content.map((reply, key) => {
                        if (reply.replyingTo === comment._id)
                          return (
                            <div key={key} className="ml-5">
                              <p className="font-semibold">
                                {reply.username} replied{" "}
                              </p>
                              <p>{reply.comment}</p>
                              <div className="flex gap-x-3">
                                <p className="">Likes: {reply.likesCount}</p>
                                <p>Dislikes: {reply.dislikesCount}</p>
                              </div>
                              <div className="flex justify-between items-center mt-3">
                                <AiOutlineLike
                                  className="text-[24px] cursor-pointer hover:text-green-500"
                                  onClick={() => {
                                    leaveReaction({
                                      objectId: reply._id,
                                      value: true,
                                    });
                                  }}
                                ></AiOutlineLike>
                                <AiOutlineDislike
                                  className="text-[24px] cursor-pointer hover:text-red-500"
                                  onClick={() => {
                                    leaveReaction({
                                      objectId: reply._id,
                                      value: false,
                                    });
                                  }}
                                ></AiOutlineDislike>
                              </div>
                            </div>
                          );
                      })}
                  </div>
                </div>
              );
          })
        ) : (
          <p className="mt-5">Comment first</p>
        )}
      </div>
    </div>
  );
};

export default BuildDetails;
