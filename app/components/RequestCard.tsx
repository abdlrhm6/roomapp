"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

interface RoommateRequest {
    id: string;
    room: {
      name: string,
      id: string
    }
    sender: {
      avatar: string,
      name: string,
      id: string
    }
    message: string;
    createdAt: Date;
  }


export default function RequestCard({ request }: { request: RoommateRequest }) {

    const router = useRouter()

    async function handleAccept(id: string, room: {name: string, id: string}, sender: {name: string, id: string}) {
        try {
            const res = await fetch(`/api/requests/accept`, {
                method: 'POST',
                body: JSON.stringify({ requestId:id, room, sender })
            })

            const data = await res.json()
            console.log(data)
            if(data.status === 200){
                router.push("/profile/my-rooms")
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    }
    
    async function handleReject(id: string, room: string, sender: {name: string, id: string}) {
        const res = await fetch(`/api/requests/reject`, {
            method: 'POST',
            body: JSON.stringify({ id, room, sender })
        })

        const data = await res.json()
        if(data.status === 200){
            router.push("/profile")
        }   
    }
    

    async function handleReply(sender: {name: string, id: string}) {
        
      
      const res = await fetch(`/api/messages/send`, {
        method: 'POST',
        body: JSON.stringify({ 
          receiverId: sender.id
           })
      })
      const data = await res.json()
      
      if(data.conversationId){
        router.push(`/profile/messages/${data.conversationId}`)
      }
      
    }



  return (
    <div  className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={request?.sender?.avatar}
            alt={request?.sender?.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{request?.sender?.name}</h3>
            <p className="text-sm text-gray-600">For: {request?.room?.name}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{request?.message}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
              {new Date(request?.createdAt).toLocaleString()}
        </p>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 items-center justify-center ">
          <button
          
          onClick={() => handleReply(request?.sender)}
          className="bg-yellow-500 text-white font-bold sm:py-2 sm:px-4 py-1 px-2 rounded-full transition duration-200 flex items-center">
            <FaMessage className="mr-2" /> Reply
          </button>
          <button
                onClick={() => handleAccept(request?.id,request?.room,request?.sender)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold sm:py-2 sm:px-4 py-1 px-2  rounded-full transition duration-200 flex items-center">
            <FaCheck className="mr-2" /> Accept
          </button>
          <button 
            onClick={() => handleReject(request?.id,request?.room.name,request?.sender)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold sm:py-2 sm:px-4 py-1 px-2  rounded-full transition duration-200 flex items-center">
            <FaTimes className="mr-2" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
