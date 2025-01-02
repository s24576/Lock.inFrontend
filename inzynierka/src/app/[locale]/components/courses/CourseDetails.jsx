import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "next/navigation";
import useAxios from "../../hooks/useAxios";
import getCourseById from "../../api/courses/getCourseById";
import addFilm from "../../api/courses/addFilm";

const CourseDetails = () => {
  const axiosInstance = useAxios();
  const params = useParams();

  const [filmData, setFilmData] = useState({
    title: "",
    description: "",
    link: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilmData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const {
    refetch: refetchCourse,
    data: courseDetailsData,
    error: courseError,
    isLoading: courseIsLoading,
  } = useQuery(
    ["courseDetailsData", params.courseId],
    () => getCourseById(axiosInstance, params.courseId),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: addNewFilm } = useMutation(
    (filmData) => addFilm(axiosInstance, filmData, courseData._id),
    {
      onSuccess: (data) => {
        console.log("Film created successfully:", data);
        refetchCourse();
      },
      onError: (error) => {
        console.error("Error creating film:", error);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault(); // Zapobiega domyślnemu zachowaniu formularza
    try {
      await addNewFilm(filmData);
      setFilmData({ title: "", description: "", link: "" });
    } catch (error) {
      console.error("Error creating film:", error);
    }
  };

  return (
    <div className="min-h-screen w-full pt-[100px] flex justify-center">
      <div className="flex flex-col items-center w-[50%]">
        <p>Course details</p>
        {courseDetailsData && (
          <div className="mt-6 flex flex-col">
            <p className="text-[32px]">{courseDetailsData.title}</p>
            <div className="flex justify-between items-center gap-x-6">
              <p>{courseDetailsData.description}</p>
              <p className="text-[24px]">{courseDetailsData.price} PLN</p>
            </div>

            <p className="text-[28px]">Episodes:</p>
            <form
              className="flex flex-col gap-y-2 text-black min-w-[800px]"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={filmData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={filmData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="link"
                placeholder="Link"
                value={filmData.link}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                Add Film
              </button>
            </form>
            {courseDetailsData &&
              courseDetailsData.films.length > 0 &&
              courseDetailsData.films.map((film) => {
                return (
                  <div className="mt-8">
                    <p className="text-[36px]">{film.title}</p>
                    <p>{film.description}</p>
                    <iframe
                      width="540"
                      height="360"
                      src={`https://www.youtube.com/embed/${film.link}`}
                      title="ARTETA ZMIENIA SIĘ W MOURINHO? Czy Arsenal dalej jest faworytem przeciwko Chelsea? | Trybuna fanów"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                    ></iframe>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
