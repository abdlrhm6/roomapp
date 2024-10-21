
import React from 'react';
import Image from 'next/image';

interface Room {
  id: string;
  name: string;
  image: string;
  price: number;
  capacity: number;
}

const mockRooms: Room[] = [
  // Add mock data here
  {
    id: '1',
    name: 'Room 1',
    image: '/1.jpg',
    price: 100,
    capacity: 2,
  },
  {
    id: '2',
    name: 'Room 2',
    image: '/2.jpg',
    price: 150,
    capacity: 3,
  },
  {
    id: '3',
    name: 'Room 3',
    image: '/3.jpg',
    price: 200,
    capacity: 4,
  },
  {
    id: '4',
    name: 'Room 4',
    image: '/1.jpg',
    price: 250,
    capacity: 5,
  },{
    id: '1',
    name: 'Room 1',
    image: '/1.jpg',
    price: 100,
    capacity: 2,
  },
  {
    id: '2',
    name: 'Room 2',
    image: '/2.jpg',
    price: 150,
    capacity: 3,
  },
  {
    id: '3',
    name: 'Room 3',
    image: '/3.jpg',
    price: 200,
    capacity: 4,
  },
  {
    id: '4',
    name: 'Room 4',
    image: '/1.jpg',
    price: 250,
    capacity: 5,
  },{
    id: '1',
    name: 'Room 1',
    image: '/1.jpg',
    price: 100,
    capacity: 2,
  },
  {
    id: '2',
    name: 'Room 2',
    image: '/2.jpg',
    price: 150,
    capacity: 3,
  },
  {
    id: '3',
    name: 'Room 3',
    image: '/3.jpg',
    price: 200,
    capacity: 4,
  },
  {
    id: '4',
    name: 'Room 4',
    image: '/1.jpg',
    price: 250,
    capacity: 5,
  }
];

export default function RoomsGrid() {
  return (
    <div className="container mx-auto px-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={room.image}
                alt={room.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
              <p className="text-gray-600 mb-2">Price: ${room.price}/night</p>
              <p className="text-gray-600">Capacity: {room.capacity} guests</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
