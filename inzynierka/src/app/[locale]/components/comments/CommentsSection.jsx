import React, { useState, useContext } from "react";
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
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { MdDelete, MdReply, MdNavigateNext } from "react-icons/md";

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
                        {isLogged && userData.username === comment.username && (
                          <MdDelete
                            className="text-[24px] mt-3 cursor-pointer hover:text-amber"
                            onClick={() => deleteCommentMutation(comment._id)}
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
  );
};

export default CommentsSection;
