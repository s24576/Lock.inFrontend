const answerDuo = async (axiosIstance, puuid, duoId) => {
  try {
    const response = await axiosIstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duo/answerDuo?duoId=${duoId}`,
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
