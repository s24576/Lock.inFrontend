"use client";
import React from "react";
import Link from "next/link";
import { BiSolidLock } from "react-icons/bi";
import { FaDiscord, FaRegCopyright } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className=" bg-night flex flex-col gap-y-10 pt-[80px]">
      <div className=" mx-[8%] pt-8 border-t-2 border-white-smoke flex justify-center  gap-x-[10%] text-white-smoke">
        <Link
          href="/"
          className="flex h-5 hover:text-amber transition-colors duration-100"
        >
          {/* <RILock2Fill fill="#f5b800" className="text-[40px]"></RILock2Fill> */}
          <BiSolidLock className="text-[40px]"></BiSolidLock>
          <p className="text-[32px] pt-[1px] font-bangers">Lock.in</p>
        </Link>

        <div className="flex flex-col gap-y-3">
          <p className="text-[32px] font-bangers">Menu</p>
          <div className="flex flex-col gap-y-1 font-dekko text-[16px]">
            <Link
              href="/builds"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:builds")}
            </Link>
            <Link
              href="/courses"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:courses")}
            </Link>
            <Link
              href="/duo"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:team-up")}
            </Link>
            <Link
              href="/login"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:signIn")}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <p className="text-[32px] font-bangers">{t("footer:apps")}</p>
          <div className="flex flex-col gap-y-1 font-dekko text-[16px]">
            <Link
              href="/builds"
              className="hover:text-amber transition-colors duration-100 "
            >
              Lock.in Mobile
            </Link>
            <Link
              href="/courses"
              className="hover:text-amber transition-colors duration-100 "
            >
              Lock.in Desktop
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <p className="text-[32px] font-bangers">{t("footer:resources")}</p>
          <div className="flex flex-col gap-y-1 font-dekko text-[16px]">
            <Link
              href="/builds"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:privacy-policy")}
            </Link>
            <Link
              href="/courses"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:TOS")}
            </Link>
            <Link
              href="/courses"
              className="hover:text-amber transition-colors duration-100 "
            >
              {t("footer:riot")}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <p className="text-[32px] font-bangers">{t("footer:contact")}</p>
          <div className="flex flex-col gap-y-1 font-dekko text-[16px]">
            <Link
              href="/builds"
              className="flex items-center gap-x-1 hover:text-amber transition-colors duration-100 "
            >
              <FaDiscord className="text-[20px]"></FaDiscord>
              <p>Discord</p>
            </Link>
            <Link
              href="/builds"
              className="flex items-center gap-x-1 hover:text-amber transition-colors duration-100 "
            >
              <FaXTwitter className="text-[20px]"></FaXTwitter>
              <p>X</p>
            </Link>
            <Link
              href="/builds"
              className="flex items-center gap-x-1 hover:text-amber transition-colors duration-100 "
            >
              <MdOutlineEmail className="text-[20px]"></MdOutlineEmail>
              <p>lockincontact@gmail.com</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-center text-white-smoke text-[16px] py-4">
        <div className="flex items-center justify-center gap-x-1 font-dekko">
          <FaRegCopyright className="text-[18px]"></FaRegCopyright>
          <p className="">{t("footer:clause1")}</p>
        </div>

        <div className="flex items-center justify-center gap-x-1 font-dekko">
          <p className="">{t("footer:clause2")}</p>
          <FaRegCopyright className="text-[18px]"></FaRegCopyright>
        </div>
      </div>
    </div>
  );
};

export default Footer;
