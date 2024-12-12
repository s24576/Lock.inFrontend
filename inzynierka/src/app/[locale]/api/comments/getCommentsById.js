import axios from "axios";

const getCommentsById = async (objectId, token, size) => {
  console.log(token);
  console.log("size,", size);

  try {
    const headers = {
      "Accept-Language": "en",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.get(
      `http://localhost:8080/comments/getComments?objectId=${objectId}&size=${size}`,
      {
        headers,
      }
    );
    console.log("comments:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching comments");
  }
};

export default getCommentsById;
