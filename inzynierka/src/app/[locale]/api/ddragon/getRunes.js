import axios from "axios";

const getRunes = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ddragon/getRunes`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getRunes;
