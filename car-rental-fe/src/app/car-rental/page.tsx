import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt.[backend]'
import { connectToDatabase } from '@/lib/mongodb.[backend]'
import { ObjectId } from 'mongodb'
import CarCard from '../components/CarCard'
import AdvancedCarSearch from '../components/AdvancedCarSearch'
import Pagination from '../components/Pagination'

const ITEMS_PER_PAGE = 9

async function getCars(searchParams: { [key: string]: string | string[] | undefined }, page: number, userId?: string) {
  const { db } = await connectToDatabase()
  
  const query: any = {}
  
  if (searchParams.name) {
    query.name = { $regex: searchParams.name, $options: 'i' }
  }
  
  if (searchParams.minPrice) {
    query.pricePerDay = { $gte: parseInt(searchParams.minPrice as string) }
  }
  
  if (searchParams.maxPrice) {
    query.pricePerDay = { ...query.pricePerDay, $lte: parseInt(searchParams.maxPrice as string) }
  }
  
  if (searchParams.fuelType) {
    query.fuelType = searchParams.fuelType
  }
  
  if (searchParams.transmission) {
    query.transmission = searchParams.transmission
  }

  const totalCars = await db.collection('cars').countDocuments(query)
  const totalPages = Math.ceil(totalCars / ITEMS_PER_PAGE)

  const cars = await db.collection('cars')
    .find(query)
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .toArray()

  let favorites: ObjectId[] = []
  if (userId) {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    favorites = user?.favorites || []
  }

  const carsWithFavorites = cars.map(car => ({
    ...car,
    isFavorite: favorites.some(fav => fav.equals(car._id))
  }))

  return { cars: carsWithFavorites, totalPages }
}

export default async function CarRentalPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = parseInt(searchParams.page as string) || 1

  const cookieStore = cookies()
  const token = cookieStore.get('token')
  const decodedToken = token ? verifyToken(token.value) : null

  const { cars, totalPages } = await getCars(searchParams, page, decodedToken?.userId)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Car Rental</h1>
      <AdvancedCarSearch />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {cars.map((car) => (
          <CarCard key={car._id.toString()} {...car} />
        ))}
      </div>
      {cars.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No cars found matching your search criteria.</p>
      )}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

