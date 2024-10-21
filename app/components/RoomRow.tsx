import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/auth";

export default function RoomRow({ room }: { room: any }) {
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/rooms/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const context = useAuth();

  return (
    <tr key={room.id} className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-4">
        <Image
          src={room?.images[0]}
          alt="Room Image"
          width={100}
          height={100}
        />
      </td>
      <td className="py-3 px-4">{room.name}</td>
      <td className="py-3 px-4">${room.price}</td>
      <td className="py-3 px-4">
        {room.currentCapacity}/{room.fullCapacity}
      </td>
      <td className="py-3 px-4">
        <div className="flex space-x-2">
          <Link
            href={`my-rooms/${room.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Goo to room page
          </Link>

          {room.userId == context?.user && (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
              onClick={() => handleDelete(room.id)}
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
