"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/auth";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    id: string;
  };
  receiver: {
    name: string;
    avatar: string;
    id: string;
  };
  text: string;
  createdAt: string;
}

export default function SingleMessagePage({
  params,
}: {
  params: { id: string };
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const context = useAuth();

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${params.id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.messages) {
          console.log(data.messages);

          setMessages(data.messages);
          context?.setReceiverId(data.receiverId);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const tempMessage = {
        id: 'temp-' + Date.now(),
        sender: {
          id: context?.user ?? "",
          name: "You",
          avatar: context?.user === messages[0]?.sender?.id ? messages[0]?.sender?.avatar : messages[0]?.receiver?.avatar,
        },
        receiver: {
          id: context?.receiverId ?? "",
          name: "", 
          avatar: "", 
        },
        text: newMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      // Update UI immediately
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage("");

      // Send message to server
      const message = {
        text: newMessage.trim(),
        conversationId: params.id,
        senderId: context?.user,
        receiverId: context?.receiverId ?? "",
      };

      try {
        const res = await fetch(`/api/messages/send`, {
          method: "POST",
          body: JSON.stringify(message),
        });

        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // You might want to handle this error, e.g., by showing a notification to the user
      }
    }
  };

  const bubbleStyle = (message: Message) => {
    return message?.sender?.id === context?.user ? "bg-blue-500 text-white ml-auto" : "bg-white mr-auto";
  };

  const senderStyle = (message: Message) => {
    if (message?.sender?.id == context?.user) {
      return "You";
    }
    return message.sender.name;
  };

  const alignStyle = (message: Message) => {
    return message?.sender?.id === context?.user ? "flex-row-reverse" : "flex-row";
  };

  const receiverName = (message: Message) => {
    if (message?.sender?.id == context?.user) {
      return message?.receiver?.name;
    }
    return message?.sender?.name;
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 rounded-md flex items-center">
        <Link href="/profile/messages" className="mr-4">
          <FaArrowLeft className="text-gray-600" />
        </Link>
        <h2 className="text-2xl font-bold">
          Chat with {receiverName(messages[0])}
        </h2>
      </div>
      <div
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4"
      >
        {messages?.map((message: any) => (
          <div key={message?.id} className={`flex ${alignStyle(message)} items-start gap-2 mb-4`}>
            <Image 
              className="w-10 h-10 rounded-full"
              src={message?.sender?.avatar} alt="avatar" width={40} height={40} 
            />
            <div className="flex flex-col max-w-[70%]">
              <div className="font-semibold text-sm mb-1 text-gray-500">{senderStyle(message)}</div>
              <div
                className={`rounded-lg py-2 px-3 ${bubbleStyle(message)} shadow`}
              >
                {message?.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message?.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-r-lg transition duration-200 flex items-center"
          >
            <FaPaperPlane className="mr-2" /> Send
          </button>
        </div>
      </form>
    </div>
  );
}
