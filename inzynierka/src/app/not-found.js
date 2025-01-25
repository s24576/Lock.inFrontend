"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const langRegex = /^\/([a-z]{2})\//;
  const langMatch = pathname.match(langRegex);
  const language = langMatch ? langMatch[1] : "en";

  const texts = {
    en: {
      pageNotFound: "Page not found",
      returnHome: "Return to home page",
    },
    pl: {
      pageNotFound: "Strona nie została znaleziona",
      returnHome: "Wróć do strony głównej",
    },
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        backgroundColor: "#131313",
        color: "#F5F5F5",
        border: "none",
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      <h2
        style={{
          fontSize: "96px",
          fontFamily: "Bangers, sans-serif",
          color: "#F5B800",
          margin: 0
        }}
      >
        404
      </h2>
      <p
        style={{
          fontSize: "32px",
          fontFamily: "Chewy, sans-serif",
          margin: 0
        }}
      >
        {texts[language].pageNotFound}
      </p>
      <Link
        href={`/${language}`}
        style={{
          fontSize: "24px",
          fontFamily: "Chewy, sans-serif",
          transition: "color 100ms",
          cursor: "pointer",
          textDecoration: "none",
          color: "#F5F5F5"
        }}
        onMouseEnter={(e) => (e.target.style.color = "#F5B800")}
        onMouseLeave={(e) => (e.target.style.color = "#F5F5F5")}
      >
        {texts[language].returnHome}
      </Link>
    </div>
  );
}
