import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import { MobileMenu } from './MobileMenu'

export default function Header() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null
  const isLoggedIn = !!decodedToken

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Tripura Car Rental & Tours
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-800 hover:text-blue-600">Home</Link>
            <Link href="/car-rental" className="text-gray-800 hover:text-blue-600">Car Rental</Link>
            <Link href="/tour-booking" className="text-gray-800 hover:text-blue-600">Tour Booking</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-800 hover:text-blue-600">Dashboard</Link>
                <Link href="/bookings" className="text-gray-800 hover:text-blue-600">My Bookings</Link>
                <Link href="/profile" className="text-gray-800 hover:text-blue-600">Profile</Link>
                <Link href="/api/auth/logout" className="text-gray-800 hover:text-blue-600">Logout</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-800 hover:text-blue-600">Login</Link>
                <Link href="/register" className="text-gray-800 hover:text-blue-600">Register</Link>
              </>
            )}
            <Link href="/contact" className="text-gray-800 hover:text-blue-600">Contact</Link>
          </div>
          <MobileMenu isLoggedIn={isLoggedIn} />
        </div>
      </nav>
    </header>
  )
}

