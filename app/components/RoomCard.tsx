import Image from "next/image";
import Link from "next/link";

interface Room {
  id: string
  name: string
  currentCapacity: number
  fullCapacity: number
  price: number,
  images: string[]
}

export default function RoomCard({ room }: { room: Room }) {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/rooms/${room.id}`}>

        <div className="relative h-48">
          <Image
            src={room.images[0]}
            alt="Room Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-2">Price: ${room.price}/Month</p>
        <p className="text-gray-600">Capacity: {room.currentCapacity} / {room.fullCapacity} guests</p>
      </div>
    </div>
  );
}