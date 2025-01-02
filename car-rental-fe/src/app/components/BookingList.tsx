import Link from 'next/link'

interface Booking {
  _id: string
  carId: string
  startDateTime: string
  endDateTime: string
  totalPrice: number
  status: string
}

interface BookingListProps {
  bookings: Booking[]
}

export default function BookingList({ bookings }: BookingListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left">Booking ID</th>
            <th className="py-3 px-6 text-left">Dates</th>
            <th className="py-3 px-6 text-left">Total Price</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id.toString()} className="border-b">
              <td className="py-4 px-6">{booking._id.toString().slice(-6)}</td>
              <td className="py-4 px-6">
                {new Date(booking.startDateTime).toLocaleDateString()} - {new Date(booking.endDateTime).toLocaleDateString()}
              </td>
              <td className="py-4 px-6">₹{booking.totalPrice}</td>
              <td className="py-4 px-6">{booking.status}</td>
              <td className="py-4 px-6">
                <Link href={`/bookings/${booking._id}`} className="text-blue-600 hover:underline">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

