const createDuo = async (api, formData) => {
  const data = {
    puuid: formData.puuid,
    positions: formData.positions,
    lookedPositions: formData.lookedPositions,
    minRank: formData.minRank,
    maxRank: formData.maxRank,
    languages: formData.languages,
    championIds: formData.championIds,
  };

  try {
    const response = await api.post(`/api/duo/createDuo`, data);
    return response.data;
  } catch (error) {
    console.log("Error fetching riot profiles:", error);
  }
};

export default createDuo;
