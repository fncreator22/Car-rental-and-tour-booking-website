import { connectToDatabase } from '@/lib/mongodb.[backend]'
import Link from 'next/link'

async function getAdminStats() {
  const { db } = await connectToDatabase()

  const carsCount = await db.collection('cars').countDocuments()
  const toursCount = await db.collection('tours').countDocuments()
  const bookingsCount = await db.collection('bookings').countDocuments()
  const usersCount = await db.collection('users').countDocuments()

  const recentBookings = await db.collection('bookings')
    .find()
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  const totalRevenue = await db.collection('bookings').aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]).toArray()

  return { 
    carsCount, 
    toursCount, 
    bookingsCount, 
    usersCount, 
    recentBookings, 
    totalRevenue: totalRevenue[0]?.total || 0 
  }
}

export default async function AdminDashboard() {
  const { carsCount, toursCount, bookingsCount, usersCount, recentBookings, totalRevenue } = await getAdminStats()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Cars</h2>
          <p className="text-3xl font-bold">{carsCount}</p>
          <Link href="/admin/cars" className="text-blue-600 hover:underline mt-2 inline-block">Manage Cars</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Tours</h2>
          <p className="text-3xl font-bold">{toursCount}</p>
          <Link href="/admin/tours" className="text-blue-600 hover:underline mt-2 inline-block">Manage Tours</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
          <p className="text-3xl font-bold">{bookingsCount}</p>
          <Link href="/admin/bookings" className="text-blue-600 hover:underline mt-2 inline-block">Manage Bookings</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{usersCount}</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline mt-2 inline-block">Manage Users</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
        <ul>
          {recentBookings.map((booking) => (
            <li key={booking._id.toString()} className="mb-2">
              <p className="font-semibold">{booking.fullName}</p>
              <p className="text-sm text-gray-600">
                {booking.bookingType === 'tour' ? 'Tour' : 'Car'} - {new Date(booking.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Status: {booking.status} | Payment: {booking.paymentStatus || 'Pending'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

