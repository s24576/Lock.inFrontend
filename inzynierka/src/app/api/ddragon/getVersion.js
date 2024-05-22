import axios from "axios";

const getVersion = async () => {
  let version = "";

  try {
    const response = await axios.get(
      `http://localhost:8080/ddragon/getVersion`
    );
    version = response.data;
  } catch (error) {
    console.log(error);
  }

  return version;
};

export default getVersion;
