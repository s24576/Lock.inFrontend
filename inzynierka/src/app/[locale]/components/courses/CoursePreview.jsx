import React from "react";
import { useQuery } from "react-query";
import { useParams } from "next/navigation";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import getCoursePreviewById from "../../api/courses/getCoursePreviewById";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "../stripe/CheckoutPage";
import Link from "next/link";

const CoursePreview = () => {
  const params = useParams();
  const axiosInstance = useAxiosPublic();

  const {
    refetch: refetchCourse,
    data: courseData,
    error: courseError,
    isLoading: courseIsLoading,
  } = useQuery(
    ["courseData", params.courseId],
    () => getCoursePreviewById(axiosInstance, params.courseId),
    {
      refetchOnWindowFocus: false,
    }
  );

  const public_key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  if (public_key === undefined) {
    throw new Error("Stripe public key is not set");
  }

  const stripePromise = loadStripe(public_key);

  return (
    <div className="min-h-screen w-full pt-[100px] flex flex-col items-center">
      CoursePreview
      {courseData && (
        <div>
          <Link href={"/courses/" + courseData._id}>link to course </Link>
          <h1>title :{courseData.title}</h1>
          <p>description: {courseData.description}</p>
          <p>price: {courseData.price} zł</p>
          <p className="mt-3">films ({courseData.films.length}):</p>
          {courseData.films.map((film, key) => {
            return (
              <div
                key={key}
                className="flex items-center border-[1px] border-white p-2 gap-x-6"
              >
                <p>{film.title}</p>
                <p>is free? {film.free ? "yes" : "no"}</p>
              </div>
            );
          })}
          <Elements stripe={stripePromise}>
            <CheckoutPage courseId={courseData._id}></CheckoutPage>
          </Elements>
        </div>
      )}
    </div>
  );
};

export default CoursePreview;
