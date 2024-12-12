import axios from "axios";

const getResponsesById = async (commentId, token) => {
  try {
    const headers = {
      "Accept-Language": "en",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
      `http://localhost:8080/comments/getResponses?commentId=${commentId}`,
      {
        headers,
      }
    );
    console.log("repliues:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching replies");
  }
};

export default getResponsesById;
