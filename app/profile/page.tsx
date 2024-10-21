'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import RoomCard from '../components/RoomCard';
import Link from 'next/link';


type User = {
  name: string,
  bio: string,
  avatar: string,
  phone: string,
}
export default  function Profile() {
  
  const [user,setUser] = useState<User|null>(null)
  const [rooms,setRooms] = useState([])
  const [isLoading,setIsLoading] = useState(true)


  useEffect(()=>{
    fetch("api/users/me",{
      credentials: 'include'
    }).then(res=>{
      return res.json()
    }
    ).then(
      data=> {
        if(data.user) {
          setUser(data.user)
          setRooms(data.user.rooms)
          setIsLoading(false)
        }
      }
    )
  },[])

  if(isLoading){
    return  <Spinner/>
    
  }
  return (
    <div className=" mx-auto bg-white shadow-xl rounded-lg  ">
      <div className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={user?.avatar || ''}
              alt={user?.name || ''}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">Bio</h2>
          <p className="mt-2 text-gray-600">{user?.bio}</p>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">Rooms Created</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {
              rooms.length === 0 ? (
                <p className='text-gray-600'>You have not created any rooms yet.</p>
              ): (
                rooms.map((room:any) => (
                  <RoomCard key={room.id} room={room} />
                ))
              )
            }
          </div>
        </div>
        
        <Link href="/profile/edit" className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200 block text-center mx-auto my-4">
          <FaUser className="inline-block mr-2" />
          Edit My Profile
        </Link>
      </div>
    </div>
  );
}
