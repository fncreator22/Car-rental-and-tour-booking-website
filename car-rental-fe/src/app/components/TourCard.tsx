import Image from 'next/image'
import Link from 'next/link'

interface TourCardProps {
  _id: string
  name: string
  price: number
  duration: string
  imageUrl: string
  description: string
}

export default function TourCard({ _id, name, price, duration, imageUrl, description }: TourCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image src={imageUrl} alt={name} width={300} height={200} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">₹{price}</p>
        <p className="text-sm text-gray-500 mb-2">Duration: {duration}</p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{description}</p>
        <Link
          href={`/tour-booking/${_id}`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

