export function formatTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp * 1000);
  const diffInSeconds = Math.floor((now - then) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInSeconds < 60) {
    return "less than a minute ago";
  }

  if (diffInMinutes >= 1 && diffInMinutes <= 59) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  if (diffInHours >= 1 && diffInHours <= 23) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  if (diffInDays >= 1 && diffInDays <= 31) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  if (diffInMonths >= 1 && diffInMonths <= 11) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  if (diffInYears >= 1) {
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  }

  return "Invalid date";
}

export const formatTimestampToDateTime = (epochSeconds) => {
  if (!epochSeconds) {
    return null;
  }
  const epochMillis = epochSeconds * 1000;
  const date = new Date(epochMillis);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};
