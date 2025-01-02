import { connectToDatabase } from '@/lib/mongodb.[backend]'
import TourCard from '../components/TourCard'
import Pagination from '../components/Pagination'
import TourSearch from '../components/TourSearch'

const ITEMS_PER_PAGE = 9

async function getTours(searchParams: { [key: string]: string | string[] | undefined }, page: number) {
  const { db } = await connectToDatabase()
  
  const query: any = {}

  if (searchParams.name) {
    query.name = { $regex: searchParams.name, $options: 'i' }
  }

  if (searchParams.minPrice) {
    query.price = { $gte: parseInt(searchParams.minPrice as string) }
  }

  if (searchParams.maxPrice) {
    query.price = { ...query.price, $lte: parseInt(searchParams.maxPrice as string) }
  }

  if (searchParams.duration) {
    query.duration = searchParams.duration
  }

  const totalTours = await db.collection('tours').countDocuments(query)
  const totalPages = Math.ceil(totalTours / ITEMS_PER_PAGE)

  const tours = await db.collection('tours')
    .find(query)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray()

  return { tours, totalPages }
}

export default async function TourBookingPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = parseInt(searchParams.page as string) || 1
  const { tours, totalPages } = await getTours(searchParams, page)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tour Booking</h1>
      <TourSearch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour._id.toString()} {...tour} />
        ))}
      </div>
      {tours.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No tours found matching your search criteria.</p>
      )}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

