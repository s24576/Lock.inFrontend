import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useMutation } from "react-query";
import createCourse from "../../api/courses/createCourse";
import useAxios from "../../hooks/useAxios";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const CourseCreate = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: 0,
    picture: "",
  });

  const [validationError, setValidationError] = useState("");
  const axiosInstance = useAxios();
  const router = useRouter();
  const { isLogged } = useContext(UserContext);
  const { t } = useTranslation();

  const { mutateAsync: handleCreateCourse } = useMutation(
    () => createCourse(axiosInstance, formValues),
    {
      onSuccess: (data) => {
        router.push("/courses/my");
      },
      onError: (error) => {
        console.error("Error creating course:", error);
        setValidationError(t("courses:submitError"));
      },
    }
  );

  const validateForm = () => {
    if (!formValues.title.trim()) {
      setValidationError(t("courses:titleRequired"));
      return false;
    }
    if (formValues.title.length < 3) {
      setValidationError(t("courses:titleTooShort"));
      return false;
    }
    if (formValues.title.length > 50) {
      setValidationError(t("courses:titleTooLong"));
      return false;
    }

    if (!formValues.description.trim()) {
      setValidationError(t("courses:descriptionRequired"));
      return false;
    }
    if (formValues.description.length < 10) {
      setValidationError(t("courses:descriptionTooShort"));
      return false;
    }
    if (formValues.description.length > 1000) {
      setValidationError(t("courses:descriptionTooLong"));
      return false;
    }

    if (formValues.price < 0) {
      setValidationError(t("courses:invalidPrice"));
      return false;
    }

    if (!formValues.picture.trim()) {
      setValidationError(t("courses:pictureRequired"));
      return false;
    }
    const urlPattern = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)(?:[?#].*)?$/i;
    if (!urlPattern.test(formValues.picture)) {
      setValidationError(t("courses:invalidImageUrl"));
      return false;
    }

    return true;
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!validateForm()) {
      return;
    }

    try {
      await handleCreateCourse();
      setFormValues({ title: "", description: "", price: 0, picture: "" });
    } catch (error) {
      console.error("Error submitting course:", error);
    }
  };

  if (isLogged === false) {
    router.push("/");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night font-dekko">
        <p className="text-amber text-[40px] animate-pulse ">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged) {
    return (
      <div className="w-full min-h-screen bg-night pt-[7%] px-[5%] flex justify-between gap-x-6 font-dekko">
        <div className="w-[35%] h-[80vh] border-[1px] border-white-smoke rounded-xl overflow-hidden flex items-center justify-center bg-[#131313]">
          {formValues?.picture ? (
            <img
              src={formValues.picture}
              alt="Course Preview"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="flex items-center w-full">
              <MdAddPhotoAlternate className="text-[96px] w-[30%]" />
              <p className="text-[40px] w-[70%]">{t("courses:pasteURL")}</p>
            </div>
          )}
        </div>
        <div className="w-[55%]">
          <form onSubmit={submitCourse} className="w-full flex flex-col">
            <div className="flex items-center justify-between w-full">
              <input
                className="w-[60%] bg-transparent p-3 text-[20px] border-silver border-[1px] rounded-xl focus:border-amber focus:outline-none placeholder-white-smoke-left"
                placeholder={t("courses:courseTitle")}
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
                placeholder={t("courses:price")}
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
              placeholder={t("courses:courseDescription")}
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
              placeholder={t("courses:pasteImageURL")}
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
            <p className="mt-[4%] text-[32px] ml-1">{t("courses:videos")}</p>
            <p className="mt-[2%] ml-1 text-[20px]">
              {t("courses:createCourseFirst")}
            </p>

            <button
              type="submit"
              className="w-[20%] border-white-smoke border-[1px] rounded-xl text-white-smoke mt-[5%] px-6 py-2 text-[20px] mx-auto bg-transparent hover:bg-silver-hover transition-all duration-150"
            >
              {t("courses:publishCourse")}
            </button>
            {validationError && (
              <p className="text-amber text-center mt-4 mb-2">
                {validationError}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }
};

export default CourseCreate;
