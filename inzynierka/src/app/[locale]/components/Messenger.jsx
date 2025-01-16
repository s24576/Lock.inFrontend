"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useQuery, useMutation } from "react-query";
import useAxios from "../hooks/useAxios";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/componentsShad/ui/dialog";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { FaEdit, FaReply } from "react-icons/fa";
import { FaUser, FaPlus, FaDoorOpen} from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { MdPersonAdd } from "react-icons/md";
import getChats from "../api/messenger/getChats";
import getShortProfiles from "../api/profile/getShortProfiles";
import { formatTimestampToDateTime, formatTimeAgo } from "@/lib/formatTimeAgo";
import getChatById from "../api/messenger/getChatById";
import getMessages from "../api/messenger/getMessages";
import sendMessage from "../api/messenger/sendMessage";
import createChat from "../api/messenger/createChat";
import leaveChat from "../api/messenger/leaveChat";
import addChatter from "../api/messenger/addChatter";

const Messenger = () => {
  const { userData, isLogged } = useContext(UserContext);

  //metadane z konkretnego wybranego chatu, np members
  const [chatData, setChatData] = useState();

  //wszystkie chaty uzytkownika
  const [allChats, setAllChats] = useState([]);

  //ktory chat ma byc aktywny w okienku
  const [selectedChat, setSelectedChat] = useState(0);

  //wybrani do dodania do chatu
  const [selectedFriends, setSelectedFriends] = useState([]);

  //nazwa nowego chatu
  const [newChatName, setNewChatName] = useState("");

  const [newMemberName, setNewMemberName] = useState("");

  //tresc nowej wiadomosci
  const [newMessage, setNewMessage] = useState("");

  //wiadomosci konkretnego wybranego chatu
  const [chatMessages, setChatMessages] = useState({});

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

  const axiosInstance = useAxios();

  const {
    refetch: chatsRefetch,
    data: chatsData,
    isLoading: chatsIsLoading,
  } = useQuery(
    ["chatsData", size], // Dodanie zmiennej jako klucz
    () => getChats(axiosInstance, size),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess: (data) => {
        const usernamesToFetch = data.content
          .map(
            (chat) =>
              chat.members.find(
                (member) => member.username !== userData.username
              )?.username
          )
          .filter(Boolean); // Usuwamy ewentualne `undefined` jeśli `find` nic nie zwróci

        setUsernamesToFetch(usernamesToFetch);

        if (isInitialLoad && data.content.length > 0) {
          setActiveChat(data.content[0]._id);
          setIsInitialLoad(false); // Ustawiamy, że załadowano początkowo
        }
      },
    }
  );

  const {
    refetch: shortProfilesRefetch,
    data: shortProfilesData,
    isLoading: shortProfilesIsLoading,
  } = useQuery(
    ["shortProfilesData", usernamesToFetch], // Dodanie zmiennej jako klucz
    () => getShortProfiles(axiosInstance, usernamesToFetch),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: usernamesToFetch.length > 0,
    }
  );

  const {
    refetch: chatByIdrefetch,
    data: chatByIdData,
    isLoading: chatByIdIsLoading,
  } = useQuery(
    ["getChatById", activeChat], // Klucz zawiera ID czatu, aby zmiana powodowała nowe zapytanie
    () => getChatById(axiosInstance, activeChat),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(activeChat), // Zapytanie wykona się tylko, gdy ID jest prawidłowe
    }
  );

  const {
    refetch: messagesRefetch,
    data: messagesData,
    isLoading: messagesIsLoading,
  } = useQuery(
    ["getMessages", activeChat, messagesSize], // Upewnij się, że te dane są poprawne
    () => {
      if (activeChat && messagesSize) {
        return getMessages(axiosInstance, activeChat, messagesSize); // Upewnij się, że activeChat i messagesSize są prawidłowe
      }
      throw new Error("Invalid parameters for getMessages");
    },
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(activeChat), // Zapytanie wykona się tylko, gdy ID jest prawidłowe
    }
  );

  const {
    mutateAsync: handleSendMessage
  } = useMutation(
    () => {
      sendMessage(axiosInstance, activeChat,{message: newMessage, respondingTo: replyTo});
    },
    {
      onSuccess: (data) => {
        console.log("Success adding msg:", data);
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
  const {
    mutateAsync: handleLeaveChat
  } = useMutation(
    () => {
      leaveChat(axiosInstance, activeChat);
    },
    {
      onSuccess: (data) => {
        setIsInitialLoad(true);
        chatsRefetch();
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  //dodanie uzytkownika
  const {
    mutateAsync: handleAddChatter
  } = useMutation(
    (username) => {
      addChatter(axiosInstance, activeChat, username);
    },
    {
      onSuccess: (data) => {
        chatsRefetch();
        messagesRefetch()
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  const {
    mutateAsync: handleCreateChat
  } = useMutation(
    () => {
      createChat(axiosInstance, {name: newChatName, members: selectedFriends.map((friend) => friend.username)});
    },
    {
      onSuccess: (data) => {
        console.log("Success adding msg:", data);
        setNewMessage("");
        chatsRefetch();
        messagesRefetch();
      },
      onError: (error) => {
        console.error("Error adding msg:", error);
      },
    }
  );

  const selectFriend = (friend) => {
    setSelectedFriends((prev) => {
      // Sprawdzamy, czy przyjaciel już istnieje w tablicy na podstawie `_id`
      const alreadySelected = prev.some(
        (selected) => selected._id === friend._id
      );

      // Jeżeli przyjaciel już istnieje, zwracamy poprzednią tablicę bez zmian
      if (alreadySelected) {
        return prev;
      }

      // Jeżeli przyjaciela nie ma, dodajemy go do tablicy
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
  }

  const [stompClient, setStompClient] = useState(null);
  const [newMessageReceived, setNewMessageReceived] = useState();

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
            // setNewMessageReceived(parsed.message);
            // setChatMessages((prev) => ({
            //   ...prev, // Kopiuj poprzedni stan
            //   content: [...prev.content, parsed], // Dodaj nową wiadomość do tablicy content
            // }));
            console.log("new message received: ", parsed)
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

  const messagesEndRef = useRef(null); // Ref dla końca kontenera wiadomości

  useEffect(() => {
    // Sprawdzamy, czy ref jest dostępny, i przewijamy na dół
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        // behavior: "smooth", // Używamy płynnego przewijania
        block: "end", // Ustalamy, by przewinęło na sam dół
      });
    }
  }, [messagesData]);

  return (
    <div className="bg-night min-h-screen w-full flex font-chewy">
      {/* Kontener z listą czatów */}
      <div className="w-[30%] pt-[5%] flex flex-col items-center gap-y-3 px-6 h-screen overflow-y-auto">
        {chatsIsLoading && <div>Loading...</div>}

        {chatsData && (
          <div className="flex flex-col items-center gap-y-4 w-full">
            <div className="flex justify-between items-center pb-[2%] w-full">
              <p className="text-[24px]">Create chat</p>
            <Dialog>
          <DialogTrigger><FaEdit className="text-[28px]"></FaEdit></DialogTrigger>
          <DialogContent className="bg-oxford-blue">
            <p className="font-semibold">Create a chat</p>
            <input
              type="text"
              placeholder="Chat name"
              className="px-4 py-2 text-black"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
            <div>
              {userData.friends &&
                userData.friends.map((friend, key) => {
                  return (
                    <div key={key} className="flex justify-between">
                      <p>
                        {friend.username !== userData._id
                          ? friend.username
                          : friend.username2}
                      </p>
                      <button onClick={() => selectFriend(friend)}>Add</button>
                    </div>
                  );
                })}
            </div>
            <p>Picked friends:</p>
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
                      <button
                        onClick={() => unselectFriend(friend)}
                        className="text-red-500 font-bold"
                      >
                        X
                      </button>
                    </div>
                  );
                })}
            </div>

            <DialogClose>
              <button
                onClick={() => handleCreateChat()}
                className="border-2 border-white mx-auto px-5 py-2"
              >
                {selectedFriends.length > 1 && newChatName !== ""
                  ? "Create chat"
                  : "Add more"}
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
            </div>
            {chatsData?.content?.map((chat, key) => {
              const otherMember = chat.members.find(
                (member) => member.username !== userData.username
              );
              return (
                <div
  key={key}
  onClick={() => setActiveChat(chat._id)}
  className={`flex items-center gap-x-2 py-4 px-3 border-[1px] rounded-xl cursor-pointer w-full hover:bg-silver hover:bg-opacity-15 transition-all duration-150 ${
    activeChat === chat._id ? 'border-amber' : 'border-white-smoke'
  }`}
>
                  {shortProfilesData &&
                  shortProfilesData[otherMember.username]?.image ? (
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
                        {chat.lastMessage.userId
                          ? chat.lastMessage.userId === userData.username
                            ? "You: "
                            : chat.lastMessage.userId + ": "
                          : ""}
                        {chat.lastMessage?.message.length > 80
                          ? chat.lastMessage.message.slice(0, 80) + "..."
                          : chat.lastMessage?.message}
                      </p>
                    </div>
                    {chat.lastMessage?.timestamp !== null ? (
                      <p>{formatTimeAgo(chat.lastMessage.timestamp)}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
            <button></button>
          </div>
        )}
        <button
          onClick={() => setSize(size + 5)}
          className="w-[45%] border-[1px] border-white-smoke px-5 py-2 text-[20px] text-center rounded-full hover:bg-silver hover:bg-opacity-15 transition-all duration-150"
        >
          Load more chats
        </button>
      </div>

      {/* Kontener z wiadomościami */}
      <div className="w-[70%] pt-[5%] h-screen overflow-y-auto z-10">
        {chatByIdIsLoading && messagesIsLoading && <div>Loading...</div>}
        {chatByIdData && messagesData && (
          <div className="w-full h-full flex flex-col gap-y-2">
            <div className="flex justify-between items-center w-full px-[3%]">
            <p className="text-[32px]">
              {chatByIdData.privateChat ? chatByIdData.members[0].username === userData.username
                ? chatByIdData.members[1].username
                : chatByIdData.members[0].username : chatByIdData.name}
              
            </p>
            {chatByIdData.privateChat === false && (<div className="flex items-center gap-x-2 text-[28px]">
              <Dialog>
              <DialogTrigger className="">
              <div className="flex items-center gap-x-2 hover:text-amber transition-all duration-150 cursor-pointer">
                
                <MdPersonAdd className="cursor-pointer"></MdPersonAdd>
                <p className="text-[20px]">Add member</p>
              </div>
              </DialogTrigger>
              <DialogContent className="bg-oxford-blue">
                <DialogTitle className="font-semibold">
                  Add new members
                </DialogTitle>
                <div>
                  {userData.friends && userData.friends.length > 0 ? (
                    userData.friends.filter((friend) => {
                      // Sprawdź, czy friend znajduje się już w chatData.members
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
                          const isAlreadyInChat = chatByIdData.members.some(
                            (member) =>
                              member.username ===
                              (friend.username !== userData._id
                                ? friend.username
                                : friend.username2)
                          );
                          return !isAlreadyInChat;
                        })
                        .map((friend, key) => (
                          <div key={key} className="flex justify-between">
                            <p>
                              {friend.username !== userData._id
                                ? friend.username
                                : friend.username2}
                            </p>
                            <button
                              onClick={() => {
                                const username = friend.username !== userData._id
                                ? friend.username
                                : friend.username2
                                handleAddChatter(username)
                              }
                              }
                            >
                              Add
                            </button>
                          </div>
                        ))
                    ) : (
                      <p>No friends to add</p>
                    )
                  ) : (
                    <p>Add some friends to start chatting</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
              
              <div className="flex items-center gap-x-2 hover:text-amber transition-all duration-150 cursor-pointer" onClick={() => handleLeaveChat()}>
                <FaDoorOpen className=""></FaDoorOpen>
                <p className="text-[20px]">Leave chat</p>
              </div>
            </div>)}
            

            </div>

            {/* Kontener wiadomości */}
            <div className="flex flex-col gap-y-1 px-[3%] w-full overflow-y-auto items-center mb-[10%]">
              {messagesSize < messagesData.page.totalElements && <div className="flex items-center justify-center hover:text-amber cursor-pointer duration-150 transition-all">
                <FaPlus onClick={() => setMessagesSize(messagesSize + 20)} className="text-[40px]">
                  </FaPlus></div>}
              {messagesData.content.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message, key) => {
                const isUserMessage = message.userId === userData.username;

                return (
                  <div
                    key={key}
                    className={`flex gap-x-2 px-4 py-3 items-center w-full ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Profil autora wiadomości */}
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

                    {/* Treść wiadomości z tłem na 40% */}
                    <div
                      className={`max-w-[40%] bg-silver bg-opacity-15 rounded-xl py-2 px-3 break-words ${
                        isUserMessage ? "text-right" : "text-left"
                      }`}
                    >
                      {message.respondingTo !== null && (
  <p>
    Responding to: {
      messagesData.content.find(msg => msg._id === message.respondingTo)?.message || "Message not found"
    }
  </p>
)}

                      <p>{message.message}</p>
                    </div>
                    {!isUserMessage && (
                      <FaReply className="text-[24px]" onClick={() => {
                        setReplyTo(message._id);
                        setReplyMessage(`Replying to ${message.userId}: ${message.message}`);
                      }}></FaReply>

                    )}
                   
                  </div>
                );
              })}
              {/* Dodajemy ref do kontenera wiadomości, by przewinąć na dół */}
              <form
                ref={messagesEndRef}
                className="w-[64%] flex justify-between items-center absolute bottom-0 px-[1%] z-30 border-t-[1px] border-white-smoke bg-night"
                onSubmit={handleMessageForm}
              >
                <div className="flex flex-col gap-y-1">
                    {replyMessage && (
                      <div className="flex gap-x-2 items-center pt-2">
                        <p>{replyMessage}</p>
                      <AiOutlineDelete onClick={() => {
                    setReplyTo(null);
                    setReplyMessage("");
                  }} className="text-[20px] hover:text-amber duration-150 transition-all cursor-pointer"></AiOutlineDelete>
                  </div>
                    )}

                  
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-[90%] bg-night  px-3 py-2 text-[18px] focus:outline-none h-[7vh]"
                  placeholder="Aa"
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
          <div className="w-full h-full flex flex-col items-center gap-y-2">
           <div className="flex justify-between items-center w-full px-[3%]">
            <p className="text-[32px]">
              {chatByIdData.members[0].username === userData.username
                ? chatByIdData.members[1].username
                : chatByIdData.members[0].username}
            </p>

            </div>

            <div className="px-[3%] mt-[5%] w-full text-center">
              <p className="text-[24px]">Send a message to start chatting!</p>
            </div>
            <form
                ref={messagesEndRef}
                className="w-[64%] flex justify-between items-center absolute bottom-0 px-[1%] z-30 border-t-[1px] border-white-smoke bg-night"
                onSubmit={handleMessageForm}
              >
                <div className="flex flex-col gap-y-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-[90%] bg-night  px-3 py-2 text-[18px] focus:outline-none h-[7vh]"
                  placeholder="Aa"
                />

                </div>
                <button type="submit" className="bg-night">
                <IoIosSend className="text-[32px] hover:text-amber cursor-pointer duration-150 transition-all z-30"></IoIosSend>
                </button>
              </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
