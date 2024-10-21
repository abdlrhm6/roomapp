'use client'


import Image from 'next/image';
import { FaHeart, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

export default function Services() {
  const [featuredRooms] = useState([
    { id: 1, name: 'Cozy Studio Apartment', image: '/2.jpg', price: 80, location: 'Brooklyn, NY' },
    { id: 2, name: 'Spacious Loft with City View', image: '/3.jpg', price: 120, location: 'Manhattan, NY' },
    { id: 3, name: 'Charming Cottage near Beach', image: '/1.jpg', price: 100, location: 'Hamptons, NY' },
  ]);

  const [achievements] = useState([
    { icon: '🏆', title: 'Super Host', description: 'Achieved Super Host status for exceptional hospitality' },
    { icon: '🌟', title: 'Rising Star', description: 'Named a Rising Star for rapid growth and positive reviews' },
    { icon: '🏡', title: 'Home Away from Home', description: 'Created 10+ highly-rated room listings' },
  ]);


  return (
    <div className="container mx-auto px-4 py-8 my-24">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Featured Rooms Section */}
        <div className="p-6 bg-gray-100">
          <h2 className="text-2xl font-bold mb-4">Featured Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={room.image}
                    alt={room.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2">
                    <FaHeart className="text-red-500" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                  <p className="text-gray-600 mb-2"><FaMapMarkerAlt className="inline mr-1" />{room.location}</p>
                  <p className="text-blue-500 font-bold">${room.price} / night</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}