import axios from "axios";

const getChampionNameById = async (masteryData) => {
  console.log("masterydata", masteryData);
  const updatedMasteryData = [];

  for (let i = 0; i < masteryData.length; i++) {
    var champId = masteryData[i].championId;
    console.log(masteryData.length);

    const champResponse = await axios.get(
      `http://localhost:8080/ddragon/getChampionId?championId=${champId}`
    );

    console.log(champResponse.data);

    // nadpisanie championId w masteryData nazwa championa zamiast numeru id
    const updatedMasteryItem = {
      ...masteryData[i],
      championId: champResponse.data,
    };

    updatedMasteryData.push(updatedMasteryItem);
  }
  return updatedMasteryData;
};

export default getChampionNameById;
