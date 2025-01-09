import React, { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../../context/UserContext";
import { useQuery, useMutation } from "react-query";
import getCommentsById from "../../api/comments/getCommentsById";
import getResponsesById from "../../api/comments/getResponsesById";
import getShortProfiles from "../../api/profile/getShortProfiles";
import addComment from "../../api/comments/addComment";
import deleteComment from "../../api/comments/deleteComment";
import react from "../../api/comments/react";
import { useRouter } from "next/navigation";
import useAxios from "../../hooks/useAxios";
import Image from "next/image";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineDelete,
} from "react-icons/ai";
import { BiLike, BiDislike } from "react-icons/bi";
import { MdDelete, MdReply, MdNavigateNext } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { FaExclamation } from "react-icons/fa6";
import Footer from "../Footer";

const CommentsSection = ({ id: objectId }) => {
  const { userData, isLogged } = useContext(UserContext);

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

  const axiosInstance = useAxios();
  const router = useRouter();

  const {
    refetch: refetchComments,
    data: commentsData,
    error: commentsError,
    isLoading: commentsIsLoading,
  } = useQuery(
    ["commentsData", numberOfComments], // Dynamiczny klucz
    () =>
      getCommentsById(
        objectId,
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
    (comment) => addComment(axiosInstance, objectId, comment, showReplyInput),
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
    (commentId) => deleteComment(axiosInstance, commentId),
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

  const { mutateAsync: leaveReaction } = useMutation(
    (data) => react(axiosInstance, data.objectId, data.value),
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

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e, comment) => {
    e.preventDefault();

    console.log("New Comment:", comment);

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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full px-[10%] flex justify-between  mt-8 font-chewy">
        <div className="flex flex-col w-[40%]">
          <p className="py-5 text-[32px]  text-center">Leave comment</p>

          <form
            className="flex flex-col items-center text-black pb-8"
            onSubmit={(e) => {
              handleCommentSubmit(e, newComment);
            }}
          >
            <textarea
              cols={30}
              rows={6}
              className="px-3 py-2 w-[75%] h-[200px] bg-transparent border-[1px] border-white-smoke rounded-xl text-[18px] text-white-smoke"
              placeholder="Add comment..."
              value={newComment}
              onChange={handleCommentChange}
              onFocus={() => setShowReplyInput("")}
            />
            <button
              type="submit"
              className="bg-transparent px-4 py-2 w-[45%] mt-8 rounded-3xl text-white text-[20px] border-[1px] border-white-smoke hover:text-amber duration-150 transition-all hover:border-amber"
            >
              Comment
            </button>
          </form>
        </div>

        <div className="flex flex-col w-[40%] items-center">
          <p className="py-5 text-[36px] text-center">Comments</p>
          <div className="flex flex-col gap-y-8 w-full py-3 ">
            {allCommentsData &&
            Array.isArray(allCommentsData.content) &&
            allCommentsData.content.length > 0 ? (
              allCommentsData.content.map((comment, index) => {
                if (comment.replyingTo === null)
                  return (
                    <div
                      name={comment._id}
                      key={index}
                      className="flex flex-col py-6  w-full"
                    >
                      <div className="flex justify-between gap-x-4 w-full">
                        <Image
                          src="/profilePicture.jpg"
                          width={60}
                          height={60}
                          className="w-[60px] h-[60px] rounded-full object-cover aspect-square border-2 border-silver"
                        />
                        <div className="flex flex-col w-full break-words whitespace-normal">
                          <p className="text-[20px]">@{comment.username}</p>

                          <p className="text-[18px]">{comment.comment}</p>
                          <div className="flex items-center gap-x-2 mt-3">
                            <div
                              className={
                                comment.reaction === true &&
                                comment.canReact === false
                                  ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                                  : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                              }
                            >
                              <BiLike
                                onClick={() => {
                                  leaveReaction({
                                    objectId: comment._id,
                                    value: true,
                                  });
                                }}
                                className="cursor-pointer"
                              ></BiLike>
                              <p className="text-[20px]">
                                {comment.likesCount}
                              </p>
                            </div>

                            <div
                              className={
                                comment.reaction === false &&
                                comment.canReact === false
                                  ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                                  : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                              }
                            >
                              <BiDislike
                                onClick={() => {
                                  leaveReaction({
                                    objectId: comment._id,
                                    value: false,
                                  });
                                }}
                                className="cursor-pointer"
                              ></BiDislike>
                              <p className="text-[20px]">
                                {comment.dislikesCount}
                              </p>
                            </div>
                            <div className="flex justify-between items-center px-2">
                              <p
                                className="text-[20px] cursor-pointer hover:text-amber duration-150 transition-all"
                                onClick={() => setShowReplyInput(comment._id)}
                              >
                                Reply
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          {userData.username === comment.username && (
                            <AiOutlineDelete
                              onClick={() => deleteCommentMutation(comment._id)}
                              className="text-[24px] cursor-pointer hover:text-amber duration-150 transition-all"
                            />
                          )}
                          {isLogged && (
                            <FaExclamation className="text-[24px] cursor-pointer hover:text-amber duration-150 transition-all" />
                          )}
                        </div>
                      </div>
                      {showReplyInput === comment._id && (
                        <form
                          onSubmit={(e) => {
                            handleCommentSubmit(e, newReply, comment._id);
                            setCommentIdToFetch({ commentId: comment._id });
                          }}
                          className="pt-4 text-black flex flex-col items-center justify-between pl-[76px] "
                        >
                          <textarea
                            rows={3}
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            className="border p-2 w-full bg-transparent rounded-md text-white-smoke"
                            placeholder="Add a comment"
                          />
                          <button
                            type="submit"
                            className="w-[40%] mt-4 p-2 bg-transparent text-white-smoke rounded-3xl border-[1px] border-white-smoke hover:text-amber duration-150 transition-all hover:border-amber"
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
                                <div className="flex justify-between gap-x-4 w-full mt-10 pl-[76px]">
                                  <Image
                                    src="/profilePicture.jpg"
                                    width={60}
                                    height={60}
                                    className="w-[60px] h-[60px] rounded-full object-cover aspect-square border-2 border-silver"
                                  />
                                  <div className="flex flex-col w-full break-words whitespace-normal">
                                    <p className="text-[20px]">
                                      @{reply.username}
                                    </p>

                                    <p className="text-[18px]">
                                      {reply.comment}
                                    </p>
                                    <div className="flex items-center gap-x-2 mt-3">
                                      <div
                                        className={
                                          reply.reaction === true &&
                                          reply.canReact === false
                                            ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                                            : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                                        }
                                      >
                                        <BiLike
                                          onClick={() => {
                                            leaveReaction({
                                              objectId: reply._id,
                                              value: true,
                                            });
                                          }}
                                          className="cursor-pointer"
                                        ></BiLike>
                                        <p className="text-[20px]">
                                          {reply.likesCount}
                                        </p>
                                      </div>

                                      <div
                                        className={
                                          reply.reaction === false &&
                                          reply.canReact === false
                                            ? "flex items-center gap-x-1 text-[28px]  text-amber hover:text-white-smoke duration-100 transition-colors"
                                            : "flex items-center gap-x-1 text-[28px]  hover:text-amber duration-100 transition-colors"
                                        }
                                      >
                                        <BiDislike
                                          onClick={() => {
                                            leaveReaction({
                                              objectId: reply._id,
                                              value: false,
                                            });
                                          }}
                                          className="cursor-pointer"
                                        ></BiDislike>
                                        <p className="text-[20px]">
                                          {reply.dislikesCount}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    {userData.username === reply.username && (
                                      <AiOutlineDelete
                                        onClick={() =>
                                          deleteCommentMutation(reply._id)
                                        }
                                        className="text-[24px] cursor-pointer hover:text-amber duration-150 transition-all"
                                      />
                                    )}
                                    {isLogged && (
                                      <FaExclamation className="text-[24px] cursor-pointer hover:text-amber duration-150 transition-all" />
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
                            className="flex items-center mt-5 pl-[76px] py-1 rounded-md hover:text-amber duration-150 transition-all"
                          >
                            Show replies
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
      <div className="mt-[5%]">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default CommentsSection;
