import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb.[backend]'
import Image from 'next/image'
import ReviewForm from '@/app/components/ReviewForm'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import SelfDriveBookingForm from '@/app/components/SelfDriveBookingForm'
import CarWithDriverBookingForm from '@/app/components/CarWithDriverBookingForm'

async function getCarDetails(id: string) {
  const { db } = await connectToDatabase()
  const car = await db.collection('cars').findOne({ _id: new ObjectId(id) })
  const reviews = await db.collection('reviews')
    .find({ itemId: new ObjectId(id), itemType: 'car' })
    .sort({ createdAt: -1 })
    .toArray()
  return { car, reviews }
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const { car, reviews } = await getCarDetails(params.id)

  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!car) {
    return <div>Car not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{car.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image src={car.imageUrl} alt={car.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div>
          <p className="text-xl mb-2">Price: ₹{car.pricePerDay}/day</p>
          <p className="mb-2">Fuel Type: {car.fuelType}</p>
          <p className="mb-2">Transmission: {car.transmission}</p>
          <p className="mb-2">Average Rating: {car.averageRating ? car.averageRating.toFixed(1) : 'No ratings yet'}</p>
          <p className="mb-4">{car.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Book This Car</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SelfDriveBookingForm carId={car._id.toString()} carName={car.name} pricePerDay={car.pricePerDay} />
          <CarWithDriverBookingForm carId={car._id.toString()} carName={car.name} pricePerDay={car.pricePerDay} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id.toString()} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-2">{'★'.repeat(review.rating)}</span>
                  <span className="text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
        {decodedToken && <ReviewForm itemId={params.id} itemType="car" />}
      </div>
    </div>
  )
}

