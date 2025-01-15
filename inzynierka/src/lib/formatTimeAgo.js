export function formatTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp * 1000); // Przekształcamy timestamp z sekund do milisekund
  const diffInSeconds = Math.floor((now - then) / 1000); // Różnica w sekundach
  const diffInMinutes = Math.floor(diffInSeconds / 60); // Różnica w minutach
  const diffInHours = Math.floor(diffInMinutes / 60); // Różnica w godzinach
  const diffInDays = Math.floor(diffInHours / 24); // Różnica w dniach
  const diffInMonths = Math.floor(diffInDays / 30); // Różnica w miesiącach (średnia liczba dni w miesiącu)
  const diffInYears = Math.floor(diffInMonths / 12); // Różnica w latach

  // Mniej niż minuta
  if (diffInSeconds < 60) {
    return "less than a minute ago";
  }

  // 1-59 minut temu
  if (diffInMinutes >= 1 && diffInMinutes <= 59) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  // 1-23 godziny temu
  if (diffInHours >= 1 && diffInHours <= 23) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  // 1-28/30/31 dni temu
  if (diffInDays >= 1 && diffInDays <= 31) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // 1-11 miesięcy temu
  if (diffInMonths >= 1 && diffInMonths <= 11) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  // 1+ lat temu
  if (diffInYears >= 1) {
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  }

  return "Invalid date"; // W przypadku nieznanej daty
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
