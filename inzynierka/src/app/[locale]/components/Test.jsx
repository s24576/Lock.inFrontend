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

const Test = () => {
  const { userData, isLogged } = useContext(UserContext);
  const [chatData, setChatData] = useState();
  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(0);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [newChatName, setNewChatName] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const api = useAxios();

  const getAllChats = async () => {
    try {
      const response = await api.get(`/messenger/getChats`);

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
      // Ensure that allChats and the selected chat exist before making the API call
      if (allChats?.content && allChats.content[selectedChat]) {
        try {
          const response = await api.get(
            `/messenger/getChatById?chatId=${allChats.content[selectedChat]._id}`
          );
          console.log("selected Chat:", response.data);
          setChatData(response.data); // Store the chat data
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (allChats?.content?.length > 0) {
      getChatById(); // Only call this when allChats is loaded
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

    console.log("members::::::", members);

    //dodaj do members samego siebie

    try {
      // Wykonujemy żądanie z nową tablicą członków (`members`)
      const response = await api.post(`/messenger/createChat`, {
        name: newChatName,
        members: members, // Przekazujemy tablicę obiektów
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

  const addNewMembers = async (username, chatId) => {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-y-6 mt-[70px]">
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
                onClick={() => setSelectedChat(index)}
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
            {chatData.members.map((member, key) => {
              return <p key={key}>{member.username}</p>;
            })}
            <Dialog>
              <DialogTrigger className="border-2 border-white px-4 py-2">
                Add new members
              </DialogTrigger>
              <DialogContent className="bg-oxford-blue">
                <DialogTitle className="font-semibold">
                  Add new members
                </DialogTitle>
                <div>
                  {userData.friends &&
                    userData.friends
                      .filter((friend) => {
                        // Sprawdź, czy friend znajduje się już w chatData.members
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
                          <button onClick={() => selectFriend(friend)}>
                            Add
                          </button>
                        </div>
                      ))}
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
                  <p
                    onClick={() => addNewMembers(chatData._id)}
                    className="border-2 border-white mx-auto px-5 py-2"
                  >
                    {selectedFriends.length > 0 ? "Add member" : "Add more"}
                  </p>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <p>No chat selected or data is still loading...</p>
        )}
      </div>
    </div>
  );
};

export default Test;
