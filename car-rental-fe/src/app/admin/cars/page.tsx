import { connectToDatabase } from '@/lib/mongodb.[backend]'

async function getBookings() {
  const { db } = await connectToDatabase()
  return db.collection('bookings').find().sort({ createdAt: -1 }).toArray()
}

export default async function ManageBookingsPage() {
  const bookings = await getBookings()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Booking ID</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id.toString()} className="border-b">
                <td className="py-4 px-6">{booking._id.toString().slice(-6)}</td>
                <td className="py-4 px-6">{booking.bookingType}</td>
                <td className="py-4 px-6">{booking.fullName}</td>
                <td className="py-4 px-6">{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6">{booking.status || 'Confirmed'}</td>
                <td className="py-4 px-6">
                  <button className="text-blue-500 hover:underline mr-2">View</button>
                  <button className="text-red-500 hover:underline">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

