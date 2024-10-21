"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEnvelope, FaCalendarAlt, FaDoorOpen, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";
import {useRouter} from "next/navigation";
import Spinner from "@/app/components/Spinner";

interface User {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  rooms: Room[];
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  images: string[];
  price: number;
}
export default function UserProfile({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User>();
  const [loading,setLoading]= useState(true)
  const context = useAuth();
  const router= useRouter()

  useEffect(() => {
    async function fetchUser() {
      
      const response = fetch(`/api/users/${params.id}`);
      const data = await (await response).json();
      return data;
    }

    fetchUser().then((data) => {
      setUser(data.user);
      setLoading(false);
    });
  }, [params.id]);

  async function sendMessage(userId: string) {

    if(!context?.user) {
      router.push("/login")
    }else{
      const res = await fetch(`/api/messages/send`, {
        method: 'POST',
        body: JSON.stringify({ 
          receiverId: params.id,
        })
      })
      const data = await res.json()
      
      if(data.conversationId){
        router.push(`/profile/messages/${data.conversationId}`)
      }
    }  
  }

  if(loading) return <Spinner/>

  return (
    <div className="container mx-auto bg-white shadow-xl rounded-lg p-6 mt-8 mb-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
              <Image
                src={user?.avatar!}
                alt={user?.name!}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {user?.name}
            </h1>
            <p className="text-sm text-gray-600 mb-4">{user?.bio}</p>

            
              <button
                onClick={()=> sendMessage(user?.id!)}
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200 text-center mb-4 ${context?.user==user?.id ? 'hidden': ""}`}
              >
                <FaEnvelope className="inline-block mr-2" />
                Message User
              </button>
            
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600 mb-4">{user?.bio}</p>
            <div className="flex items-center text-gray-600 mb-2">
              <FaCalendarAlt className="mr-2" />
              <span>Joined {user?.createdAt}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaDoorOpen className="mr-2" />
              <span>First room created {user?.rooms.length}</span>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 mt-6 md:mt-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Rooms Created
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user?.rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ${room?.price} / night
                  </p>
                  <Link
                    href={`/rooms/${room.id}`}
                    className="bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 transition duration-200 text-sm"
                  >
                    View Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
