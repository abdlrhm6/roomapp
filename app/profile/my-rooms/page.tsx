"use client";
import Link from 'next/link';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import Spinner from '@/app/components/Spinner';
import RoomRow from '@/app/components/RoomRow';

interface Room {
  id: string
  name: string
  currentCapacity: number
  fullCapacity: number
  price: number,
  images: string[]
}

const RoomManagement = () => {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMyRooms = async () => {
      try {
        const response = await fetch('/api/rooms/my-rooms', {
          method: 'GET',
          credentials: "include"
        });



        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRooms();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <Link href="/profile/add-room" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Add Room
        </Link>
      </div>

      {
        rooms.length === 0 ? (
          <p className="text-gray-500">No rooms found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Current Capacity</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms?.map((room) => (
                  <RoomRow key={room.id} room={room} />
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};

export default RoomManagement;