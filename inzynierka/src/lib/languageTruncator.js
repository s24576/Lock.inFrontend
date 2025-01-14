export default function languageTruncator(language) {
  switch (language) {
    case "Polish":
      return "PL";
    case "English":
      return "EN";
    case "Spanish":
      return "ES";
    case "French":
      return "FR";
    case "German":
      return "DE";
    case "Japanese":
      return "JP";
    case "Korean":
      return "KR";
    case "Chinese":
      return "CN";
    case "Other":
      return "Other";

    default:
      return;
  }
}
