'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface MobileMenuProps {
  isLoggedIn: boolean
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="md:hidden">
      <button onClick={toggleMenu} className="p-2">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md p-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Home</Link>
            <Link href="/car-rental" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Car Rental</Link>
            <Link href="/tour-booking" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Tour Booking</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Dashboard</Link>
                <Link href="/bookings" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>My Bookings</Link>
                <Link href="/profile" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Profile</Link>
                <Link href="/api/auth/logout" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Logout</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Login</Link>
                <Link href="/register" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Register</Link>
              </>
            )}
            <Link href="/contact" className="text-gray-800 hover:text-blue-600" onClick={toggleMenu}>Contact</Link>
          </nav>
        </div>
      )}
    </div>
  )
}

