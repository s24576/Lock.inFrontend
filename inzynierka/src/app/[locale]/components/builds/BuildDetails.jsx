"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import useAxios from "../../hooks/useAxios";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { IoMdUnlock, IoMdLock } from "react-icons/io";
import { MdDelete, MdReply, MdNavigateNext } from "react-icons/md";
import { useQuery, useMutation } from "react-query";
import getRunes from "../../api/ddragon/getRunes";
import getCommentsById from "../../api/comments/getCommentsById";
import getResponsesById from "../../api/comments/getResponsesById";
import getShortProfiles from "../../api/profile/getShortProfiles";
import addComment from "../../api/comments/addComment";
import deleteComment from "../../api/comments/deleteComment";
import deleteBuild from "../../api/builds/deleteBuild";
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

  //dane wszystkich komentarzy
  const [allCommentsData, setAllCommentsData] = useState({
    content: [],
    page: {},
  });
  //ustawia na id komentarza do ktorego fetchowane beda odpowiedzi
  const [commentIdToFetch, setCommentIdToFetch] = useState({
    commentId: "",
    action: "",
  });
  //dane wszystkich replyow
  const [allRepliesData, setAllRepliesData] = useState({
    content: [],
    page: {},
  });
  const [newReply, setNewReply] = useState("");
  //ustawia na id komentarza do ktorego odpowiada
  const [showReplyInput, setShowReplyInput] = useState("");

  const [numberOfComments, setNumberOfComments] = useState(5);
  const [numberOfReplies, setNumberOfReplies] = useState(5);

  const params = useParams();
  const pathname = usePathname();
  const api = useAxios();
  const router = useRouter();

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
  } = useQuery(
    ["commentsData", numberOfComments], // Dynamiczny klucz
    () =>
      getCommentsById(
        params.buildId,
        sessionStorage.getItem("loginToken"),
        numberOfComments
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!numberOfComments,
      onSuccess: (data) => {
        setAllCommentsData((prev) => {
          const prevContent = prev?.content || [];

          const newContent = data.content.reduce((acc, newItem) => {
            const existingItem = prevContent.find(
              (item) => item._id === newItem._id
            );

            if (existingItem) {
              if (
                existingItem.likesCount !== newItem.likesCount ||
                existingItem.dislikesCount !== newItem.dislikesCount ||
                existingItem.canReact !== newItem.canReact || // Sprawdź zmianę w canReact
                existingItem.reaction !== newItem.reaction // Sprawdź zmianę w reaction
              ) {
                acc.push({
                  ...existingItem,
                  likesCount: newItem.likesCount,
                  dislikesCount: newItem.dislikesCount,
                  canReact: newItem.canReact, // Aktualizuj canReact
                  reaction: newItem.reaction, // Aktualizuj reaction
                });
              } else {
                acc.push(existingItem);
              }
            } else {
              acc.push(newItem);
            }

            return acc;
          }, []);

          return {
            ...prev,
            content: newContent,
            page: { ...prev.page, ...data.page }, // Aktualizacja obiektu page
          };
        });
      },
    }
  );

  //number of coments refetch przy zmianie tej wartosci

  const {
    refetch: refetchReplies,
    data: repliesData,
    error: repliesError,
    isLoading: repliesIsLoading,
  } = useQuery(
    ["repliesData", commentIdToFetch.commentId],
    () =>
      getResponsesById(
        commentIdToFetch.commentId,
        sessionStorage.getItem("loginToken")
      ),
    {
      enabled: !!commentIdToFetch.commentId,
      refetchOnWindowFocus: false,
      onSuccess: (newData) => {
        setAllRepliesData((prevData) => {
          const prevContent = prevData?.content || [];

          const newContent = newData.content.reduce((acc, newItem) => {
            const existingItem = prevContent.find(
              (item) => item._id === newItem._id
            );

            if (existingItem) {
              if (
                existingItem.likesCount !== newItem.likesCount ||
                existingItem.dislikesCount !== newItem.dislikesCount ||
                existingItem.canReact !== newItem.canReact || // Sprawdź zmianę w canReact
                existingItem.reaction !== newItem.reaction // Sprawdź zmianę w reaction
              ) {
                acc.push({
                  ...existingItem,
                  likesCount: newItem.likesCount,
                  dislikesCount: newItem.dislikesCount,
                  canReact: newItem.canReact, // Aktualizuj canReact
                  reaction: newItem.reaction, // Aktualizuj reaction
                });
              } else {
                acc.push(existingItem);
              }
            } else {
              acc.push(newItem);
            }

            return acc;
          }, []);

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

        refetchComments();
        //data musi zwracac id komentarza a nie reply
        refetchReplies();
      },
      onError: (error) => {
        console.error("Error creating comment:", error);
      },
    }
  );

  const { mutateAsync: deleteCommentMutation } = useMutation(
    (commentId) => deleteComment(api, commentId),
    {
      onSuccess: () => {
        console.log("comment deleted:");
        refetchComments();
        refetchReplies();
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
      },
    }
  );

  const { mutateAsync: deleteBuildMutation } = useMutation(
    (buildId) => deleteBuild(api, buildId),
    {
      onSuccess: () => {
        console.log("build deleted:");
        router.push("/builds");
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
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
        fetchBuild();
      },
      onError: (error) => {
        console.error("Error creating reaction:", error);
      },
    }
  );

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

  useEffect(() => {
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

  const saveBuild = async (buildId) => {
    try {
      const response = await api.put(`/build/saveBuild?buildId=${buildId}`);
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
          <div className="relative flex w-full px-[10%] pt-[250px] items-center justify-between bg-no-repeat pb-[40px]">
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${buildData.championId}_0.jpg')`,
                opacity: 0.5, // Zmniejszenie przezroczystości tła
                pointerEvents: "none",
              }}
            ></div>
            <div className="flex items-center relative z-10">
              <Image
                src={"/profilePicture.jpg"}
                width={200}
                height={200}
                alt={buildData.championId}
                className="w-[200px] h-[200px] rounded-full object-cover aspect-square border-2 border-silver "
              />

              <div className="flex flex-col gap-y-2 ml-6">
                <p className="text-[32px]">{buildData.title}</p>
                <p className="text-[28px]">by {buildData.username}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-y-2 z-10 opacity-100">
              <div className="flex">
                {isLogged && ( //do zmiany isLogged na usera
                  <button
                    onClick={() => {
                      deleteBuildMutation(buildData._id);
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
                    {buildData.saved ? (
                      <IoMdLock className="text-[36px] " />
                    ) : (
                      <IoMdUnlock className="text-[36px]" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center cursor-pointer ">
                  <AiOutlineLike
                    onClick={() =>
                      leaveReaction({ objectId: buildData._id, value: true })
                    }
                    className={
                      buildData.reaction === true &&
                      buildData.canReact === false
                        ? "text-[36px] cursor-pointer text-green-500"
                        : "text-[36px] cursor-pointer hover:text-green-500"
                    }
                  />
                  <p>{buildData.likesCount}</p>
                </div>
                <div className="flex flex-col items-center cursor-pointer ">
                  <AiOutlineDislike
                    onClick={() =>
                      leaveReaction({ objectId: buildData._id, value: false })
                    }
                    className={
                      buildData.reaction === false &&
                      buildData.canReact === false
                        ? "text-[36px] cursor-pointer text-red-500"
                        : "text-[36px] cursor-pointer hover:text-red-500"
                    }
                  />
                  <p>{buildData.dislikesCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full px-[10%] pt-[60px] justify-between">
            <div className="flex flex-col px-8 pb-8 pt-4 rounded-lg w-[70%]">
              <p className="text-[24px] pb-4">Items</p>
              <div className="flex items-center ">
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    buildData.item1 +
                    ".png"
                  }
                  height={75}
                  width={75}
                  alt={buildData.item1}
                />
                <MdNavigateNext className="text-[36px]"></MdNavigateNext>
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    buildData.item2 +
                    ".png"
                  }
                  height={75}
                  width={75}
                  alt={buildData.item2}
                />
                <MdNavigateNext className="text-[36px]"></MdNavigateNext>
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    buildData.item3 +
                    ".png"
                  }
                  height={75}
                  width={75}
                  alt={buildData.item3}
                />
                <MdNavigateNext className="text-[36px]"></MdNavigateNext>
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    buildData.item4 +
                    ".png"
                  }
                  height={75}
                  width={75}
                  alt={buildData.item4}
                />
                <MdNavigateNext className="text-[36px]"></MdNavigateNext>
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    buildData.item5 +
                    ".png"
                  }
                  height={75}
                  width={75}
                  alt={buildData.item5}
                />
                <MdNavigateNext className="text-[36px]"></MdNavigateNext>
                <Image
                  src={
                    "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                    buildData.item6 +
                    ".png"
                  }
                  height={75}
                  width={75}
                  alt={buildData.item6}
                />
              </div>
            </div>
            <div className="pt-4 px-8 pb-8 w-[30%]">
              <p className="text-[24px]">Description</p>
              {buildData && <p className="">{buildData.description}</p>}
            </div>
          </div>

          <TooltipProvider>
            <div className="flex x-12 w-full px-[10%]">
              <div className="flex flex-col">
                <p className="text-[24px] pb-4 px-8">Runes</p>
                <div className="flex">
                  <div className="flex gap-x-2 px-8 pb-8 pt-4">
                    {runesData &&
                      runesData.map((rune, key) => {
                        if (
                          rune.id.toString() ===
                          buildData.keystone1.id.toString()
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

                  <div className="flex gap-x-2 px-8 pb-8 pt-4">
                    {runesData &&
                      runesData.map((rune, key) => {
                        if (
                          rune.id.toString() ===
                          buildData.keystone2.id.toString()
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
                                    <div
                                      key={slotIndex}
                                      className="flex gap-x-3"
                                    >
                                      {slot.runes.map((rune, runeIndex) => {
                                        const isSelected =
                                          buildData.runes2.some(
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
              </div>
            </div>
          </TooltipProvider>
        </div>
      ) : (
        <p>No build data</p>
      )}

      <div className="w-[80%] flex  mx-auto border-t-2 border-t-silver mt-8">
        <div className="flex flex-col w-[40%]">
          <p className="py-5 text-[36px] font-semibold text-center">
            Leave comment
          </p>

          <form
            className="flex flex-col items-center text-black pb-8"
            onSubmit={(e) => {
              handleCommentSubmit(e, newComment);
            }}
          >
            <textarea
              cols={30}
              rows={6}
              className="px-3 py-2 w-[75%] h-[200px] border-[1px] border-black"
              placeholder="Add comment"
              value={newComment}
              onChange={handleCommentChange}
              onFocus={() => setShowReplyInput("")}
            />
            <button
              type="submit"
              className="bg-[#f5b800] text-[#131313] px-4 py-2 w-[45%] mt-5 rounded-md font-semibold "
            >
              Add comment
            </button>
          </form>
        </div>

        <div className="flex flex-col w-[60%] items-center">
          <p className="py-5 text-[36px] font-semibold text-center">Comments</p>
          <div className="flex flex-col gap-y-8 mx-auto py-3 ">
            {allCommentsData &&
            Array.isArray(allCommentsData.content) &&
            allCommentsData.content.length > 0 ? (
              allCommentsData.content.map((comment, index) => {
                if (comment.replyingTo === null)
                  return (
                    <div
                      name={comment._id}
                      key={index}
                      className="flex flex-col py-6 border-b-2 border-b-silver "
                    >
                      <div className="flex justify-between gap-x-4">
                        <Image
                          src="/profilePicture.jpg"
                          width={60}
                          height={60}
                          className="w-[60px] h-[60px] rounded-full object-cover aspect-square border-2 border-silver"
                        />
                        <div className="flex flex-col w-[320px] break-words whitespace-normal">
                          <p className="font-semibold">
                            {comment.username} said{" "}
                          </p>

                          <p className="">{comment.comment}</p>
                        </div>

                        <div className="flex items-center gap-x-2">
                          <div className="flex flex-col items-center gap-y-1">
                            <p className="">{comment.likesCount}</p>
                            <AiOutlineLike
                              className={
                                comment.reaction === true &&
                                comment.canReact === false
                                  ? "text-[28px] cursor-pointer text-green-500"
                                  : "text-[28px] cursor-pointer hover:text-green-500"
                              }
                              onClick={() => {
                                leaveReaction({
                                  objectId: comment._id,
                                  value: true,
                                });
                              }}
                            ></AiOutlineLike>
                          </div>

                          <div className="flex flex-col items-center gap-y-1">
                            <p>{comment.dislikesCount}</p>
                            <AiOutlineDislike
                              className={
                                comment.reaction === false &&
                                comment.canReact === false
                                  ? "text-[28px] cursor-pointer text-red-500"
                                  : "text-[28px] cursor-pointer hover:text-red-500"
                              }
                              onClick={() => {
                                leaveReaction({
                                  objectId: comment._id,
                                  value: false,
                                });
                              }}
                            ></AiOutlineDislike>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <MdReply
                              className="text-[24px] cursor-pointer hover:text-amber"
                              onClick={() => setShowReplyInput(comment._id)}
                            ></MdReply>
                          </div>
                          {isLogged &&
                            userData.username === comment.username && (
                              <MdDelete
                                className="text-[24px] mt-3 cursor-pointer hover:text-amber"
                                onClick={() =>
                                  deleteCommentMutation(comment._id)
                                }
                              ></MdDelete>
                            )}
                        </div>
                      </div>
                      {showReplyInput === comment._id && (
                        <form
                          onSubmit={(e) => {
                            handleCommentSubmit(e, newReply, comment._id);
                            setCommentIdToFetch({ commentId: comment._id });
                          }}
                          className="pt-4 text-black flex justify-between w-full "
                        >
                          <input
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            className="border p-2 w-full"
                            placeholder="Add a comment"
                          />
                          <button
                            type="submit"
                            className="ml-2 p-2 bg-amber text-night rounded-md font-semibold"
                          >
                            Submit
                          </button>
                        </form>
                      )}
                      <div className="flex flex-col">
                        {allRepliesData &&
                          allRepliesData.content &&
                          allRepliesData.content.map((reply, key) => {
                            if (reply.replyingTo === comment._id)
                              return (
                                <div
                                  key={key}
                                  className="flex justify-between gap-x-4 py-8 ml-8"
                                >
                                  <Image
                                    src="/profilePicture.jpg"
                                    alt="test"
                                    width={60}
                                    height={60}
                                    className="w-[60px] h-[60px] rounded-full object-cover aspect-square border-2 border-silver"
                                  />
                                  <div className="flex flex-col w-[320px] break-words whitespace-normal">
                                    <p className="font-semibold">
                                      {reply.username} said{" "}
                                    </p>

                                    <p className="">{reply.comment}</p>
                                  </div>

                                  <div className="flex items-center gap-x-2">
                                    <div className="flex flex-col items-center gap-y-1">
                                      <p className="">{reply.likesCount}</p>
                                      <AiOutlineLike
                                        className={
                                          reply.reaction === true &&
                                          reply.canReact === false
                                            ? "text-[28px] cursor-pointer text-green-500"
                                            : "text-[28px] cursor-pointer hover:text-green-500"
                                        }
                                        onClick={() => {
                                          leaveReaction({
                                            objectId: reply._id,
                                            value: true,
                                          });
                                        }}
                                      ></AiOutlineLike>
                                    </div>

                                    <div className="flex flex-col items-center gap-y-1">
                                      <p>{reply.dislikesCount}</p>

                                      <AiOutlineDislike
                                        className={
                                          reply.reaction === false &&
                                          reply.canReact === false
                                            ? "text-[28px] cursor-pointer text-red-500"
                                            : "text-[28px] cursor-pointer hover:text-red-500"
                                        }
                                        onClick={() => {
                                          leaveReaction({
                                            objectId: reply._id,
                                            value: false,
                                          });
                                        }}
                                      ></AiOutlineDislike>
                                    </div>

                                    {isLogged &&
                                      userData.username === reply.username && (
                                        <MdDelete
                                          className="text-[24px] mt-3 cursor-pointer hover:text-amber"
                                          onClick={() =>
                                            deleteCommentMutation(reply._id)
                                          }
                                        ></MdDelete>
                                      )}
                                  </div>
                                </div>
                              );
                          })}

                        {comment.replyCount >
                        allRepliesData.content.filter(
                          (reply) => reply.replyingTo === comment._id
                        ).length ? (
                          <button
                            onClick={() => {
                              setCommentIdToFetch({
                                commentId: comment._id,
                                action: "showMore",
                              });

                              //refetch + size
                            }}
                            className="flex items-center mt-5 px-6 py-1 font-semibold rounded-md"
                          >
                            <MdNavigateNext className="text-[24px]"></MdNavigateNext>
                            Show more replies
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  );
              })
            ) : (
              <p className="mt-5">Comment first</p>
            )}
          </div>
          {allCommentsData.page.totalElements >
            allCommentsData.content.length && (
            <p
              className="w-[30%] text-center font-semibold mt-3 px-6 py-2 bg-amber text-night rounded-md cursor-pointer"
              onClick={() => {
                console.log("increasing comments");
                setNumberOfComments(numberOfComments + 5);
              }}
            >
              Show more comments
            </p>
          )}
        </div>
      </div>
      <div className="h-[200px]"></div>
    </div>
  );
};

export default BuildDetails;
