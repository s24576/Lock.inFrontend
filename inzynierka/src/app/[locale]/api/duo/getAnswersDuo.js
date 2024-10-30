import axios from "axios";

const getAnswersDuo = async (axiosInstance) => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:8080/api/duo/getAnswersDuo",
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
