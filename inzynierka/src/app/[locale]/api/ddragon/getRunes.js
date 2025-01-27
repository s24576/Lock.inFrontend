import axios from "axios";

const getRunes = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/ddragon/getRunes`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getRunes;
