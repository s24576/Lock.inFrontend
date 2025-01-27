import axios from "axios";

const getVersion = async (language) => {
  let version = "";

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ddragon/getVersion`,
      {
        headers: {
          "Accept-Language": language,
        },
      }
    );
    version = response.data;
  } catch (error) {
    console.log(error);
  }

  return version;
};

export default getVersion;
