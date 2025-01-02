import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useRouter } from "next/navigation";
import useAxios from "../../hooks/useAxios";
import getCourses from "../../api/courses/getCourses";
import createCourse from "../../api/courses/createCourse";

const Courses = () => {
  const axiosInstance = useAxios();
  const router = useRouter();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const {
    refetch: refetchCourses,
    data: coursesData,
    error: coursesError,
    isLoading: coursesIsLoading,
  } = useQuery("coursesData", () => getCourses(axiosInstance), {
    refetchOnWindowFocus: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { mutateAsync: createNewCourse } = useMutation(
    (courseData) => createCourse(axiosInstance, courseData),
    {
      onSuccess: (data) => {
        console.log("Course created successfully:", data);
        refetchCourses();
      },
      onError: (error) => {
        console.error("Error creating course:", error);
      },
    }
  );

  const handleSubmit = async (event) => {
    event.preventDefault(); // Zapobiega domyślnemu zachowaniu formularza
    try {
      await createNewCourse(courseData);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="h-screen w-full pt-[100px] flex flex-col items-center">
      <p className="text-xl mb-4">Create a course</p>
      <form
        className="flex flex-col gap-y-2 text-black w-[25%]"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={courseData.title}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={courseData.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={courseData.price}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Create Course
        </button>
      </form>
      <p className="text-2xl font-bold mt-4">Courses</p>
      {coursesData && (
        <div className="mt-4 flex flex-col gap-y-3">
          {coursesData.content.map((course, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-oxford-blue px-12 py-4 gap-x-4 rounded-2xl hover:bg-[#001E34] cursor-pointer"
              onClick={() => router.push(`/courses/preview/${course._id}`)}
            >
              <div className="flex flex-col gap-y-2">
                <p className="text-white text-[32px]">{course.title}</p>
                <p className="text-white">{course.description}</p>
              </div>
              <p className="text-white text-[24px]">{course.price} PLN</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
