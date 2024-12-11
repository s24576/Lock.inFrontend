import axios from "axios";

const getResponsesById = async (commentId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/comments/getResponses?commentId=${commentId}`,
      {
        headers: {
          // Ustawienie pustego nagłówka Authorization, aby upewnić się, że nie jest dodawany
          "Accept-Language": "en",
        },
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
