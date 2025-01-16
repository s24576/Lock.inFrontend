"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
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
import { FaReply, FaArrowUp } from "react-icons/fa";

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

  //wiadomosc na ktora sie odpowiada
  const [isReplying, setIsReplying] = useState({});

  //wiadomosci konkretnego wybranego chatu
  const [chatMessages, setChatMessages] = useState({});

  //ilosc wiadomosci wyswietlonych w chacie
  const [messagesLoaded, setMessagesLoaded] = useState(5);

  const api = useAxios();

  const getAllChats = async () => {
    try {
      const response = await api.get(`/messenger/getChats?size=20`);

      console.log("all chats", response.data);
      setAllChats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllChats();
  }, [selectedChat]);

  useEffect(() => {
    const getChatById = async () => {
      if (allChats?.content) {
        let chatResponse; // Zmienna na dane odpowiedzi
        const selectedChatObject = allChats.content.find(
          (chat) => chat._id === selectedChat
        );
        if (selectedChatObject) {
          try {
            const response = await api.get(
              `/messenger/getChatById?chatId=${selectedChatObject._id}`
            );
            console.log("selected Chat:", response.data);
            setChatData(response.data); // Przechowaj dane czatu
            chatResponse = response.data; // Przechwyć dane do zmiennej
          } catch (error) {
            console.log(error);
          } finally {
            if (chatResponse && chatResponse._id) {
              getMessages(chatResponse._id); // Użyj ID czatu w finally
            }
          }
        }
      }
    };

    if (allChats?.content?.length > 0) {
      getChatById(); // Wywołaj funkcję, gdy załadowane są dane czatów
    }
  }, [allChats, selectedChat]);

  const createChat = async () => {
    console.log("creating chat");

    if (newChatName === "") return;

    // Tworzymy tablicę nowych obiektów na podstawie `selectedFriends`
    const members = selectedFriends.map((friend) => {
      // Jeżeli `username` jest różne od `userData._id`, wybieramy `username`, inaczej `username2`
      const username =
        friend.username !== userData._id ? friend.username : friend.username2;
      return { username }; // Zwracamy nowy obiekt z polem `username`
    });

    const members2 = selectedFriends.map((friend) =>
      friend.username !== userData._id ? friend.username : friend.username2
    );

    console.log("members::::::", members2);

    //dodaj do members samego siebie

    try {
      // Wykonujemy żądanie z nową tablicą członków (`members`)
      const response = await api.post(`/messenger/createChat`, {
        name: newChatName,
        members: members2, // Przekazujemy tablicę obiektów
      });

      console.log("Chat created:", response.data);

      // Możesz również chcieć wyczyścić stan `selectedFriends` oraz `newChatName`
      getAllChats();
      setSelectedFriends([]);
      setNewChatName("");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  //do naprawy
  const deleteChat = async () => {
    try {
      const response =
        await api.delete(`/messenger/deleteChat?chatId=${chatData._id}
      `);

      if (response.status === 200) console.log("chat deleted", chatData._id);

      if (selectedChat === 0) {
        setSelectedChat(1);
      } else {
        setSelectedChat(0);
      }
      getAllChats();
    } catch (error) {
      console.log(error);
    }
  };

  const leaveChat = async () => {
    try {
      const response = await api.delete(
        `/messenger/leaveChat?chatId=${chatData._id}`
      );
      console.log(response.status);
      getAllChats();
      if (selectedChat === 0) {
        setSelectedChat(1);
      } else {
        setSelectedChat(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const addNewMembers = async (chatId, username) => {
    // Tworzymy tablicę nowych obiektów na podstawie `selectedFriends`
    const members = selectedFriends.map((friend) => {
      // Jeżeli `username` jest różne od `userData._id`, wybieramy `username`, inaczej `username2`
      const username =
        friend.username !== userData._id ? friend.username : friend.username2;
      return { username }; // Zwracamy nowy obiekt z polem `username`
    });

    try {
      const response = await api.post(
        `/messenger/addChatter?username=${username}&chatId=${chatId}`
      );

      console.log(response.status);
      getAllChats();
    } catch (error) {
      console.log(error);
    }
  };

  //wyslij wiadomosc
  const sendMessage = async (chatId) => {
    try {
      const response = await api.post(
        `/messenger/sendMessage?chatId=${chatId}`,
        {
          message: newMessage,
          respondingTo: isReplying ? isReplying._id : null,
        }
      );
      console.log(response.data);
      setChatMessages((prev) => ({
        ...prev, // Kopiuj poprzedni stan
        content: [...prev.content, response.data], // Dodaj nową wiadomość do tablicy content
      }));
      setIsReplying({});
      getAllChats();
    } catch (error) {
      console.log(error);
    }
  };

  const handleIsReplying = (msg) => {
    setIsReplying(msg);
  };

  //wiadomosci dla konkretnego chatu
  const getMessages = async (chatId) => {
    console.log("chat id: ", chatId);
    try {
      const response = await api.get(`/messenger/getMessages?chatId=${chatId}`);

      console.log("messages content:", response.data);
      setChatMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //zaladuj wiecej wiadomosci
  const loadMessages = async () => {
    try {
      const response = await api.get(
        `/messenger/getMessages?chatId=${chatData._id}&size=${
          messagesLoaded + 5
        }`
      );

      console.log("loading content:", response.data);
      setChatMessages(response.data);
      setMessagesLoaded(messagesLoaded + 5);
    } catch (error) {
      console.log(error);
    }
  };

  const [stompClient, setStompClient] = useState(null);
  const [newMessageReceived, setNewMessageReceived] = useState();

  //websocket
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log("STOMP Debug: ", str);
      },
      onConnect: () => {
        console.log("Connected");

        //nasluchiwanie do powiadomienia
        client.subscribe(
          `/user/${userData.username}/messenger/message`,
          (message) => {
            console.log("Message received: ", message.body); // Debug incoming messages
            const parsed = JSON.parse(message.body);
            console.log("Message received2: ", parsed); // Debug incoming messages
            setNewMessageReceived(parsed.message);
            setChatMessages((prev) => ({
              ...prev, // Kopiuj poprzedni stan
              content: [...prev.content, parsed], // Dodaj nową wiadomość do tablicy content
            }));
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP Error: ", frame.headers["message"]);
        console.error("Additional details: ", frame.body);
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
    <div className="flex">
      <div className="flex flex-col gap-y-6 mt-[70px]">
        {userData && <p>Hello, {userData.username}</p>}
        <Dialog>
          <DialogTrigger>Create chat</DialogTrigger>
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
                onClick={() => createChat()}
                className="border-2 border-white mx-auto px-5 py-2"
              >
                {selectedFriends.length > 1 && newChatName !== ""
                  ? "Create chat"
                  : "Add more"}
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        {allChats !== null &&
          Array.isArray(allChats.content) &&
          allChats.content.map((chat, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedChat(chat._id);
                  setMessagesLoaded(5);
                }}
                className="cursor-pointer hover:bg-[#3a3a3a]"
              >
                <p>Chat {index}</p>
                {chat.members.map((member, key) => {
                  return (
                    <p key={key}>
                      {member.username !== userData._id ? member.username : ""}
                    </p>
                  );
                })}
                <p>chat name: {chat.name}</p>
                <p>chat id: {chat._id}</p>

                {chat.lastMessage &&
                chat.lastMessage.message &&
                chat.lastMessage.userId ? (
                  <p>
                    {chat.lastMessage.userId}: {chat.lastMessage.message}
                  </p>
                ) : (
                  <p>write message to start chatting</p>
                )}
              </div>
            );
          })}
      </div>
      <div className="mt-[70px]">
        <p>Current chat</p>
        {chatData ? (
          <div>
            <p>{chatData._id}</p>
            <p>chat name: {chatData.name}</p>
            <p>number of messages: {chatData.totalMessages}</p>
            {chatData.members.map((member, key) => {
              return <p key={key}>{member.username}</p>;
            })}

            <button onClick={() => leaveChat()}>Leave chat</button>
            {chatData.privateChat === true ? (
              ""
            ) : (
              <Dialog>
                <DialogTrigger className="border-2 border-white px-4 py-2">
                  Delete chat
                </DialogTrigger>
                <DialogContent className="bg-oxford-blue">
                  <DialogTitle className="font-semibold">
                    Delete chat
                  </DialogTitle>
                  <p>Are you sure?</p>
                  <DialogClose className="flex gap-x-3 justify-center">
                    <div
                      className="px-4 py-2 border-white border-2"
                      onClick={() => deleteChat()}
                    >
                      Yes
                    </div>
                    <div className="px-4 py-2 border-white border-2">No</div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            )}

            <Dialog>
              <DialogTrigger className="border-2 border-white px-4 py-2">
                Add new members
              </DialogTrigger>
              <DialogContent className="bg-oxford-blue">
                <DialogTitle className="font-semibold">
                  Add new members
                </DialogTitle>
                <div>
                  {userData.friends && userData.friends.length > 0 ? (
                    userData.friends.filter((friend) => {
                      // Sprawdź, czy friend znajduje się już w chatData.members
                      const isAlreadyInChat = chatData.members.some(
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
                          const isAlreadyInChat = chatData.members.some(
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
                              onClick={() =>
                                addNewMembers(
                                  chatData._id,
                                  friend.username !== userData._id
                                    ? friend.username
                                    : friend.username2
                                )
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
            {isReplying !== null && isReplying.message && isReplying.userId ? (
              <p>
                {isReplying.userId} : {isReplying.message}
              </p>
            ) : null}
            <input
              type="text"
              value={newMessage}
              className="text-black py-2 px-5"
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={() => sendMessage(chatData._id)}>
              Send message
            </button>

            {/* wyswietlanie wiadomosci w chacie */}
            {chatData && chatData.totalMessages > messagesLoaded ? (
              <FaArrowUp
                className="text-[36px] cursor-pointer"
                onClick={() => loadMessages()}
              ></FaArrowUp>
            ) : null}
            {chatMessages.content &&
              [...chatMessages.content]
                .sort((a, b) => a.timestamp - b.timestamp) // Sortowanie rosnąco po timestamp
                .map((msg, key) => {
                  return (
                    <div key={key} className="flex gap-x-3 items-center">
                      {msg.respondingTo !== null ? (
                        <p>Responding to (agregacja): </p>
                      ) : null}
                      <p>
                        {msg.userId}: {msg.message}{" "}
                      </p>
                      <FaReply
                        className="cursor-pointer"
                        onClick={() => handleIsReplying(msg)}
                      ></FaReply>
                    </div>
                  );
                })}
          </div>
        ) : (
          <p>No chat selected or data is still loading...</p>
        )}
      </div>
    </div>
  );
};

export default Messenger;
