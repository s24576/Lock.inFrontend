const getBuilds = async (axiosInstance, page, author, championId) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }

  try {
    let url = `/build/getBuilds?size=${size}&page=${page}`;

    if (author && author.trim() !== "") {
      url += `&author=${encodeURIComponent(author)}`;
    }

    if (championId && championId.trim() !== "") {
      url += `&championId=${encodeURIComponent(championId)}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getBuilds;
