
import { FaCheckCircle, FaTimesCircle, FaUserFriends, FaTrash } from 'react-icons/fa';

interface Notification {
    id: string;
    type: 'accept' | 'reject' | 'full';
    text: string;
    createdAt: string;
}

const getIcon = (type: string) => {
    switch (type) {
      case 'accept':
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case 'reject':
        return <FaTimesCircle className="text-red-500 text-xl" />;
      case 'full':
        return <FaUserFriends className="text-yellow-500 text-xl" />;
      default:
        return null;
    }
  };


export default function Notification({
  notification,
}: {
  notification: Notification;
}) {

    const deleteNotification = async (id: string) => {
        try {
            const response = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            if(data.status === 200){
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }


  return (
    <div
      key={notification.id}
      className="bg-white shadow-md rounded-lg p-4 flex items-start"
    >
      <div className="mr-4 mt-1">{getIcon(notification.type)}</div>
      <div className="flex-grow">
        <p className="text-gray-800 mb-1">{notification.text}</p>
        <p className="text-sm text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => {deleteNotification(notification.id)}}
        className="text-red-500 hover:text-red-700 transition-colors duration-200"
        aria-label="Delete notification"
      >
        <FaTrash />
      </button>
    </div>
  );
}
