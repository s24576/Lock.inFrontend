const createDuo = async (api, formData) => {
  console.log("formData: ", formData);

  const data = {
    puuid: formData.puuid,
    positions: formData.positions,
    minRank: formData.minRank + " " + formData.minRankDivision,
    maxRank: formData.maxRank + " " + formData.maxRankDivision,
    languages: formData.languages,
    championIds: formData.championIds,
  };

  console.log("zmielona data: ", data);

  try {
    const response = await api.post(`/api/team/createDuo`, data);
    console.log("claimed accounts for duo: ", response.data);
    return response.data; // Zwracamy dane
  } catch (error) {
    console.log("Error fetching riot profiles:", error);
    throw new Error("Error fetching riot profiles"); // Rzucamy błąd, aby React Query mógł go obsłużyć
  }
};

export default createDuo;
