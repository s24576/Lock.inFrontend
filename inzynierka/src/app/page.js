import Image from "next/image";
import Mainpage from "./components/Mainpage";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between">
      <Mainpage></Mainpage>
    </main>
  );
}
