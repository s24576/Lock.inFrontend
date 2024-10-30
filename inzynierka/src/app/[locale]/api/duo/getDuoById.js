import axios from "axios";

const getDuoById = async (language, duoId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/duo/getDuoById?duoId=${duoId}`,
      {
        headers: {
          // Ustawienie pustego nagłówka Authorization, aby upewnić się, że nie jest dodawany
          "Accept-Language": language,
        },
      }
    );
    console.log("duo by id:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching duos");
  }
};

export default getDuoById;
