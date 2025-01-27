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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/getResponses?commentId=${commentId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getResponsesById;
