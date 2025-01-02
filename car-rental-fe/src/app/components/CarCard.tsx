'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart } from 'lucide-react'

interface CarCardProps {
  _id: string
  name: string
  pricePerDay: number
  fuelType: string
  isAvailable: boolean
  imageUrl: string
  isFavorite: boolean
}

export default function CarCard({ _id, name, pricePerDay, fuelType, isAvailable, imageUrl, isFavorite }: CarCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)

  const toggleFavorite = async () => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: _id }),
      })

      if (response.ok) {
        setFavorite(!favorite)
      } else {
        console.error('Failed to update favorite')
      }
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <Image src={imageUrl} alt={name} width={300} height={200} className="w-full h-48 object-cover" />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">₹{pricePerDay}/day</p>
        <p className="text-sm text-gray-500 mb-2">Fuel: {fuelType}</p>
        <p className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'} mb-4`}>
          {isAvailable ? 'Available' : 'Not Available'}
        </p>
        <Link
          href={`/car-rental/${_id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

