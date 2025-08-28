import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000"); 

const Chat = () => {
  const location = useLocation();
  const { role, id } = location.state || {};

  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const boxRef = useRef(null);

  const fetchMessages = async () => {
    if (id && receiverId) {
      axios
        .get(`http://localhost:8000/api/chat/${id}/${receiverId}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => console.error(err));
    }
  }

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (id) {
      socket.emit("join", { role, id });
    }

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, [id, role]);

  const sendMessage = () => {
    if (message && receiverId) {
      socket.emit("message", {
        senderId: id,
        receiverId,
        text: message,
      });

      setMessages((prev) => [
        ...prev,
        { senderId: id, receiverId, message, createdAt: new Date() },
      ]);

      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat Page</h2>
      <p>
        Logged in as: {role} (ID: {id})
      </p>

      <input
        type="text"
        placeholder="Enter Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <button onClick={fetchMessages}>Load Chat</button>
      <br />

      <div
        ref={boxRef}
        style={{
          border: "1px solid black",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginTop: "10px",

          
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.senderId}:</b> {msg.message || msg.text} <br />
            <small>
              {new Date(msg.createdAt || Date.now()).toLocaleString()}
            </small>
          </p>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
