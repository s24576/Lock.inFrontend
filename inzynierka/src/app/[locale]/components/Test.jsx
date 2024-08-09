"use client";
import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const Test = () => {
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    // Tworzenie SockJS i STOMP clienta
    const socket = new SockJS("https://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected");
        client.subscribe("/user/test12/test2", (message) => {
          setReceivedMessage(message.body);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && message.trim() !== "") {
      stompClient.publish({
        destination: "/app/test",
        body: message,
      });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
      />
      <button onClick={sendMessage}>Send Message</button>
      <p>Received Message: {receivedMessage}</p>
    </div>
  );
};

export default Test;
