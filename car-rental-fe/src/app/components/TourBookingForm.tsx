'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DateTimePicker from './DateTimePicker'

interface TourBookingFormProps {
  tourId: string
  tourName: string
  price: number
}

export default function TourBookingForm({ tourId, tourName, price }: TourBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(price)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const bookingData = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/bookings/tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingData, tourId, totalPrice }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/bookings/${data.bookingId}`)
      } else {
        // Handle errors
        console.error('Tour booking failed')
      }
    } catch (error) {
      console.error('Error submitting tour booking:', error)
    }

    setIsSubmitting(false)
  }

  const updateTotalPrice = () => {
    setTotalPrice(price * adults + (price * children * 0.5))
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold mb-4">Book {tourName}</h3>
      <input type="hidden" name="tourId" value={tourId} />
      <DateTimePicker label="Tour Date" name="tourDateTime" required />
      <div className="mb-4">
        <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Adults
        </label>
        <input
          type="number"
          id="adults"
          name="adults"
          min="1"
          value={adults}
          onChange={(e) => {
            setAdults(parseInt(e.target.value))
            updateTotalPrice()
          }}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Children
        </label>
        <input
          type="number"
          id="children"
          name="children"
          min="0"
          value={children}
          onChange={(e) => {
            setChildren(parseInt(e.target.value))
            updateTotalPrice()
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Total Price: ₹{totalPrice}</p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isSubmitting ? 'Booking...' : 'Book Tour'}
      </button>
    </form>
  )
}

