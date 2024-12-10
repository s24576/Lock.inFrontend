import axios from "axios";

const getCommentsById = async (objectId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/comments/getComments?objectId=${objectId}`,
      {
        headers: {
          // Ustawienie pustego nagłówka Authorization, aby upewnić się, że nie jest dodawany
          "Accept-Language": "en",
        },
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
