import axios from "axios";

const getCommentsById = async (objectId, token, size) => {
  try {
    const headers = {
      "Accept-Language": "en",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/getComments?objectId=${objectId}&size=${size}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getCommentsById;
