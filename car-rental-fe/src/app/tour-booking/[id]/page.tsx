import { connectToDatabase } from '@/lib/mongodb.[backend]'
import { ObjectId } from 'mongodb'
import Image from 'next/image'
import TourBookingForm from '@/app/components/TourBookingForm'
import ReviewForm from '@/app/components/ReviewForm'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'

async function getTourDetails(id: string) {
  const { db } = await connectToDatabase()
  const tour = await db.collection('tours').findOne({ _id: new ObjectId(id) })
  const reviews = await db.collection('reviews')
    .find({ itemId: new ObjectId(id), itemType: 'tour' })
    .sort({ createdAt: -1 })
    .toArray()
  return { tour, reviews }
}

export default async function TourDetailsPage({ params }: { params: { id: string } }) {
  const { tour, reviews } = await getTourDetails(params.id)

  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  if (!tour) {
    return <div>Tour not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{tour.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image src={tour.imageUrl} alt={tour.name} width={600} height={400} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div>
          <p className="text-xl mb-2">Price: ₹{tour.price}</p>
          <p className="mb-2">Duration: {tour.duration}</p>
          <p className="mb-2">Average Rating: {tour.averageRating ? tour.averageRating.toFixed(1) : 'No ratings yet'}</p>
          <p className="mb-4">{tour.description}</p>
          <TourBookingForm tourId={tour._id.toString()} tourName={tour.name} price={tour.price} />
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
        {decodedToken && <ReviewForm itemId={params.id} itemType="tour" />}
      </div>
    </div>
  )
}

