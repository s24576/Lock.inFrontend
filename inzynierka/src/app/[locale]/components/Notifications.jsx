import React, { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { IoNotifications } from "react-icons/io5";
import getNotifications from "../api/profile/getNotifications";
import useAxios from "../hooks/useAxios";
import { useQuery } from "react-query";
import { formatTimeAgo, formatTimestampToDateTime } from "@/lib/formatTimeAgo";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";

const Notifications = () => {
  const { userData } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const axiosInstance = useAxios();

  const [stompClient, setStompClient] = useState(null);

  const {
    refetch: notificationsRefetch,
    data: notificationsData,
    isLoading: notificationsIsLoading,
  } = useQuery("getNotifications", () => getNotifications(axiosInstance), {
    refetchOnWindowFocus: false,
    cacheTime: 0,
    staleTime: 0,
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {},
      onConnect: () => {
        //nasluchiwanie do wiadomosci
        client.subscribe(
          `/user/${userData.username}/messenger/message`,
          (message) => {
            const parsed = JSON.parse(message.body);
            console.log(parsed);
            toast.custom(
              (t) => (
                <div className="bg-night border-[1px] border-amber rounded-3xl p-4 text-white-smoke w-[300px] font-dekko flex flex-col">
                  <div className="flex items-center justify-between gap-x-2 px-4">
                    <h1 className="px-[10px]">New message</h1>
                    <button onClick={() => toast.dismiss(t)}>Close</button>
                  </div>
                  <div className="flex items-start gap-x-2 px-4 mt-2 w-full">
                    <p className="pl-[10px] text-[20px] min-w-[30%]">
                      {parsed.userId}:
                    </p>
                    <p>
                      {parsed.message.length > 50
                        ? `${parsed.message.slice(0, 50)}...`
                        : parsed.message}
                    </p>
                  </div>
                </div>
              ),
              {
                duration: 10000,
                position: "top-right",
              }
            );
            notificationsRefetch();
          }
        );

        //nasluchiwanie do powiadomienia
        client.subscribe(
          `/user/${userData.username}/notification`,
          (message) => {
            console.log("Notification: ", message.body);
            toast.custom(
              (t) => (
                <div className="bg-night border-[1px] border-amber rounded-3xl p-4 text-white-smoke w-[300px] font-dekko flex flex-col">
                  <div className="flex items-center justify-between gap-x-2 px-4">
                    <h1 className="px-[10px]">Notification</h1>
                    <button onClick={() => toast.dismiss(t)}>Close</button>
                  </div>
                  <div className="flex items-start gap-x-2 px-4 mt-2 w-full">
                    <p className="pl-[10px]">
                      {message.body.length > 50
                        ? `${message.body.slice(0, 50)}...`
                        : message.body}
                    </p>
                  </div>
                </div>
              ),
              {
                duration: 10000,
                position: "top-right",
              }
            );
            notificationsRefetch();
          }
        );

        //nasluchiwanie do tworzenia chatow itp
        client.subscribe(
          `/user/${userData.username}/messenger/members/`,
          (message) => {
            toast.custom(
              (t) => (
                <div className="bg-night border-[1px] border-amber rounded-3xl p-4 text-white-smoke w-[300px] font-dekko flex flex-col">
                  <div className="flex items-center justify-between gap-x-2 px-4">
                    <h1 className="px-[10px]">Messenger</h1>
                    <button onClick={() => toast.dismiss(t)}>Close</button>
                  </div>
                  <div className="flex items-start gap-x-2 px-4 mt-2 w-full">
                    <p className="pl-[10px]">
                      {message.body.length > 50
                        ? `${message.body.slice(0, 50)}...`
                        : message.body}
                    </p>
                  </div>
                </div>
              ),
              {
                duration: 10000,
                position: "top-right",
              }
            );
            notificationsRefetch();
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP Error: ", frame.headers["message"]);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [userData]);

  return (
    <div className="relative" ref={buttonRef}>
      <IoNotifications
        className="text-[28px] cursor-pointer hover:text-silver transition-colors duration-150"
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-[400px] bg-night border border-amber rounded-xl shadow-lg font-dekko"
        >
          {notificationsData?.content
            ?.sort((a, b) => b.timestamp - a.timestamp)
            ?.map((notification, key) => {
              const isLastElement =
                key === notificationsData.content.length - 1;
              return (
                <div
                  key={key}
                  className={`p-2 ${
                    !isLastElement ? "border-b border-amber" : ""
                  } flex items-center gap-x-4`}
                >
                  <p className="w-[30%] text-[14px]">
                    {formatTimestampToDateTime(notification?.timestamp)}
                  </p>
                  <p className="w-[70%] text-[16px]">{notification.value}</p>
                </div>
              );
            })}
          {notificationsData?.content?.length === 0 && (
            <div
              key={key}
              className={`p-2 ${
                !isLastElement ? "border-b border-amber" : ""
              } hover:bg-amber hover:text-night transition-colors rounded-xl duration-150 flex items-center gap-x-4`}
            >
              <p className="w-[100%] text-[16px]">You have no notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
