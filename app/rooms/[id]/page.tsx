"use client";

import RoomImages from "@/app/components/RoomImages";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect, useRouter } from "next/navigation";
import { Router } from "next/router";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface Room {
  id: string;
  name: string;
  images: string[];
  price: number;
  currentCapacity: number;
  description: string;
  amenities: string[];
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  address: string;
  country: string;
  city: string;
  fullCapacity: number;
}

export default function RoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const context = useAuth();
  const router= useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch room");
        }
        const data = await response.json();
        setRoom(data.room);
      } catch (err) {
        setError("Error fetching room data");
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [params.id]);



  const joinRoom = async (data: {messageText: string}, roomId: string) => {

    if(!context?.user) router.push("/login")

    const response = await fetch("/api/requests/join", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: data.messageText,
          roomId
        })
      
      })
      
      const rslt= await response.json()

      if(rslt.status==201) {
        router.push("/rooms")
      }else if(rslt.status==400){
        setError(rslt.message)
      }
  };

  const disableBtn = (context?.user === room?.user?.id) || (room?.fullCapacity == room?.currentCapacity)
  if (loading) return <Spinner />;
  if (!room) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{room?.name}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-64 md:h-full rounded-lg overflow-hidden ">
          <RoomImages images={room?.images} alt={room?.name} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Room Details</h2>
            <p className="text-gray-600 mb-4"><b>Name : </b>{room?.name}</p>
            <p className="text-gray-600 mb-4"><b>Description : </b>{room?.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold text-blue-600">
                ${room?.price} / Month
              </p>
            </div>
            <p className="text-gray-600 my-2">
              <b>Country : </b>
              {room?.country}
            </p>
            <p className="text-gray-600 my-2">
              <b>City:</b> {room?.city}
            </p>
            <p className="text-gray-600 my-2">
              <b>Address: </b> {room?.address}
            </p>
            <p className="text-gray-600">
              
              Capacity: <b className="text-blue-600">
                {room?.currentCapacity}
              </b>/ {room?.fullCapacity} guests
            </p>
            <p className="text-gray-600">created at : {new Date(room.createdAt).toLocaleDateString()} </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div className="flex gap-6 my-3 flex-col items-center">
              <Image
                src={room?.user?.avatar || ""}
                alt={room?.user?.name || ""}
                width={40}
                height={40}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
              />
              <p className="text-gray-600 mb-4">
                Created By : <Link href={`/users/${room?.user?.id}`}>{room?.user?.name}</Link>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 gap-2">
              {room?.amenities?.map((amenity, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit((data) => joinRoom({ messageText: data.messageText }, room.id))}>
            <textarea
              placeholder="Your Message here"
              className="border-2 resize-none  block my-6  shadow-md w-full pt-5 px-4 pb-24 rounded-md border-blue-600"
              {...register("messageText", {
                required: "This Field Is Required.",
              })}
            />
            {errors.messageText && (
              <p className="text-red-600 my-3 ">{errors.messageText.message as React.ReactNode}</p>
            )}

            {error && <p className="text-red-600 my-3">{error}</p>}
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300
            disabled:cursor-not-allowed disabled:bg-blue-100"
              disabled={disableBtn}
              type="submit"
            >
             Send A Join Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
