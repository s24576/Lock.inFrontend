const respondAnswerDuo = async (axiosIstance, answerId, action) => {
  console.log(action);
  try {
    const response = await axiosIstance.post(
      `http://localhost:8080/api/duo/respondAnswerDuo?answerId=${answerId}&action=${action}`
    );
    console.log("answer duo result", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error answering duo invite");
  }
};

export default respondAnswerDuo;
