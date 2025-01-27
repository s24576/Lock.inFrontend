"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useMutation } from "react-query";
import useAxios from "../hooks/useAxios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/componentsShad/ui/dialog";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FaEdit, FaReply } from "react-icons/fa";
import { FaUser, FaPlus, FaDoorOpen } from "react-icons/fa6";
import { AiOutlineDelete, AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { MdPersonAdd } from "react-icons/md";
import getChats from "../api/messenger/getChats";
import getShortProfiles from "../api/profile/getShortProfiles";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import getChatById from "../api/messenger/getChatById";
import getMessages from "../api/messenger/getMessages";
import sendMessage from "../api/messenger/sendMessage";
import createChat from "../api/messenger/createChat";
import leaveChat from "../api/messenger/leaveChat";
import addChatter from "../api/messenger/addChatter";
import { useTranslation } from "react-i18next";

const Messenger = () => {
  const { userData, isLogged } = useContext(UserContext);
  const router = useRouter();
  const { t } = useTranslation();

  //wybrani do dodania do chatu
  const [selectedFriends, setSelectedFriends] = useState([]);

  //nazwa nowego chatu
  const [newChatName, setNewChatName] = useState("");

  //tresc nowej wiadomosci
  const [newMessage, setNewMessage] = useState("");

  //ilosc wiadomosci wyswietlonych w chacie
  const [size, setSize] = useState(10);

  const [usernamesToFetch, setUsernamesToFetch] = useState([]);

  //czy to pierwsze zaladowanie chatow
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [activeChat, setActiveChat] = useState(null);
  const [messagesSize, setMessagesSize] = useState(20);

  //reply
  const [replyTo, setReplyTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [localLastMessage, setLocalLastMessage] = useState(null);

  const axiosInstance = useAxios();

  const {
    refetch: chatsRefetch,
    data: chatsData,
    isLoading: chatsIsLoading,
  } = useQuery(["chatsData", size], () => getChats(axiosInstance, size), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onSuccess: (data) => {
      if (data?.content?.length > 0) {
        const usernamesToFetch = data?.content
          .map(
            (chat) =>
              chat.members.find(
                (member) => member.username !== userData.username
              )?.username
          )
          .filter(Boolean);

        setUsernamesToFetch(usernamesToFetch);

        if (isInitialLoad && data.content.length > 0) {
          setActiveChat(data.content[0]._id);
          setIsInitialLoad(false);
        }
      }
    },
  });

  const { data: shortProfilesData, isLoading: shortProfilesIsLoading } =
    useQuery(
      ["shortProfilesData", usernamesToFetch],
      () => getShortProfiles(axiosInstance, usernamesToFetch),
      {
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: usernamesToFetch.length > 0,
      }
    );

  const { data: chatByIdData, isLoading: chatByIdIsLoading } = useQuery(
    ["getChatById", activeChat],
    () => getChatById(axiosInstance, activeChat),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(activeChat),
    }
  );

  const {
    refetch: messagesRefetch,
    data: messagesData,
    isLoading: messagesIsLoading,
  } = useQuery(
    ["getMessages", activeChat, messagesSize],
    () => {
      if (activeChat && messagesSize) {
        return getMessages(axiosInstance, activeChat, messagesSize);
      }
      throw new Error("Invalid parameters for getMessages");
    },
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(activeChat),
    }
  );

  const { mutateAsync: handleSendMessage } = useMutation(
    () => {
      sendMessage(axiosInstance, activeChat, {
        message: newMessage,
        respondingTo: replyTo,
      });
    },
    {
      onSuccess: () => {
        setLocalLastMessage({
          message: newMessage,
          timestamp: Math.floor(Date.now() / 1000),
          userId: userData.username,
        });
        setNewMessage("");
        chatsRefetch();
        messagesRefetch();
        setReplyTo(null);
        setReplyMessage("");
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  //wyjscie z chatu
  const { mutateAsync: handleLeaveChat } = useMutation(
    () => {
      leaveChat(axiosInstance, activeChat);
    },
    {
      onSuccess: (data) => {
        setIsInitialLoad(true);
        chatsRefetch();
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  //dodanie uzytkownika
  const { mutateAsync: handleAddChatter } = useMutation(
    (username) => {
      addChatter(axiosInstance, activeChat, username);
    },
    {
      onSuccess: () => {
        chatsRefetch();
        messagesRefetch();
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  const { mutateAsync: handleCreateChat } = useMutation(
    () => {
      createChat(axiosInstance, {
        name: newChatName,
        members: selectedFriends.map((friend) => friend.username),
      });
    },
    {
      onSuccess: () => {
        setNewMessage("");
        chatsRefetch();
        messagesRefetch();
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  const selectFriend = (friend) => {
    setSelectedFriends((prev) => {
      const alreadySelected = prev.some(
        (selected) => selected._id === friend._id
      );

      if (alreadySelected) {
        return prev;
      }

      return [...prev, friend];
    });
  };

  const unselectFriend = (friend) => {
    setSelectedFriends((prev) =>
      prev.filter((selected) => selected !== friend)
    );
  };

  const handleMessageForm = async (e) => {
    e.preventDefault();
    await handleSendMessage();
  };

  const [stompClient, setStompClient] = useState(null);

  //websocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {},
      onConnect: () => {
        //nasluchiwanie do powiadomienia
        client.subscribe(
          `/user/${userData.username}/messenger/message`,
          (message) => {
            const parsed = JSON.parse(message.body);
            chatsRefetch();
            messagesRefetch();
          }
        );

        client.subscribe(
          `/user/${userData.username}/messenger/members/`,
          (message) => {
            chatsRefetch();
          }
        );
      },
      onStompError: (frame) => {},
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [userData]);

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messagesData]);

  if (
    chatsIsLoading ||
    chatByIdIsLoading ||
    messagesIsLoading ||
    shortProfilesIsLoading ||
    isLogged === null
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night">
        <AiOutlineLoading3Quarters className="text-[48px] animate-spin text-amber"></AiOutlineLoading3Quarters>
      </div>
    );
  }

  if (isLogged === false) {
    router.push("/");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-night font-dekko">
        <p className="text-amber text-[40px] animate-pulse ">
          {t("common:redirecting")}
        </p>
      </div>
    );
  }

  if (isLogged) {
    return (
      <div className="bg-night min-h-screen w-full flex font-dekko">
        <div className="w-[30%] pt-[5%] flex flex-col items-center gap-y-3 px-6 h-screen overflow-y-auto">
          <div className="flex flex-col items-center gap-y-4 w-full">
            <div className="flex justify-between items-center pb-[2%] w-full">
              <p className="text-[24px]">{t("common:messenger.createChat")}</p>
              <Dialog>
                <DialogTrigger>
                  <FaEdit className="text-[28px]"></FaEdit>
                </DialogTrigger>
                <DialogContent className="bg-night font-dekko">
                  <p className="text-[24px]">
                    {t("common:messenger.createChat")}
                  </p>
                  <input
                    type="text"
                    placeholder={t("common:messenger.chatName")}
                    className="px-4 py-2 text-white-smoke bg-transparent border-[1px] border-white-smoke rounded-lg focus:outline-none"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                  />
                  <div>
                    {userData.friends &&
                      userData.friends.map((friend, key) => {
                        return (
                          <div
                            key={key}
                            className="flex justify-between px-[1%]"
                          >
                            <p>
                              {friend.username !== userData._id
                                ? friend.username
                                : friend.username2}
                            </p>
                            <button onClick={() => selectFriend(friend)}>
                              {t("common:messenger.add")}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  <p>{t("common:messenger.pickedFriends")}:</p>
                  <div className="flex gap-x-5">
                    {selectedFriends.length > 0 &&
                      selectedFriends.map((friend) => {
                        return (
                          <div className="flex gap-x-1 items-center">
                            <p>
                              {friend.username !== userData._id
                                ? friend.username
                                : friend.username2}
                            </p>
                            <AiOutlineDelete
                              onClick={() => unselectFriend(friend)}
                              className="hover:text-amber transition-all duration-150 cursor-pointer"
                            ></AiOutlineDelete>
                          </div>
                        );
                      })}
                  </div>

                  <DialogClose>
                    <button
                      onClick={() => handleCreateChat()}
                      className="border-2 border-white mx-auto px-5 py-2 w-[50%] rounded-full text-[20px] text-center hover:bg-silver hover:bg-opacity-15 transition-all duration-150"
                    >
                      {t("common:messenger.createChat")}
                    </button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
            {chatsData?.content?.map((chat, key) => {
              const otherMember = chat.members?.find(
                (member) => member.username !== userData?.username
              );

              const lastMessage =
                chat._id === activeChat && localLastMessage
                  ? localLastMessage
                  : chat.lastMessage;

              return (
                <div
                  key={key}
                  onClick={() => setActiveChat(chat._id)}
                  className={`flex items-center gap-x-2 py-4 px-3 border-[1px] rounded-xl cursor-pointer w-full hover:bg-silver hover:bg-opacity-15 transition-all duration-150 ${
                    activeChat === chat._id
                      ? "border-amber"
                      : "border-white-smoke"
                  }`}
                >
                  {otherMember &&
                  shortProfilesData?.[otherMember.username]?.image ? (
                    <div className="w-[48px] h-[48px] rounded-full border-[1px] border-white-smoke overflow-hidden">
                      <img
                        src={getImageSrc(
                          shortProfilesData[otherMember.username]?.image
                        )}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="w-[48px] h-[48px] bg-night flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                      <FaUser className="text-[24px]" />
                    </div>
                  )}
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-[24px]">
                        {chat.name === "Private Chat" && otherMember
                          ? otherMember.username
                          : chat.name}
                      </p>
                      <p className="flex items-center gap-x-1">
                        {lastMessage?.userId
                          ? lastMessage.userId === userData?.username
                            ? "You: "
                            : lastMessage.userId + ": "
                          : ""}
                        {lastMessage?.message?.length > 80
                          ? lastMessage.message.slice(0, 80) + "..."
                          : lastMessage?.message}
                      </p>
                    </div>
                    {lastMessage?.timestamp !== null ? (
                      <p>{formatTimeAgo(lastMessage.timestamp)}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}

            <button></button>
          </div>
          {chatsData?.content?.length > 0 && (
            <button
              onClick={() => setSize(size + 5)}
              className="w-[45%] border-[1px] border-white-smoke px-5 py-2 text-[20px] text-center rounded-full hover:bg-silver hover:bg-opacity-15 transition-all duration-150"
            >
              {t("common:messenger.loadMoreChats")}
            </button>
          )}
          {!chatsData?.content?.length && (
            <p>{t("common:messenger.noChats")}</p>
          )}
        </div>

        <div className="w-[70%] pt-[5%] h-screen overflow-y-auto z-10">
          {chatByIdIsLoading && messagesIsLoading && (
            <div>{t("common:messenger.loading")}</div>
          )}
          {chatByIdData && messagesData && (
            <div className="w-full h-full flex flex-col gap-y-2">
              <div className="flex justify-between items-center w-full px-[3%]">
                <p className="text-[32px]">
                  {chatByIdData.privateChat
                    ? chatByIdData.members[0].username === userData.username
                      ? chatByIdData.members[1].username
                      : chatByIdData.members[0].username
                    : chatByIdData.name}
                </p>
                {chatByIdData.privateChat === false && (
                  <div className="flex items-center gap-x-2 text-[28px]">
                    <Dialog>
                      <DialogTrigger className="">
                        <div className="flex items-center gap-x-2 hover:text-amber transition-all duration-150 cursor-pointer">
                          <MdPersonAdd className="cursor-pointer"></MdPersonAdd>
                          <p className="text-[20px]">
                            {t("common:messenger.addMember")}
                          </p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-night">
                        <DialogTitle className="font-semibold">
                          {t("common:messenger.addNewMembers")}
                        </DialogTitle>
                        <div>
                          {userData.friends && userData.friends.length > 0 ? (
                            userData.friends.filter((friend) => {
                              const isAlreadyInChat = chatByIdData.members.some(
                                (member) =>
                                  member.username ===
                                  (friend.username !== userData._id
                                    ? friend.username
                                    : friend.username2)
                              );
                              return !isAlreadyInChat;
                            }).length > 0 ? (
                              userData.friends
                                .filter((friend) => {
                                  const isAlreadyInChat =
                                    chatByIdData.members.some(
                                      (member) =>
                                        member.username ===
                                        (friend.username !== userData._id
                                          ? friend.username
                                          : friend.username2)
                                    );
                                  return !isAlreadyInChat;
                                })
                                .map((friend, key) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <p>
                                      {friend.username !== userData._id
                                        ? friend.username
                                        : friend.username2}
                                    </p>
                                    <button
                                      onClick={() => {
                                        const username =
                                          friend.username !== userData._id
                                            ? friend.username
                                            : friend.username2;
                                        handleAddChatter(username);
                                      }}
                                    >
                                      Add
                                    </button>
                                  </div>
                                ))
                            ) : (
                              <p>No friends to add</p>
                            )
                          ) : (
                            <p>{t("common:messenger.noFriends")}</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div
                      className="flex items-center gap-x-2 hover:text-amber transition-all duration-150 cursor-pointer"
                      onClick={() => handleLeaveChat()}
                    >
                      <FaDoorOpen></FaDoorOpen>
                      <p className="text-[20px]">
                        {t("common:messenger.leaveChat")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-y-1 px-[3%] w-full overflow-y-auto items-center mb-[10%]">
                {messagesSize < messagesData.page.totalElements && (
                  <div className="flex items-center justify-center hover:text-amber cursor-pointer duration-150 transition-all">
                    <FaPlus
                      onClick={() => setMessagesSize(messagesSize + 20)}
                      className="text-[40px]"
                    ></FaPlus>
                  </div>
                )}
                {messagesData.content
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((message, key) => {
                    const isUserMessage = message.userId === userData.username;

                    return (
                      <div
                        key={key}
                        className={`flex gap-x-2 px-4 py-3 items-center w-full ${
                          isUserMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUserMessage && (
                          <div>
                            {shortProfilesData &&
                            shortProfilesData[message.userId]?.image ? (
                              <div className="w-[48px] h-[48px] rounded-full border-[1px] border-white-smoke overflow-hidden">
                                <img
                                  src={getImageSrc(
                                    shortProfilesData[message.userId]?.image
                                  )}
                                  className="object-cover h-full w-full"
                                />
                              </div>
                            ) : (
                              <div className="w-[48px] h-[48px] bg-night flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                                <FaUser className="text-[24px]" />
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-[40%] bg-silver bg-opacity-15 rounded-xl py-2 px-3 break-words ${
                            isUserMessage ? "text-right" : "text-left"
                          }`}
                        >
                          {message.respondingTo !== null && (
                            <p>
                              Responding to:{" "}
                              {messagesData.content.find(
                                (msg) => msg._id === message.respondingTo
                              )?.message || "Message not found"}
                            </p>
                          )}

                          <p>{message.message}</p>
                        </div>
                        {!isUserMessage && (
                          <FaReply
                            className="text-[24px]"
                            onClick={() => {
                              setReplyTo(message._id);
                              setReplyMessage(
                                `Replying to ${message.userId}: ${message.message}`
                              );
                            }}
                          ></FaReply>
                        )}
                      </div>
                    );
                  })}
                <form
                  className="w-[64%] flex justify-between items-center absolute bottom-0 px-[1%] z-30 border-t-[1px] border-white-smoke bg-night"
                  onSubmit={handleMessageForm}
                >
                  <div className="flex flex-col gap-y-1" ref={messagesEndRef}>
                    {replyMessage && (
                      <div className="flex gap-x-2 items-center pt-2">
                        <p>{replyMessage}</p>
                        <AiOutlineDelete
                          onClick={() => {
                            setReplyTo(null);
                            setReplyMessage("");
                          }}
                          className="text-[20px] hover:text-amber duration-150 transition-all cursor-pointer"
                        ></AiOutlineDelete>
                      </div>
                    )}

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-[90%] bg-night  px-3 py-2 text-[18px] focus:outline-none h-[7vh]"
                      placeholder={t("common:messenger.typeMessage")}
                    />
                  </div>
                  <button type="submit" className="bg-night">
                    <IoIosSend className="text-[32px] hover:text-amber cursor-pointer duration-150 transition-all z-30"></IoIosSend>
                  </button>
                </form>
              </div>
            </div>
          )}
          {chatByIdData && !messagesData && (
            <div>{t("common:messenger.noMessages")}</div>
          )}
        </div>
      </div>
    );
  }
};

export default Messenger;
