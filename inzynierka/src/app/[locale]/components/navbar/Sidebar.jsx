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
import { RISwordFill, RITeamFill } from "@icongo/ri";
import { FaEdit, FaRegHeart, FaRegEnvelope, FaUserAlt } from "react-icons/fa";
import { FaList, FaBookOpen, FaDoorOpen } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoCopyOutline, IoGameControllerOutline } from "react-icons/io5";

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
        className="bg-[#131313] text-white-smoke border-r-[1px] border-r-white-smoke"
      >
        <SheetHeader>
          <SheetTitle className="hidden">sidebar</SheetTitle>
          <div className="flex items-center gap-x-1">
            <RISwordFill fill="#f5f5f5" className="text-[28px]"></RISwordFill>
            <p className="text-[28px] font-bangers ">Builds</p>
          </div>
          <div className="flex flex-col gap-y-2 font-bangers text-[20px] ml-[8%]">
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/builds" className="flex items-center gap-x-[7px]">
                <FaList></FaList>
                <p>All Builds</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/builds/create" className="flex items-center gap-x-1">
                <FaEdit></FaEdit>
                <p>Create build</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/builds/me" className="flex items-center gap-x-1">
                <FaRegHeart></FaRegHeart>
                <p>My builds</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/builds/saved" className="flex items-center gap-x-1">
                <IoCopyOutline></IoCopyOutline>
                <p>Saved builds</p>
              </Link>
            </SheetClose>
          </div>
          <div className="flex items-center gap-x-1">
            <RITeamFill fill="#f5f5f5" className="text-[28px]"></RITeamFill>
            <p className="text-[28px] font-bangers pt-2">Team Up</p>
          </div>
          <div className="flex flex-col gap-y-2 font-bangers text-[20px] ml-[8%]">
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/duo" className="flex items-center gap-x-[6px]">
                <IoGameControllerOutline> </IoGameControllerOutline>
                <p>Find duo</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/duo/invites" className="flex items-center gap-x-1">
                <FaRegEnvelope></FaRegEnvelope>
                <p>Duo invites</p>
              </Link>
            </SheetClose>
          </div>
          <div className="flex items-center gap-x-[6px]">
            <FaBookOpen className="text-[28px] mt-2"></FaBookOpen>
            <p className="text-[28px] font-bangers pt-2">Courses</p>
          </div>
          <div className="flex flex-col gap-y-2 font-bangers text-[20px] ml-[8%]">
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/courses" className="flex items-center gap-x-[7px]">
                <FaList></FaList>
                <p>All courses</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link
                href="/courses/create"
                className="flex items-center gap-x-1"
              >
                <FaEdit></FaEdit>
                <p>Create course</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/courses/my" className="flex items-center gap-x-1">
                <FaRegHeart></FaRegHeart>
                <p>My courses</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link href="/courses/owned" className="flex items-center gap-x-1">
                <IoCopyOutline></IoCopyOutline>
                <p>Owned courses</p>
              </Link>
            </SheetClose>
          </div>
          <div className="flex items-center gap-x-[6px]">
            <FaUserAlt className="text-[28px] mt-2"></FaUserAlt>
            <p className="text-[28px] font-bangers pt-3">User</p>
          </div>
          <div className="flex flex-col gap-y-2 font-bangers text-[20px] ml-[8%]">
            <SheetClose asChild className="hover:text-[#f5b800]">
              <Link
                href="/account/settings"
                className="flex items-center gap-x-[6px]"
              >
                <IoMdSettings> </IoMdSettings>
                <p>Settings</p>
              </Link>
            </SheetClose>
            <SheetClose asChild className="hover:text-[#f5b800]">
              <div
                onClick={() => logout()}
                className="flex items-center gap-x-1 text-[20px] cursor-pointer"
              >
                <FaDoorOpen></FaDoorOpen>
                <p>Sign out</p>
              </div>
            </SheetClose>
          </div>
          <SheetDescription className="hidden">description</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
