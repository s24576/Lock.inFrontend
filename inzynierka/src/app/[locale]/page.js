import Mainpage from "./components/Mainpage";
import Footer from "./components/Footer";
import initTranslations from "./i18n";
import TranslationsProvider from "./components/TranslationsProvider";

const i18nNamespaces = ["mainpage", "common"];

export default async function Home({ params: { locale } }) {
  return (
    <main className="flex h-screen flex-col">
      <Mainpage></Mainpage>
      <Footer></Footer>
    </main>
  );
}
