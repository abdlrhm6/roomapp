"use client";

import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaReply } from "react-icons/fa";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    name: string;
    avatar: string;
  };
 
  text: string;
  createdAt: string;
}
interface Conversation {
  id: string;
  messages: Message[];
  participants: string[];
}

export default function MessagesList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const  context=useAuth()

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const response = await fetch("/api/messages", {
      credentials: "include",
    });
    const data = await response.json();
    if (data.status === 200) {
      setLoading(false);
      setConversations(data.messages);
      console.log(data);
      setConversations(data.conversations);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const getConversationUser=(conversation: Conversation)=>{

    return conversation.messages[0].sender.id == context?.user ? conversation.messages[0].receiver:conversation.messages[0].sender

  }

  const getLastMessageSenderName = (conversation: Conversation) => {
    return conversation.messages[conversation.messages.length - 1].sender.id == context?.user ? "You ":conversation.messages[conversation.messages.length - 1].sender.name
  }

  return (
    <div className="container mx-auto px-4 py-8 " >
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-600 h-screen">No messages at the moment.</p>
      ) : (
        <div className="space-y-6">
          {conversations?.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={getConversationUser(conversation).avatar}
                    alt={getConversationUser(conversation).name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                  {getConversationUser(conversation).name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(
                      conversation.messages[0].createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                {getLastMessageSenderName(conversation)} :{conversation.messages[conversation.messages.length - 1].text}
              </p>
              <div className="flex justify-end">
                <Link href={`/profile/messages/${conversation.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 flex items-center">
                    <FaReply className="mr-2" /> Reply
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
