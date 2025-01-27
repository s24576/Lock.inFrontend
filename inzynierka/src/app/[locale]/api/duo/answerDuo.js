const answerDuo = async (axiosIstance, puuid, duoId) => {
  try {
    const response = await axiosIstance.post(
      `http://localhost:8080/api/duo/answerDuo?duoId=${duoId}`,
      {
        puuid: puuid,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default answerDuo;
