const createDuo = async (api, formData) => {
  console.log("formData: ", formData);

  const data = {
    puuid: formData.puuid,
    positions: formData.positions,
    lookedPositions: formData.lookedPositions,
    minRank: formData.minRank,
    maxRank: formData.maxRank,
    languages: formData.languages,
    championIds: formData.championIds,
  };

  console.log("zmielona data: ", data);

  try {
    const response = await api.post(`/api/duo/createDuo`, data);
    console.log("claimed accounts for duo: ", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching riot profiles:", error);
    throw new Error("Error fetching riot profiles");
  }
};

export default createDuo;
