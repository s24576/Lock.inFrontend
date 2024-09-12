"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const BuildDetails = () => {
  const { userData, isLogged } = useContext(UserContext);

  const [buildData, setBuildData] = useState({});
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);

  const params = useParams();
  const pathname = usePathname();
  const api = useAxios();

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    console.log(newComment);

    try {
      const response = await axios.post(
        `http://localhost:8080/build/addComment`,
        {
          buildId: params.buildId,
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log(response.data);
      // Optionally, update the build data to include the new comment
    } catch (error) {
      console.log(error);
    }

    setNewComment("");
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
    <div className="h-screen w-full flex justify-center text-white">
      <div className="flex flex-col items-center">
        <p className="mt-[115px]">Build details</p>

        {Object.keys(buildData).length > 0 ? (
          <div className="flex flex-col items-center">
            <Image
              src={
                "https://ddragon.leagueoflegends.com/cdn/" +
                "14.11.1" +
                "/img/champion/" +
                buildData.championId +
                ".png"
              }
              width={200}
              height={200}
              alt={buildData.championId}
            />
            {isLogged && ( //do zmiany isLogged na usera
              <button
                onClick={() => {
                  deleteBuild(buildData._id);
                }}
                className="mt-3 text-red-600 px-3 py-2 border-[1px] border-white hover:bg-red-500 hover:text-white"
              >
                Delete build
              </button>
            )}
            {isLogged && (
              <button
                onClick={() => {
                  saveBuild(buildData._id);
                }}
                className="mt-3 text-green-600 px-3 py-2 border-[1px] border-white hover:bg-green-500 hover:text-white"
              >
                Save build
              </button>
            )}
            <p>Author: {buildData.username}</p>
            <p className="text-[32px]">Title: {buildData.title}</p>
            <p>Description: {buildData.description}</p>
            <div className="flex">
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
            <div className="flex items-center justify-center gap-x-4">
              <div className="flex flex-col items-center cursor-pointer ">
                <AiOutlineLike
                  onClick={handleLike}
                  className={`text-[42px] hover:scale-110 transition-all duration-150 ${
                    isLikeLoading ? "cursor-not-allowed" : ""
                  } ${
                    buildData.canReact === false && buildData.reaction === true
                      ? "text-green-400"
                      : ""
                  }`}
                  disabled={isLikeLoading}
                />
                <p>Upvotes: {buildData.likesCount}</p>
              </div>
              <div className="flex flex-col items-center cursor-pointer ">
                <AiOutlineDislike
                  onClick={handleDislike}
                  className={`text-[42px] hover:scale-110 transition-all duration-150 ${
                    isDislikeLoading ? "cursor-not-allowed" : ""
                  }
                  ${
                    buildData.canReact === false && buildData.reaction === false
                      ? "text-red-400"
                      : ""
                  }`}
                  disabled={isDislikeLoading}
                />
                <p>Downvotes: {buildData.dislikesCount}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No build data</p>
        )}

        <p className="mt-9 text-[48px] font-semibold">Add comment</p>
        <form
          className="flex flex-col items-center text-black"
          onSubmit={handleCommentSubmit}
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
        <p className="text-[36px] mt-5">Comments</p>
        <div className="flex flex-col">
          {Array.isArray(comments.content) && comments.content.length > 0 ? (
            comments.content.map((comment, index) => {
              return (
                <div key={index}>
                  <p>{comment.author}</p>
                  <p>{comment.comment}</p>
                  <p>Upvotes: {comment.upVotes}</p>
                  <p>Downvotes: {comment.downVotes}</p>
                </div>
              );
            })
          ) : (
            <p className="mt-5">Comment first</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildDetails;
