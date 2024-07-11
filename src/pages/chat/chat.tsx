import React, { useEffect, useState } from "react";
import "./Chat.css";
import { FaPowerOff } from "react-icons/fa6";

import { useAuthentication } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
const Chat = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState<any>("");
  const [messages, setMessages] = useState<any>({});

  const context: any = useAuthentication();

  const conversation = context.conversation;

  useEffect(() => {
    if (selectedUser) {
      handleMessageSend();
    }
  }, [selectedUser]);

  const handleMessageSend = async () => {
    try {
      if (messageInput) {
        await context.sendMessage(selectedUser._id, {
          message: messageInput,
        });
        setMessageInput("");
      }
      const message = await context.messages(selectedUser._id);
      setMessages(message.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserMessageList = (user: any) => {
    setSelectedUser(user);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    context.logout();
    navigate("/login");
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h2>User List</h2>
        <ul>
          {conversation.map((user: any) => (
            <li
              key={user?.chatPerson?._id}
              onClick={() => handleUserMessageList(user)}
              className={
                selectedUser &&
                selectedUser?.chatPerson.id === user?.chatPerson._id
                  ? "active"
                  : ""
              }
            >
              {user.chatPerson.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-box">
        <div className="header">
          <h1>{context?.user?.name ? context?.user?.name : ""}</h1>
          <span
            className="cursor-pointer"
            onClick={() => handleLogout()}
            data-testid="logout-icon"
          >
            <FaPowerOff fontSize={20} color="var(--textLight)" />
          </span>
        </div>
        <h2>
          {selectedUser
            ? `Chat with ${selectedUser?.chatPerson?.name}`
            : "Select a user to chat"}
        </h2>
        <div className="message-container">
          {messages.length > 0 ? (
            messages.map((msg: any, index: number) => (
              <div
                key={index}
                className={
                  msg.from._id === context?.user?._id ? "sent" : "received"
                }
              >
                {msg.from._id === context?.user?._id ? (
                  <strong>You:</strong>
                ) : (
                  <strong>{selectedUser.chatPerson.name}:</strong>
                )}
                <br />
                {msg.message}
              </div>
            ))
          ) : (
            <p className="no-messages">No messages yet</p>
          )}
        </div>
        {messages.length > 0 && (
          <div className="input-container">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleMessageSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
