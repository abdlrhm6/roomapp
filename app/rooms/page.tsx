'use client'

import FilterBar from "../components/FilterBar";
import RoomCard from "../components/RoomCard";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

interface Room {
  id: string
  name: string
  currentCapacity: number
  fullCapacity: number
  price: number,
  images: string[]
}




export default function Rooms() {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/all-rooms'); 
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);


 const onclick = async (filters: {country: string,city: string,price: number,type: string}) => {
  setLoading(true);
    try {
      const response = await fetch(`/api/all-rooms?country=${filters.country}&city=${filters.city}&price=${filters.price}&type=${filters.type}`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Rooms</h1>
      <div className="flex gap-4 flex-col sm:flex-row">
        <FilterBar onclick={onclick} />
        <div className="container mx-auto px-4 mt-4">
          {loading ? (
            <Spinner />
          ) : (
            rooms.length === 0 ? (
              <p>No rooms found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                  rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))
                }
              </div>
            )
          )}
        </div>
        
      </div>
    </div>
  );
}
