import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import { connectToDatabase } from '@/lib/mongodb.[backend]'
import { ObjectId } from 'mongodb'
import Link from 'next/link'
import CancelBookingButton from '@/app/components/CancelBookingButton'

async function getBookingDetails(bookingId: string, userId: string) {
  const { db } = await connectToDatabase()
  const booking = await db.collection('bookings').findOne({
    _id: new ObjectId(bookingId),
    userId: new ObjectId(userId)
  })

  if (!booking) {
    return null
  }

  let itemDetails;
  if (booking.bookingType === 'car') {
    itemDetails = await db.collection('cars').findOne({ _id: new ObjectId(booking.carId) })
  } else if (booking.bookingType === 'tour') {
    itemDetails = await db.collection('tours').findOne({ _id: new ObjectId(booking.tourId) })
  }

  return { ...booking, itemDetails }
}

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!decodedToken) {
    return <div>Please log in to view booking details.</div>
  }

  const booking = await getBookingDetails(params.id, decodedToken.userId)

  if (!booking) {
    return <div>Booking not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-xl font-semibold mb-4">
          {booking.bookingType === 'car' ? 'Car Rental' : 'Tour'}: {booking.itemDetails.name}
        </p>
        <p className="mb-2">Booking ID: {booking._id.toString()}</p>
        <p className="mb-2">Start Date: {new Date(booking.startDateTime).toLocaleString()}</p>
        <p className="mb-2">End Date: {new Date(booking.endDateTime).toLocaleString()}</p>
        <p className="mb-2">Total Price: ₹{booking.totalPrice}</p>
        <p className="mb-2">Status: {booking.status}</p>
        <p className="mb-4">Payment Status: {booking.paymentStatus || 'Pending'}</p>
        {booking.bookingType === 'car' && (
          <>
            <p className="mb-2">Fuel Type: {booking.itemDetails.fuelType}</p>
            <p className="mb-2">Transmission: {booking.itemDetails.transmission}</p>
          </>
        )}
        {booking.bookingType === 'tour' && (
          <p className="mb-2">Tour Duration: {booking.itemDetails.duration}</p>
        )}
        <div className="mt-4 space-x-4">
          <Link href="/bookings" className="text-blue-600 hover:underline">
            Back to All Bookings
          </Link>
          {booking.status !== 'Cancelled' && (
            <CancelBookingButton bookingId={booking._id.toString()} />
          )}
        </div>
      </div>
    </div>
  )
}

