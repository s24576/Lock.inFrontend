import axios from "axios";

const getDuos = async (language) => {
  try {
    const response = await axios.get("http://localhost:8080/api/team/getDuos", {
      headers: {
        // Ustawienie pustego nagłówka Authorization, aby upewnić się, że nie jest dodawany
        "Accept-Language": language,
      },
    });
    console.log("duos", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching duos");
  }
};

export default getDuos;
