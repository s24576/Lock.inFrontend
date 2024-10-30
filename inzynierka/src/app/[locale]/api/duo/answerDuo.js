const answerDuo = async (axiosIstance, puuid, duoId) => {
  console.log(puuid);
  try {
    const response = await axiosIstance.post(
      `http://localhost:8080/api/duo/answerDuo?duoId=${duoId}`,
      {
        puuid: puuid,
      }
    );
    console.log("answer duo", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error answering duo");
  }
};

export default answerDuo;
