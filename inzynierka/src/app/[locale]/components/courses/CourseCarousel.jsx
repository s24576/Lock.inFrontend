import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRegDotCircle,
  FaRegCircle,
} from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { BiLike, BiDislike } from "react-icons/bi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "../stripe/CheckoutPage";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const CourseCarousel = ({ previews, shortProfiles: shortProfilesData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isLogged } = useContext(UserContext);
  const { t } = useTranslation();

  const handlePrevClick = () => {
    setActiveIndex(activeIndex === 0 ? previews.length - 1 : activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex === previews.length - 1 ? 0 : activeIndex + 1);
  };

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  //Stripe
  const public_key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  if (public_key === undefined) {
    throw new Error("Stripe public key is not set");
  }
  const stripePromise = loadStripe(public_key);

  return (
    <div className="relative w-[45%] mt-[7%] border-[1px] border-amber rounded-xl mb-[5%] overflow-hidden">
      <div
        className="relative flex  w-full transition-transform duration-500 ease-in-out h-full"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {previews.map((preview, key) => {
          return (
            <div
              key={key}
              className="relative w-full h-full flex-shrink-0"
              style={{
                backgroundImage: preview?.data?.picture
                  ? `url(${preview.data.picture})`
                  : "",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col justify-center  h-full px-[20%] bg-night bg-opacity-60 z-30">
                <p className="text-[64px] font-bangers text-white">
                  {preview?.data?.title}
                </p>
                <div className="flex items-center gap-x-3">
                  {shortProfilesData?.[preview?.data?.username]?.image ? (
                    <img
                      src={getImageSrc(
                        shortProfilesData?.[preview?.data?.username]?.image
                      )}
                      className=" mt-1 w-[60px] h-[60px] object-cover border-2 border-white-smoke rounded-full align-middle"
                    />
                  ) : (
                    <div className="h-[60px] w-[60px] border-2 border-white-smoke rounded-full flex items-center justify-center">
                      <FaUser className="text-silver text-[32px]"></FaUser>
                    </div>
                  )}
                  <div className="flex flex-col text-[20px] font-chewy">
                    <p>{t("courses:by")}</p>
                    <p>{preview?.data?.username}</p>
                  </div>
                </div>
                <p className="text-[24px] mt-3 font-chewy text-white">
                  {preview?.data?.description?.length > 150
                    ? preview?.data?.description?.slice(0, 150) + "..."
                    : preview?.data?.description}
                </p>
                <div className="flex flex-col gap-y-1 mt-4 p-4  font-chewy rounded-xl">
                  <p className="text-[18px]">{t("courses:courseContent")}</p>
                  {preview?.data?.films.slice(0, 5).map((film, key) => {
                    return (
                      <div key={key} className="flex gap-x-2 items-center">
                        <p>{key + 1}.</p>
                        <p>{film.title}</p>
                      </div>
                    );
                  })}
                  {preview?.data?.films.length > 5 && (
                    <p className="mt-2">{t("courses:andMore")}</p>
                  )}
                  {preview?.data?.films.length === 0 && (
                    <p className="mt-2">{t("courses:noVideos")}</p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-8 font-chewy">
                  <div className="flex items-center gap-x-4 ml-1">
                    <div
                      className={
                        preview?.data?.reaction === true &&
                        preview?.data?.canReact === false
                          ? "flex items-center gap-x-1 text-[28px]  text-amber "
                          : "flex items-center gap-x-1 text-[28px]  "
                      }
                    >
                      <BiLike></BiLike>
                      <p className="text-[20px]">{preview?.data?.likesCount}</p>
                    </div>
                    <div
                      className={
                        preview?.data?.reaction === false &&
                        preview?.data?.canReact === false
                          ? "flex items-center gap-x-1 text-[28px]  text-amber "
                          : "flex items-center gap-x-1 text-[28px]  "
                      }
                    >
                      <BiDislike></BiDislike>
                      <p className="text-[20px]">
                        {preview?.data?.dislikesCount}
                      </p>
                    </div>
                  </div>
                  {isLogged ? (
                    preview?.data?.owned === false ? (
                      <Elements stripe={stripePromise}>
                        <CheckoutPage course={preview?.data}></CheckoutPage>
                      </Elements>
                    ) : (
                      <Link
                        href={"/courses/" + preview?.data?._id}
                        className="hover:text-amber duration-150 transition-all text-[18px]"
                      >
                        {t("courses:goToCourse")}
                      </Link>
                    )
                  ) : (
                    <p className="text-[20px] text-white">
                      {t("courses:loginToAccess")}
                    </p>
                  )}
                </div>
                <FaArrowLeft
                  onClick={handlePrevClick}
                  className="absolute ml-[3%] left-2 top-1/2 transform -translate-y-1/2 text-[36px] cursor-pointer hover:text-amber duration-150 transition-all"
                />
                <FaArrowRight
                  onClick={handleNextClick}
                  className="absolute mr-[3%] right-2 top-1/2 transform -translate-y-1/2 text-[36px] cursor-pointer hover:text-amber duration-150 transition-all"
                />
                <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 flex gap-x-2">
                  {previews.map((_, index) =>
                    activeIndex === index ? (
                      <FaRegDotCircle key={index} className="text-[20px]" />
                    ) : (
                      <FaRegCircle
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className="text-[18px] cursor-pointer"
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseCarousel;
