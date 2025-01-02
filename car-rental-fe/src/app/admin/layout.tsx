import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'
import { redirect } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!decodedToken || decodedToken.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link href="/admin" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/admin/cars" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
            Manage Cars
          </Link>
          <Link href="/admin/tours" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
            Manage Tours
          </Link>
          <Link href="/admin/bookings" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
            Manage Bookings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

