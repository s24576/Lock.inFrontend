import axios from "axios";

const getDuoById = async (language, duoId) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duo/getDuoById?duoId=${duoId}`,
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
