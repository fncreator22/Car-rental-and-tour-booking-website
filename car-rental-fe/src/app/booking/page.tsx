import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import { connectToDatabase } from '@/lib/mongodb.[backend]'
import { ObjectId } from 'mongodb'
import BookingList from '../components/BookingList'
import Pagination from '../components/Pagination'

const ITEMS_PER_PAGE = 10

async function getUserBookings(userId: string, page: number) {
  const { db } = await connectToDatabase()
  
  const totalBookings = await db.collection('bookings').countDocuments({ userId: new ObjectId(userId) })
  const totalPages = Math.ceil(totalBookings / ITEMS_PER_PAGE)

  const bookings = await db.collection('bookings')
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray()

  return { bookings, totalPages }
}

export default async function UserBookingsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = parseInt(searchParams.page as string) || 1
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!decodedToken) {
    return <div>Please log in to view your bookings.</div>
  }

  const { bookings, totalPages } = await getUserBookings(decodedToken.userId, page)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
      <BookingList bookings={bookings} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

