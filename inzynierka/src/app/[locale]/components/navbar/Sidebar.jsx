import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/componentsShad/ui/sheet";
import { RxHamburgerMenu } from "react-icons/rx";

const Sidebar = () => {
  const { setUserData, setIsLogged, setDuoSettings } = useContext(UserContext);
  const router = useRouter();

  const logout = () => {
    sessionStorage.removeItem("loginToken");
    setUserData({});
    setDuoSettings({});
    setIsLogged(false);
    router.push("/");
  };

  return (
    <Sheet>
      <SheetTrigger>
        <RxHamburgerMenu className="text-[28px] text-[#F5B800]"></RxHamburgerMenu>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="bg-[#131313] text-[#f5f5f5] border-r-[1px] border-r-[#f5f5f5]"
      >
        <SheetHeader>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/builds">Builds</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/builds/create">Create build</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/builds/me">My Builds</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/builds/saved">Saved Builds</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/duo">Duo</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/duo/invites">Duo invites</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/courses">Courses</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/courses/my">My Courses</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/user/my-reports">My Reports</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] ">
            <Link href="/adminPanel">Admin</Link>
          </SheetClose>
          <SheetClose asChild className="hover:text-[#f5b800] cursor-pointer">
            <p onClick={() => logout()}>Sign out</p>
          </SheetClose>

          <SheetDescription className="hidden">description</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
