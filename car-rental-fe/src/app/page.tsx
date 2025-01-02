import Image from 'next/image'
import Link from 'next/link'
import CarCard from './components/CarCard'
import TourCard from './components/TourCard'
import { connectToDatabase } from '@/lib/mongodb.[backend]'

async function getFeaturedCarsAndTours() {
  const { db } = await connectToDatabase()
  
  const featuredCars = await db.collection('cars')
    .find({ featured: true })
    .limit(3)
    .toArray()

  const featuredTours = await db.collection('tours')
    .find({ featured: true })
    .limit(3)
    .toArray()

  return { featuredCars, featuredTours }
}

export default async function Home() {
  const { featuredCars, featuredTours } = await getFeaturedCarsAndTours()

  return (
    <main className="container mx-auto px-6 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Tripura Car Rental & Tours</h1>
        <p className="text-xl text-gray-600 mb-8">Discover the beauty of Tripura with our premium car rental and tour services.</p>
        <div className="flex space-x-4">
          <Link href="/car-rental" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
            Rent a Car
          </Link>
          <Link href="/tour-booking" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300">
            Book a Tour
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <CarCard key={car._id.toString()} {...car} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Popular Tours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTours.map((tour) => (
            <TourCard key={tour._id.toString()} {...tour} />
          ))}
        </div>
      </section>
    </main>
  )
}

