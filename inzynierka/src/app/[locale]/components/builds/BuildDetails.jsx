"use client";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const BuildDetails = () => {
  const { userData } = useContext(UserContext);

  const [buildData, setBuildData] = useState({});
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/build/getBuildById?buildId=${params.buildId}`
        );
        console.log(response.data);
        setBuildData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/build/getComments?buildId=${params.buildId}`
        );
        console.log(response.data);
        setComments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBuild();
    fetchComments();
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    console.log(newComment);

    try {
      const response = await axios.post(
        `http://localhost:8080/build/addComment`, // Adjust this URL based on your backend endpoint
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

    // Clear the textarea after submission
    setNewComment("");
  };

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
            <p>Author: {buildData.author}</p>
            <p className="text-[32px]">Title: {buildData.title}</p>
            <p>Description: {buildData.description}</p>
            <div className="flex justify-center">
              {buildData.items.map((item, key) => {
                return (
                  <Image
                    src={
                      "https://ddragon.leagueoflegends.com/cdn/14.11.1/img/item/" +
                      item +
                      ".png"
                    }
                    height={50}
                    width={50}
                    alt={item}
                    key={key}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <div className="flex flex-col items-center cursor-pointer ">
                <AiOutlineLike className="text-[42px] hover:scale-110 transition-all duration-150"></AiOutlineLike>
                <p>Upvotes: {buildData.upVotes}</p>
              </div>
              <div className="flex flex-col items-center cursor-pointer ">
                <AiOutlineDislike className="text-[42px] hover:scale-110 transition-all duration-150"></AiOutlineDislike>
                <p>Downvotes: {buildData.downVotes}</p>
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
