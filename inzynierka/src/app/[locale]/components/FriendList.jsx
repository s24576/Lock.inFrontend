import React, { useContext, useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/componentsShad/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/componentsShad/ui/dialog";
import { IoPeople, IoPersonAddSharp } from "react-icons/io5";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useAxios from "../hooks/useAxios";
import { UserContext } from "../context/UserContext";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
import { useMutation, useQuery } from "react-query";
import deleteFriend from "../api/profile/deleteFriend";
import ReportForm from "./reports/ReportForm";
import getNotifications from "../api/profile/getNotifications";

const FriendList = () => {
  const { userData, setUserData, isLogged, setIsLogged } =
    useContext(UserContext);

  const api = useAxios();

  //friends, locale do poprawy
  const [usernameInput, setUsernameInput] = useState("");

  //input text
  const addToFriendlist = async () => {
    try {
      const response = await api.post(
        "/profile/sendFriendRequest",
        {
          to: usernameInput,
        },
        {
          "Accept-Language": "en",
        }
      );
      if (response.status === 200) {
        console.log("200");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const [toRequests, setToRequests] = useState([]);
  const [fromRequests, setFromRequests] = useState([]);

  const [stompClient, setStompClient] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState("");

  const {
    refetch: notificationsRefetch,
    data: notificationsData,
    isLoading: notificationsIsLoading,
  } = useQuery(
    "getNotifications",
    () => getNotifications(api), // Funkcja zawsze zwraca aktualne dane
    {
      refetchOnWindowFocus: false, // Wyłącz odświeżanie przy zmianie okna
      cacheTime: 0, // Opcjonalnie wymuś odświeżanie danych zawsze
      staleTime: 0, // Opcjonalnie ustaw brak czasu "świeżości" danych
    }
  );

  useEffect(() => {
    //fetchuje friendsow do ktorych jest wyslane zapro albo od ktorych jest
    async function fetchRequests() {
      try {
        const toResponse = await api.get("/profile/to");
        setToRequests(toResponse.data.content);

        const fromResponse = await api.get("/profile/from");
        setFromRequests(fromResponse.data.content);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    }

    fetchRequests();

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        // console.log("STOMP Debug: ", str);
      },
      onConnect: () => {
        // console.log("Connected");

        //nasluchiwanie do wiadomosci
        client.subscribe(
          `/user/${userData.username}/messenger/message`,
          (message) => {
            console.log("Message received: ", message.body); // Debug incoming messages
            const parsed = JSON.parse(message.body);
            console.log("Message received2: ", parsed); // Debug incoming messages
            toast.message("New message:", {
              description: `${parsed.userId} : ${parsed.message}`,
              duration: 2000,
              position: "top-right",
            });
            setNewMessageReceived(parsed.message);
            setChatMessages((prev) => ({
              ...prev, // Kopiuj poprzedni stan
              content: [...prev.content, parsed], // Dodaj nową wiadomość do tablicy content
            }));
          }
        );

        //nasluchiwanie do powiadomienia
        client.subscribe(
          `/user/${userData.username}/notification`,
          (message) => {
            // console.log("Message received: ", message.body); // Debug incoming messages
            setReceivedMessage(message.body);
            toast.message("Notification:", {
              description: message.body,
              duration: 2000,
              position: "top-right",
            });
            notificationsRefetch();
          }
        );

        //nasluchiwanie do odbierania zaproszen od innych
        client.subscribe(
          `/user/${userData.username}/friendRequest/to`,
          (message) => {
            // console.log("friend request to: ", message.body); // Debug incoming messages
            setToRequests((prevData) => [...prevData, message.body]);
            fetchRequests();
          }
        );

        //nasluchiwanie do wyswietlania zaproszen do innych
        client.subscribe(
          `/user/${userData.username}/friendRequest/from`,
          (message) => {
            // console.log("friend request from: ", message.body); // Debug incoming messages
            // console.log(fromRequests);
            setFromRequests((prevData) => [...prevData, message.body]);
            fetchRequests();
          }
        );

        //nasluchiwanie do reakcji cofniecie/wyslanie zaproszenia do innych - nie wprowadzone
        client.subscribe(
          `/user/${userData.username}/delete/friendRequest/from`,
          (message) => {
            // console.log("delete friend request from: ", message.body);
            // console.log(fromRequests);
            setFromRequests((prevData) =>
              prevData.filter((request) => request._id !== message.body)
            );
            fetchRequests();
          }
        );

        //nasluchiwanie do reakcji zaakceptowanie/odrzucenie kogos do listy znajomych
        client.subscribe(
          `/user/${userData.username}/delete/friendRequest/to`,
          (message) => {
            // console.log("delete friend request to: ", message.body);
            // console.log(toRequests);
            setToRequests((prevData) =>
              prevData.filter((request) => request._id !== message.body)
            );
            fetchRequests();
          }
        );

        //nasluchiwanie do tworzenia chatow itp
        client.subscribe(
          `/user/${userData.username}/messenger/members/`,
          (message) => {
            //refetch chatu po id z message.body
            fetchRequests();
          }
        );
      },
      onStompError: (frame) => {
        // console.error("STOMP Error: ", frame.headers["message"]);
        // console.error("Additional details: ", frame.body);
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

  //akcpetuj frienda
  const acceptFriend = async (reqId) => {
    try {
      const response = api.post(`/profile/respondFriendRequest`, {
        response: true,
        requestId: reqId,
      });
      console.log("status:", response.status);
    } catch (error) {
      console.log(error);
    }
  };

  //odrzuc frienda
  const declineFriend = async (reqId) => {
    try {
      const response = api.post(`/profile/respondFriendRequest`, {
        response: false,
        requestId: reqId,
      });
      console.log("status:", response.status);
    } catch (error) {
      console.log(error);
    }
  };

  const { mutateAsync: handleDeleteFriend } = useMutation(
    (friendId) => {
      console.log(friendId);
      console.log("deleting friend....");
      deleteFriend(api, friendId);
    },
    {
      onSuccess: (data) => {
        console.log("Friend deleted succesfully:", data);
      },
      onError: (error) => {
        console.error("Error deleting friend:", error);
      },
    }
  );

  return (
    <Sheet>
      <SheetTrigger>
        <IoPeople className="text-[30px] text-[#F5B800] hover:text-silver transition-colors duration-150"></IoPeople>
      </SheetTrigger>
      <SheetContent side={"right"} className="bg-oxford-blue">
        <h1 className="text-white">Friends</h1>
        <div className="flex w-full gap-x-4 items-center">
          <input
            type="text"
            placeholder="Add to friendlist"
            className="py-2 px-5 text-black"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <button
            className="text-[36px] hover:text-gray-300"
            onClick={() => addToFriendlist()}
          >
            <IoPersonAddSharp></IoPersonAddSharp>
          </button>
        </div>

        <div>
          <h1 className="mt-4 text-white text-[20px]">Sent invites:</h1>
          {fromRequests.length > 0 &&
            fromRequests.map((req, key) => {
              return (
                <div key={key} className="flex gap-x-2">
                  <p>{req.to}</p>
                  <p>{req.timestamp}</p>
                </div>
              );
            })}
          <h1 className="mt-4 text-white text-[20px]">New invites:</h1>
          {toRequests.length > 0 &&
            toRequests.map((req, key) => {
              return (
                <div key={key} className="flex gap-x-2 items-center">
                  <p>{req.from}</p>
                  <p>{req.timestamp}</p>
                  <button
                    className="text-green-500"
                    onClick={() => acceptFriend(req._id)}
                  >
                    Akceptuj
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => declineFriend(req._id)}
                  >
                    Odrzuć
                  </button>
                </div>
              );
            })}
        </div>
        <p>Notifications:</p>
        {notificationsData && notificationsData.content.length > 0 ? (
          notificationsData.content.map((notification, key) => {
            return (
              <div key={key} className="flex gap-x-2">
                <p>{notification.value}</p>
              </div>
            );
          })
        ) : (
          <p>No notifications</p>
        )}
        <p>{receivedMessage}</p>
        <div className="mt-4">
          <p className="text-[24px]">Your friends:</p>
          {isLogged && userData.friends && userData.friends.length > 0 ? (
            userData.friends.map((friend, key) => (
              <div key={key} className="flex justify-between">
                <p>
                  {friend.username !== userData._id
                    ? friend.username
                    : friend.username2}
                </p>
                {/* report do osobnego komponentu */}
                <div className="flex gap-x-4">
                  <ReportForm
                    objectId={friend._id}
                    objectType={"member"}
                  ></ReportForm>
                  <Dialog>
                    <DialogTrigger className="text-[32px] hover:text-gray-400">
                      <MdDelete></MdDelete>
                    </DialogTrigger>
                    <DialogContent className="bg-oxford-blue">
                      <DialogTitle className="font-semibold">
                        Delete from friendlist
                      </DialogTitle>
                      <p>Are you sure?</p>
                      <DialogClose
                        asChild
                        className="flex gap-x-3 justify-center"
                      >
                        <div className="px-4 flex">
                          <button
                            onClick={() => handleDeleteFriend(friend._id)}
                            className="px-4 py-1 border-[1px] border-white"
                          >
                            Yes
                          </button>
                          <button className="px-4 py-1 border-[1px] border-white">
                            No
                          </button>
                        </div>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          ) : (
            <p>No friends available</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FriendList;
