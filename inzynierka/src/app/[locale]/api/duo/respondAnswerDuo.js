const respondAnswerDuo = async (axiosIstance, answerId, action) => {
  try {
    const response = await axiosIstance.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/duo/respondAnswerDuo?answerId=${answerId}&action=${action}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default respondAnswerDuo;
