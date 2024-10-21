'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaDollarSign, FaUsers, FaComments, FaEllipsisV } from 'react-icons/fa';
import Spinner from '@/app/components/Spinner';
import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  price: number;
  currentCapacity: number;
  description: string;
  images: string[];
  user: {
    id: string
  }
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const context = useAuth();
  const router = useRouter()
  

  useEffect(() => {
    // Fetch room details
    Promise.all([
      fetch(`/api/rooms/my-rooms/${params.id}`,{
        credentials:"include"
      }).then(response => response.json()),
      fetch(`/api/messages/room/${params.id}`, {
        credentials: 'include',
        
      }).then(response => response.json())
    ])
      .then(([roomData, messagesData]) => {

        console.log(roomData)
        if (!roomData || !messagesData) {
          throw new Error('Invalid response data');
        }
        setRoom(roomData.room);
        setParticipants(roomData.members);
        if (messagesData.conversation && messagesData.conversation.messages) {
          setMessages(messagesData.conversation.messages);
        } else {
          console.warn('No messages found in the response');
          setMessages([]);
        }
      })
      .catch(error => {
        console.error('Error fetching room details and messages:', error);
      });
  }, [params.id]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const getUserName = (messages: Message[]) => {
    let userName = "";

    for (const message of messages) {
      if (message.sender.id === context?.user) {
        userName = message.sender.name;
      }
    }
    return userName;
  }

  const getUserAvatar = (messages: Message[]) => {
    let userAvatar = "";
    for (const message of messages) {
      if (message.sender.id === context?.user) {
        userAvatar = message.sender.avatar;
      }
    }
    return userAvatar;
  }
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && context?.user) {
      // Create a temporary message object
      const tempMessage: Message = {
        id: Date.now().toString(), // Temporary ID
        sender: {
          id:  "1",  //context?.user.id,
          name: getUserName(messages),
          avatar: getUserAvatar(messages),
        },
        text: newMessage.trim(),
        createdAt: new Date().toISOString(),
      };

      // Update the messages state immediately
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage('');

      try {
        const response = await fetch('/api/messages/room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId: params.id,
            text: tempMessage.text,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        // Replace the temporary message with the one from the server
        setMessages(prevMessages =>
          prevMessages.map(msg => msg.id === tempMessage.id ? data.message : msg)
        );
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove the temporary message if the API call fails
        setMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== tempMessage.id)
        );
        // You might want to show an error message to the user here
      }
    }
  };

  const leaveRoom= async (roomId: string) => {
    try {
      const response = await fetch('/api/rooms/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: roomId,
        }),
      });
  
      const data = await response.json();
      
      if(data.success){
       router.push("/profile/my-rooms");
      }
      }
    catch (error) {
      console.log(error)
    }
  }
  if (!room) {
    return <Spinner/>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{room.name}</h1>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaEllipsisV size={24} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  
                  <button
                  
                  onClick={() => { leaveRoom(room.id)}} className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 ${room.user.id === context?.user  ? 'hidden': 
                  ''
                  }`}>
                    Leave room
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center mb-2">
            <FaDollarSign className="text-gray-600 mr-2" />
            <span className="text-xl font-semibold">${room.price} / Month</span>
          </div>
          <div className="flex items-center mb-4">
            <FaUsers className="text-gray-600 mr-2" />
            <span>Capacity: {room.currentCapacity} guests</span>
          </div>
          <p className="text-gray-600 mb-4">{room.description}</p>

          {/* Participants avatars */}
          <div className="flex -space-x-2 overflow-hidden mb-4">
            {participants.map((participant, index) => (
              <Image
                key={participant.id}
                src={participant.avatar}
                alt={participant.name}
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                style={{ zIndex: participants.length - index }}
              />
            ))}
            {participants.length > 4 && (
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 ring-2 ring-white text-sm font-medium text-gray-700">
                +{participants.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaComments className="mr-2" /> Chat
          </h2>
          <div
            ref={chatContainerRef}
            className="bg-gray-100 rounded-lg p-4 overflow-y-auto mb-4 h-screen"
          >
            {messages.map((message) => (
              <div key={message.id} className="mb-4 flex items-start">
                <Image
                key={message.sender.avatar}
                src={message.sender.avatar}
                alt={message.sender.name}
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white mr-4"
                
              />
                <div className="flex-1">
                  <div className="font-semibold">{message.sender.name}</div>
                  <div className="bg-white rounded-lg p-2 shadow">
                    {message.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
