const respondAnswerDuo = async (axiosIstance, answerId, action) => {
  try {
    const response = await axiosIstance.post(
      `http://localhost:8080/api/duo/respondAnswerDuo?answerId=${answerId}&action=${action}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default respondAnswerDuo;
