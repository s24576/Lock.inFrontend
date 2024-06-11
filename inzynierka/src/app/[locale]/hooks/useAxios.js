import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const baseURL = "http://localhost:8080";

const useAxios = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAxios must be used within a UserContextProvider");
  }

  const { userData, setUserData } = context;
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${localStorage.getItem("loginToken")}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwtDecode(localStorage.getItem("loginToken"));
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    console.log("token przed wysłaniem", localStorage.getItem("loginToken"));

    const response = await axios.post(
      `${baseURL}/user/refreshToken`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("loginToken")}`,
        },
      }
    );

    localStorage.setItem("loginToken", response.data);

    console.log("token1", response.data);
    console.log("token2", userData.token);
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
