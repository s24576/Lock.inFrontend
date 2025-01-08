const getBuilds = async (axiosInstance, page, author, championId) => {
  const size = 15;

  if (page === undefined) {
    page = 0;
  }

  console.log("page", page);
  console.log("author", author);
  console.log("championId", championId);

  try {
    // Budowanie URL-a dynamicznie
    let url = `/build/getBuilds?size=${size}&page=${page}`;

    if (author && author.trim() !== "") {
      url += `&author=${encodeURIComponent(author)}`;
    }

    if (championId && championId.trim() !== "") {
      url += `&championId=${encodeURIComponent(championId)}`;
    }

    const response = await axiosInstance.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default getBuilds;
