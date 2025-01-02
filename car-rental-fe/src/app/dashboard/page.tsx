import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import { connectToDatabase } from '@/lib/mongodb.[backend]'
import { ObjectId } from 'mongodb'
import Link from 'next/link'
import CarCard from '../components/CarCard'
import BookingList from '../components/BookingList'

async function getUserData(userId: string) {
  const { db } = await connectToDatabase()
  const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

  if (!user) {
    throw new Error('User not found')
  }

  const favoriteCars = await db.collection('cars')
    .find({ _id: { $in: user.favorites || [] } })
    .toArray()

  const recentBookings = await db.collection('bookings')
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  const upcomingTours = await db.collection('bookings')
    .find({ 
      userId: new ObjectId(userId), 
      bookingType: 'tour',
      startDateTime: { $gte: new Date() }
    })
    .sort({ startDateTime: 1 })
    .limit(3)
    .toArray()

  return { user, favoriteCars, recentBookings, upcomingTours }
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!decodedToken) {
    return <div>Please log in to view your dashboard.</div>
  }

  const { user, favoriteCars, recentBookings, upcomingTours } = await getUserData(decodedToken.userId)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.fullName}</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Favorite Cars</h2>
        {favoriteCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCars.map((car) => (
              <CarCard key={car._id.toString()} {...car} isFavorite={true} />
            ))}
          </div>
        ) : (
          <p>You haven't favorited any cars yet.</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
        <BookingList bookings={recentBookings} />
        <Link href="/bookings" className="text-blue-600 hover:underline mt-4 inline-block">
          View all bookings
        </Link>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Tours</h2>
        {upcomingTours.length > 0 ? (
          <ul className="space-y-4">
            {upcomingTours.map((tour) => (
              <li key={tour._id.toString()} className="bg-white shadow rounded-lg p-4">
                <h3 className="font-semibold">{tour.tourName}</h3>
                <p>Date: {new Date(tour.startDateTime).toLocaleDateString()}</p>
                <Link href={`/bookings/${tour._id}`} className="text-blue-600 hover:underline">
                  View details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no upcoming tours.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
        <div className="flex space-x-4">
          <Link href="/profile" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
            Edit Profile
          </Link>
          <Link href="/car-rental" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300">
            Rent a Car
          </Link>
          <Link href="/tour-booking" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300">
            Book a Tour
          </Link>
        </div>
      </section>
    </div>
  )
}

