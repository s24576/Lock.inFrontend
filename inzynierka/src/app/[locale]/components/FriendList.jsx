import React, { useContext, useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/componentsShad/ui/sheet";

import { IoPeople, IoPersonAddSharp } from "react-icons/io5";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useAxios from "../hooks/useAxios";
import { UserContext } from "../context/UserContext";
import { FaUser } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { BiSolidLock } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import deleteFriend from "../api/profile/deleteFriend";
import getYourInvites from "../api/profile/getYourInvites";
import getSentInvites from "../api/profile/getSentInvites";
import respondFriendRequest from "../api/profile/respondFriendRequest";
import getUserData from "../api/user/getUserData";
import cancelFriendRequest from "../api/profile/cancelFriendRequest";
import sendFriendRequest from "../api/profile/sendFriendRequest";
import getShortProfiles from "../api/profile/getShortProfiles";

const FriendList = () => {
  const { isLogged } = useContext(UserContext);

  const axiosInstance = useAxios();

  const [usernameInput, setUsernameInput] = useState("");

  const [invitesToMe, setInvitesToMe] = useState([]);
  const [invitesFromMe, setInvitesFromMe] = useState([]);

  const [usernamesToFetch, setUsernamesToFetch] = useState([]);
  const [profilesFromMe, setProfilesFromMe] = useState([]);
  const [profilesToMe, setProfilesToMe] = useState([]);

  const [stompClient, setStompClient] = useState(null);

  const { refetch: invitesToMeRefetch } = useQuery(
    "getYourInvites",
    () => getYourInvites(axiosInstance),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setInvitesToMe(data.content || []);
        const usernames = data.content.map((friend) => friend.from);

        setProfilesToMe(usernames);
      },
    }
  );

  const { refetch: invitesFromMeRefetch } = useQuery(
    "getSentInvites",
    () => getSentInvites(axiosInstance),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setInvitesFromMe(data.content || []);

        const usernames = data.content.map((friend) => friend.to);
        setProfilesFromMe(usernames);
      },
    }
  );

  const { refetch: userDataRefetch, data: userData } = useQuery(
    "getUserData",
    () => getUserData(axiosInstance),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const usernames = data.friends.map((friend) =>
          friend.username === data.username ? friend.username2 : friend.username
        );
        setUsernamesToFetch(usernames);
      },
    }
  );

  //short profile do znajomych
  const { data: shortProfilesData } = useQuery(
    ["shortProfilesData", usernamesToFetch],
    () => getShortProfiles(axiosInstance, usernamesToFetch),
    {
      refetchOnWindowFocus: false,
      enabled: usernamesToFetch.length > 0,
    }
  );

  //short profile do zaproszen from me
  const { data: shortProfilesFromMeData } = useQuery(
    ["shortProfilesData", profilesFromMe],
    () => getShortProfiles(axiosInstance, profilesFromMe),
    {
      refetchOnWindowFocus: false,
      enabled: profilesFromMe.length > 0,
    }
  );

  //short profile do zaproszen to me
  const { data: shortProfilesToMeData } = useQuery(
    ["shortProfilesToMeData", profilesToMe],
    () => getShortProfiles(axiosInstance, profilesToMe),
    {
      refetchOnWindowFocus: false,
      enabled: profilesToMe.length > 0,
    }
  );

  useEffect(() => {
    const socket = new SockJS(process.env.NEXT_PUBLIC_BACKEND_URL + "/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {},
      onConnect: () => {
        //nasluchiwanie do odbierania zaproszen od innych
        client.subscribe(
          `/user/${userData.username}/friendRequest/to`,
          (message) => {
            setInvitesToMe((prevInvites) => [...prevInvites, message.body]);
            invitesToMeRefetch();
          }
        );

        //nasluchiwanie do wyswietlania zaproszen do innych
        client.subscribe(
          `/user/${userData.username}/friendRequest/from`,
          (message) => {
            setInvitesFromMe((prevInvites) => [...prevInvites, message.body]);
            invitesFromMeRefetch();
          }
        );

        //nasluchiwanie do reakcji cofniecie/wyslanie zaproszenia do innych - nie wprowadzone
        client.subscribe(
          `/user/${userData.username}/delete/friendRequest/from`,
          (message) => {
            setInvitesFromMe((prevData) =>
              prevData.filter((request) => request._id !== message.body)
            );
            invitesFromMeRefetch();
            userDataRefetch();
          }
        );

        //nasluchiwanie do reakcji zaakceptowanie/odrzucenie kogos do listy znajomych
        client.subscribe(
          `/user/${userData.username}/delete/friendRequest/to`,
          (message) => {
            setInvitesToMe((prevData) =>
              prevData.filter((request) => request._id !== message.body)
            );
            invitesToMeRefetch();
            userDataRefetch();
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

  //wysylanie zaproszenia do znajomych
  const {
    mutateAsync: handleSendFriendRequest,
    error: sendFriendRequestError,
    isError: sendFriendRequestIsError,
  } = useMutation(
    () => {
      sendFriendRequest(axiosInstance, usernameInput);
    },
    {
      onSuccess: (data) => {
        setUsernameInput("");
      },
      onError: (error) => {
        console.error("Error adding friend:", error);
      },
    }
  );

  //odrzucanie lub akceptowanie do znajomych
  const { mutateAsync: handleFriendRequest } = useMutation(
    ({ reqId, response }) => {
      respondFriendRequest(axiosInstance, reqId, response);
    },
    {
      onError: (error) => {
        console.error("Error dwith friend request:", error);
      },
    }
  );

  //usuwanie znajomego
  const { mutateAsync: handleDeleteFriend } = useMutation(
    (friendId) => {
      deleteFriend(axiosInstance, friendId);
    },
    {
      onSuccess: () => {
        userDataRefetch();
      },
      onError: (error) => {
        console.error("Error deleting friend:", error);
      },
    }
  );

  //usuwanie zaproszenia do znajomych
  const { mutateAsync: handleCancelFriendRequest } = useMutation(
    (requestId) => {
      cancelFriendRequest(axiosInstance, requestId);
    },
    {
      onSuccess: () => {
        invitesFromMeRefetch();
      },
      onError: (error) => {
        console.error("Error canceling friend rqeust:", error);
      },
    }
  );

  const getImageSrc = (image) => {
    if (image && image.data) {
      return `data:${image.contentType};base64,${image.data}`;
    }
    return null;
  };

  return (
    <Sheet>
      <SheetTrigger>
        <IoPeople className="text-[30px] text-[#F5B800] hover:text-silver transition-colors duration-150"></IoPeople>
      </SheetTrigger>
      <SheetContent side={"right"} className="bg-night font-dekko">
        <h1 className="text-white-smoke text-center mt-[5%] font-bangers text-[32px]">
          Friends
        </h1>
        <div className="mt-[4%] flex items-center justify-center text-white-smoke bg-transparent rounded-3xl border-[1px] border-white-smoke  w-full ">
          <input
            type="text"
            placeholder="Add a friend"
            className="py-2 px-5 bg-transparent w-[80%] focus:outline-none text-[20px] 
            "
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
          <button
            className="text-[28px] hover:text-amber transition-none duration-150 w-[20%] flex justify-center items-center"
            onClick={() => handleSendFriendRequest()}
          >
            <IoPersonAddSharp></IoPersonAddSharp>
          </button>
        </div>

        <div>
          <h1 className="mt-[6%] text-white-smoke text-[24px] font-bangers text-center">
            Sent invites:
          </h1>
          <div className="flex flex-col gap-y-2 mt-[2%]">
            {invitesFromMe.length > 0 &&
              invitesFromMe.map((invite, key) => {
                return (
                  <div
                    key={key}
                    className="w-full flex justify-between items-center px-3 py-2 text-[18px]"
                  >
                    <div className="flex items-center gap-x-4">
                      {shortProfilesFromMeData &&
                      shortProfilesFromMeData[invite.to]?.image ? (
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-white-smoke overflow-hidden">
                          <img
                            src={getImageSrc(
                              shortProfilesFromMeData[invite.to]?.image
                            )}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      ) : (
                        <div className="w-[32px] h-[32px] bg-night flex items-center justify-center">
                          <FaUser className="text-[16px]"></FaUser>
                        </div>
                      )}

                      <p>{invite.to}</p>
                    </div>
                    <AiOutlineDelete
                      onClick={() => handleCancelFriendRequest(invite._id)}
                      className="text-[20px] hover:text-amber duration-150 transition-all cursor-pointer"
                    ></AiOutlineDelete>
                  </div>
                );
              })}
            {invitesFromMe.length === 0 && (
              <p className="text-center">No sent invites</p>
            )}
          </div>
          <h1 className="mt-[6%] text-white-smoke text-[24px] font-bangers text-center">
            My invites:
          </h1>
          <div className="flex flex-col gap-y-2 mt-[2%]">
            {invitesToMe.length > 0 &&
              invitesToMe.map((invite, key) => {
                return (
                  <div
                    key={key}
                    className="w-full flex justify-between items-center px-3 py-2 text-[18px]"
                  >
                    <div className="flex items-center gap-x-4">
                      {shortProfilesToMeData &&
                      shortProfilesToMeData[invite.from]?.image ? (
                        <div className="w-[32px] h-[32px] rounded-full border-[1px] border-white-smoke overflow-hidden">
                          <img
                            src={getImageSrc(
                              shortProfilesToMeData[invite.from]?.image
                            )}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      ) : (
                        <div className="w-[32px] h-[32px] bg-night flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                          <FaUser className="text-[16px]"></FaUser>
                        </div>
                      )}

                      <p>{invite.from}</p>
                    </div>
                    <div className="flex gap-x-3 items-center">
                      <BiSolidLock
                        onClick={() =>
                          handleFriendRequest({
                            reqId: invite._id,
                            response: true,
                          })
                        }
                        className="text-[20px] hover:text-amber duration-150 transition-all cursor-pointer"
                      ></BiSolidLock>
                      <AiOutlineDelete
                        onClick={() =>
                          handleFriendRequest({
                            reqId: invite._id,
                            response: false,
                          })
                        }
                        className="text-[20px] hover:text-amber duration-150 transition-all cursor-pointer"
                      ></AiOutlineDelete>
                    </div>
                  </div>
                );
              })}
            {invitesToMe.length === 0 && (
              <p className="text-center">No invites available</p>
            )}
          </div>
        </div>

        <h1 className="mt-[6%] text-white-smoke text-[24px] font-bangers text-center">
          My friends
        </h1>
        {isLogged && userData?.friends && userData?.friends?.length > 0 ? (
          userData.friends.map((friend, key) => {
            const friendUsername =
              friend.username !== userData._id
                ? friend.username
                : friend.username2;
            return (
              <div
                key={key}
                className="w-full flex justify-between items-center px-3 py-2 text-[18px]"
              >
                <div className="flex items-center gap-x-4">
                  {shortProfilesData &&
                  shortProfilesData[friendUsername]?.image ? (
                    <div className="w-[32px] h-[32px] rounded-full border-[1px] border-white-smoke overflow-hidden">
                      <img
                        src={getImageSrc(
                          shortProfilesData[friendUsername]?.image
                        )}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="w-[32px] h-[32px] bg-night flex items-center justify-center border-[1px] border-white-smoke rounded-full">
                      <FaUser className="text-[16px]"></FaUser>
                    </div>
                  )}

                  <p>{friendUsername}</p>
                </div>
                <AiOutlineDelete
                  onClick={() => handleDeleteFriend(friend._id)}
                  className="text-[20px] hover:text-amber duration-150 transition-all cursor-pointer"
                ></AiOutlineDelete>
              </div>
            );
          })
        ) : (
          <p className="text-center">No friends available</p>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FriendList;
