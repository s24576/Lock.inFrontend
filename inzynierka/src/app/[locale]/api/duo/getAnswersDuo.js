import axios from "axios";

const getAnswersDuo = async (axiosInstance, page) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }
  try {
    const response = await axiosInstance.get(
      `http://localhost:8080/api/duo/getAnswersDuo?page=${page}&size=${size}`,
      {}
    );
    console.log("duo invites: ", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching duo invites");
  }
};

export default getAnswersDuo;
