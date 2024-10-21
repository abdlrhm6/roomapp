'use client'


import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const context = useAuth()

  

  useEffect(() => {
    fetch('/api/auth/verify',{
      credentials: 'include'
    }).then(res => res.json()).then(data => {
      
      if(data.user){
        context?.setUser(data.user)
        
      }
      setIsLoading(false)
    }).catch(error => {
      
      setIsLoading(false)
    })
    
  }, [])

   const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        context?.setUser(null);
        // Optionally, you can redirect the user to the home page or login page
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
   }
  
  return (
    <nav className="shadow-md">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className=" text-2xl font-bold">
            Roomat.
          </Link>
          <div className="hidden md:flex space-x-6 items-center justify-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/rooms">Rooms</NavLink>
            
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : context?.user ? (
              <>
                <NavLink href="/profile"> Profile</NavLink>
                <NavLink href="/"
                    
                  > 
                  <button 
                  onClick={logout}
                  className="bg-red-600  text-white font-bold py-2 px-4 rounded-full">logout</button>
                  </NavLink>
                </>
              ) : (
                
               <NavLink href="/login">
                <button className="bg-blue-500  text-white font-bold py-2 px-4 rounded-full  ">
                Login
              </button>
              </NavLink>
            
              )
            }
          </div>
          <button
            className="md:hidden  focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <NavLink href="/" mobile>Home</NavLink>
            <NavLink href="/rooms" mobile>Rooms</NavLink>
            {isLoading ? (
              <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : context?.user ? (
              <>
                <NavLink href="/profile" mobile>Profile</NavLink>
                <NavLink href="/" mobile>
                  <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-full">logout</button>
                </NavLink>
              </>
            ) : (
              <NavLink href="/login" mobile>
                <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">
                  Login
                </button>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
  <Link
    href={href}
    className={` ${
      mobile ? 'block py-2' : ''
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
