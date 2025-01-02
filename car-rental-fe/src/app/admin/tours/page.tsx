import Link from 'next/link'
import { connectToDatabase } from '@/lib/mongodb.[backend]'

async function getTours() {
  const { db } = await connectToDatabase()
  return db.collection('tours').find().toArray()
}

export default async function ManageToursPage() {
  const tours = await getTours()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Tours</h1>
      <Link href="/admin/tours/add" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add New Tour
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Duration</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id.toString()} className="border-b">
                <td className="py-4 px-6">{tour.name}</td>
                <td className="py-4 px-6">₹{tour.price}</td>
                <td className="py-4 px-6">{tour.duration}</td>
                <td className="py-4 px-6">
                  <Link href={`/admin/tours/edit/${tour._id}`} className="text-blue-500 hover:underline mr-2">
                    Edit
                  </Link>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

