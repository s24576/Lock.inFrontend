import axios from "axios";

const getQueues = async () => {
  let queues = "";

  try {
    const response = await axios.get(
      `http://localhost:8080/ddragon/getQueueList`
    );
    queues = response.data;
  } catch (error) {
    console.log(error);
  }
  console.log("queues", queues);
  return queues;
};

export default getQueues;
