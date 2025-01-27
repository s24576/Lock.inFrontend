import Mainpage from "./components/Mainpage";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <main className="flex h-screen flex-col">
      <Mainpage></Mainpage>
      <Footer></Footer>
    </main>
  );
}
