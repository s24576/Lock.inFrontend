import axios from "axios";

const getDuoById = async (language, duoId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/duo/getDuoById?duoId=${duoId}`,
      {
        headers: {
          "Accept-Language": language,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getDuoById;
