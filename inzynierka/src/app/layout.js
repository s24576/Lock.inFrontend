import "@fontsource/bangers";
import "@fontsource/chewy";
import "./[locale]/globals.css";

export const metadata = {
  title: "404 - Lock.in",
  description: "Page not found",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
} 