import React, { useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { useMutation } from "react-query";
import createCourse from "../../api/courses/createCourse";
import useAxios from "../../hooks/useAxios";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componentsShad/ui/dialog";

const CourseCreate = () => {
  const [videoToShow, setVideoToShow] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: 0,
    picture: "",
  });
  const [newVideo, setNewVideo] = useState({
    title: "",
    link: "",
  });
  const axiosInstance = useAxios();
  const router = useRouter();

  const addVideo = (e) => {
    e.preventDefault();
    const videoIdMatch = newVideo.link.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : newVideo.link;
    setFormValues((prev) => ({
      ...prev,
      videos: [...prev.videos, { ...newVideo, link: videoId }],
    }));
    setNewVideo({ title: "", link: "" }); // Reset pola po dodaniu
  };

  const { mutateAsync: handleCreateCourse } = useMutation(
    () => createCourse(axiosInstance, formValues),
    {
      onSuccess: (data) => {
        console.log("course created successfully:", data);
        router.push("/courses/my");
      },
      onError: (error) => {
        console.error("Error creating course:", error);
      },
    }
  );

  const submitCourse = async (e) => {
    e.preventDefault();
    setFormValues({ title: "", description: "", price: 0, picture: "" });
    await handleCreateCourse();
  };

  return (
    <div className="w-full min-h-screen bg-night pt-[7%] px-[5%] flex justify-between gap-x-6 font-chewy">
      <div className="w-[35%] h-[80vh] border-[1px] border-white-smoke rounded-xl overflow-hidden flex items-center justify-center bg-[#131313]">
        {formValues?.picture ? (
          <img
            src={formValues.picture}
            alt="Course Preview"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")} // Ukrycie obrazka, gdy link jest niepoprawny
          />
        ) : (
          <div className="flex items-center w-full">
            <MdAddPhotoAlternate className="text-[96px] w-[30%]" />
            <p className="text-[40px] w-[70%]">
              Paste URL to see your course preview
            </p>
          </div>
        )}
      </div>
      <div className="w-[55%]">
        <form onSubmit={submitCourse} className="w-full flex flex-col">
          <div className="flex items-center justify-between w-full">
            <input
              className="w-[60%] bg-transparent p-3 text-[20px] border-silver border-[1px] rounded-xl focus:border-amber focus:outline-none placeholder-white-smoke-left"
              placeholder="Course title"
              type="text"
              value={formValues.title}
              onChange={(e) =>
                setFormValues((prev) => {
                  return {
                    ...prev,
                    title: e.target.value,
                  };
                })
              }
            />
            <input
              className="w-[30%] bg-transparent p-3 text-[20px] border-silver border-[1px] rounded-xl focus:outline-none  appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-amber"
              placeholder="Price (PLN)"
              type="number"
              value={formValues.price}
              onChange={(e) =>
                setFormValues((prev) => {
                  return {
                    ...prev,
                    price: e.target.value,
                  };
                })
              }
            />
          </div>
          <textarea
            className="mt-[3%] w-full bg-transparent rounded-xl p-4 text-[18px] border-[1px] border-silver focus:outline-none focus:border-amber placeholder-white-smoke-left"
            placeholder="Course description"
            rows={5}
            value={formValues.description}
            onChange={(e) =>
              setFormValues((prev) => {
                return {
                  ...prev,
                  description: e.target.value,
                };
              })
            }
          ></textarea>
          <input
            type="text"
            placeholder="Paste image URL"
            value={formValues.picture}
            onChange={(e) =>
              setFormValues((prev) => {
                return {
                  ...prev,
                  picture: e.target.value,
                };
              })
            }
            className="mt-[2%] bg-transparent p-3 text-[20px] border-silver border-[1px] rounded-xl focus:outline-none focus:border-amber placeholder-white-smoke-left"
          />
          <p className="mt-[4%] text-[32px] ml-1">Videos</p>
          <p className="mt-[2%] ml-1 text-[20px]">
            Create course first to add videos
          </p>

          <button
            type="submit"
            className="w-[20%] border-amber border-[1px] rounded-xl text-white-smoke mt-[5%] px-6 py-2 text-[20px] mx-auto bg-transparent hover:bg-silver-hover transition-all duration-150"
          >
            Publish course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseCreate;
