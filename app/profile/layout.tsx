'use client'

import Link from 'next/link';
import { FaUser, FaEdit, FaLock, FaBell } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { FaHouse, FaMessage, FaPlus } from 'react-icons/fa6';







export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <div className=" mx-auto flex flex-col md:flex-row  bg-gray-100 border border-gray-300" >
      {/* Left sidebar menu */}
      <nav className="w-full md:w-64 bg-white p-6 border-t md:border-t-0 md:border-r border-gray-300 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile</h2>
        <ul className="space-y-4">
          {[
            { href: "/profile", icon: FaUser, label: "Overview" },
            { href: "/profile/edit", icon: FaEdit, label: "Edit Profile" },
            { href: "/profile/my-rooms", icon: FaHouse, label: "My Rooms" },
            { href: "/profile/room-requests", icon: FaPlus, label: "Room Requests" },
            {href: "/profile/messages", icon: FaMessage, label: "Messages"},
            {href: "/profile/notifications", icon: FaBell, label: "Notifications"}
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center text-gray-600  ${
                  pathname === item.href ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                <item.icon className="mr-3 text-lg" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area */}
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
