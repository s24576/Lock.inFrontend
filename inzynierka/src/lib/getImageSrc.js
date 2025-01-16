export const getImageSrc = (image) => {
  if (image && image.data) {
    return `data:${image.contentType};base64,${image.data}`;
  }
  return null;
};
