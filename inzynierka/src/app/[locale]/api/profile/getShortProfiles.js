import axios from "axios";

const getShortProfiles = async (profiles) => {
  console.log("profiles", profiles);
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/profile/getShortProfiles",
  //       {
  //         usernames: profiles, // Przekaż tablicę puuids jako element body
  //       },
  //       {
  //         headers: {
  //           "Accept-Language": "en",
  //         },
  //       }
  //     );
  //     console.log("short profiles", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Error fetching short profiles");
  //   }
};

export default getShortProfiles;
