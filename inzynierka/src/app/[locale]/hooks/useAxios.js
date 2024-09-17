import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { usePathname } from "next/navigation";

const baseURL = "http://localhost:8080";

const useAxios = () => {
  const context = useContext(UserContext);
  const pathname = usePathname();

  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  if (!context) {
    throw new Error("useAxios must be used within a UserContextProvider");
  }

  const { userData, setUserData } = context;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("loginToken") : null;

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${token}`, "Accept-Language": language },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(localStorage.getItem("loginToken"));
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    console.log("token po wymianie: ", token);

    if (!isExpired) return req;

    const response = await axios.post(
      `${baseURL}/user/refreshToken`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
          "Accept-Language": language,
        },
      }
    );

    localStorage.setItem("loginToken", response.data);

    setUserData((prevData) => ({
      ...prevData,
      token: response.data,
    }));

    req.headers.Authorization = `Bearer ${response.data}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;
